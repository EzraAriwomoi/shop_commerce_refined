import uuid
from flask import Blueprint, Flask, current_app, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import FeaturedProduct, Product
from app.extensions import db, firebase_storage,csrf
from flask_cors import CORS
from flask_cors import cross_origin
from datetime import datetime
from firebase_admin import credentials, storage

app = Flask(__name__)
CORS(app)
products_bp = Blueprint('products', __name__)


@products_bp.route('/', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_products():
    try:
        products = Product.query.all()
        # print("Products fetched from database:", products)  # Debug statement
        result = []
        for product in products:
            result.append({
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'stock': product.stock,
                'image_url': product.image_url,
                'created_at': product.created_at.isoformat(),
                'categories': [category.name for category in product.categories]
            })
        # print("Processed product data:", result)  # Debug statement
        return jsonify(result), 200
    except Exception as e:
        # print("Error fetching products:", str(e))  # Debug statement
        return jsonify({'error': 'Error fetching products'}), 500

@products_bp.route('/products/<int:id>', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_product(id):
    # print(f"Fetching product with ID: {id}")
    product = Product.query.get(id)
    if not product:
        # print("Product not found")
        return jsonify({'error': 'Product not found'}), 404
    
    product_data = {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock': product.stock,
        'image_url': product.image_url,
        'created_at': product.created_at.isoformat(),
        'categories': [category.name for category in product.categories]
    }
    # print(f"Returning product data: {product_data}")
    return jsonify(product_data), 200

@products_bp.route('/products', methods=['POST'])
@cross_origin()
@csrf.exempt
def create_product():
    data = request.form

    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Generate a unique filename and upload to Firebase Storage
        filename = f"{str(uuid.uuid4())}_{image.filename}"
        blob = firebase_storage.blob(filename)

        # Set content type explicitly (optional)
        blob.content_type = 'image/jpeg'

        # Upload the file
        blob.upload_from_file(image)

        # Generate a signed URL with token for public access
        # Token will remain valid based on Firebase Storage rules
        download_url = blob.generate_signed_url(datetime.max)

        # Store the download URL with token in the database
        product = Product(
            name=data.get('name'),
            description=data.get('description'),
            price=float(data.get('price')),
            stock=int(data.get('stock')),
            image_url=download_url,  # Store the generated download URL
            created_at=datetime.utcnow(),
            is_featured=bool(data.get('is_featured', False)),
            featured_priority=int(data.get('featured_priority', 0))
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({'message': 'Product created successfully', 'image_url': download_url}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
        
    
@products_bp.route('/<int:id>', methods=['PUT'])
@cross_origin()
@csrf.exempt
@jwt_required()
def update_product(id):
    data = request.get_json()
    product = Product.query.get(id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.stock = data.get('stock', product.stock)

    db.session.commit()

    return jsonify({'message': 'Product updated successfully'}), 200

@products_bp.route('/<int:id>', methods=['DELETE'])
@cross_origin()
@csrf.exempt
@jwt_required()
def delete_product(id):
    product = Product.query.get(id)

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Delete related featured_product entries
    db.session.query(FeaturedProduct).filter_by(product_id=product.id).delete()

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200
