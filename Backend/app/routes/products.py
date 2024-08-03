import uuid
from flask import Blueprint, Flask, current_app, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import FeaturedProduct, Product, Category, product_category
from app.extensions import db, firebase_storage, csrf
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
products_bp = Blueprint('products', __name__)
CORS(products_bp, resources={r"/*": {"origins": "*"}})

@products_bp.route('/', methods=['GET'])
@csrf.exempt
def get_products():
    try:
        # Get the category query parameter from the request
        category = request.args.get('category')

        if category:
            # Filter products by category
            products = Product.query.filter(Product.categories.any(name=category)).all()
        else:
            # Get all products if no category is specified
            products = Product.query.all()

        # Process the products into a list of dictionaries
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

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching products', 'message': str(e)}), 500

@products_bp.route('/products/<int:id>', methods=['GET'])
@csrf.exempt
def get_product(id):
    try:
        product = Product.query.get(id)
        if not product:
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
        return jsonify(product_data), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching product', 'message': str(e)}), 500

@products_bp.route('/products', methods=['POST'])
@csrf.exempt
def create_product():
    data = request.form

    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Validate and parse the data
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        stock = data.get('stock')
        is_featured = bool(data.get('is_featured', False))
        featured_priority = int(data.get('featured_priority', 0))

        if not name or not price or not stock:
            return jsonify({'error': 'Missing required fields'}), 400

        price = float(price)
        stock = int(stock)

        # Generate a unique filename and upload to Firebase Storage
        filename = f"{str(uuid.uuid4())}_{image.filename}"
        blob = firebase_storage.bucket.blob(filename)
        blob.content_type = image.content_type
        blob.upload_from_file(image)
        download_url = blob.generate_signed_url(datetime.max)

        product = Product(
            name=name,
            description=description,
            price=price,
            stock=stock,
            image_url=download_url,
            created_at=datetime.utcnow(),
            is_featured=is_featured,
            featured_priority=featured_priority
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({'message': 'Product created successfully', 'image_url': download_url}), 201

    except ValueError as ve:
        return jsonify({'error': 'Invalid data', 'message': str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

@products_bp.route('/<int:id>', methods=['PUT'])
@csrf.exempt
@jwt_required()
def update_product(id):
    try:
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
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

@products_bp.route('/<int:id>', methods=['DELETE'])
@csrf.exempt
@jwt_required()
def delete_product(id):
    try:
        product = Product.query.get(id)

        if not product:
            return jsonify({'error': 'Product not found'}), 404

        # Delete related featured_product entries
        db.session.query(FeaturedProduct).filter_by(product_id=product.id).delete()

        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

