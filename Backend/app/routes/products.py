import uuid
import random
from flask import Blueprint, Flask, current_app, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import CORS
from datetime import datetime
from app.models import Product, FeaturedProduct, Category
from app.extensions import db, firebase_storage, csrf

app = Flask(__name__)
products_bp = Blueprint('products', __name__)
CORS(products_bp, resources={r"/*": {"origins": "*"}})

@products_bp.route('/', methods=['GET'])
@csrf.exempt
def get_products():
    try:
        category = request.args.get('category')
        if category and category != 'undefined':
            products = Product.query.filter(Product.categories.any(Category.name == category)).all()
        else:
            products = Product.query.all()

        result = [{
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'stock': product.stock,
            'image_url': product.image_url,
            'created_at': product.created_at.isoformat(),
            'categories': [category.name for category in product.categories]
        } for product in products]

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

        db.session.query(FeaturedProduct).filter_by(product_id=product.id).delete()
        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500
    
@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories])
    except Exception as e:
        return jsonify({'error': 'Error fetching categories', 'message': str(e)}), 500


@products_bp.route('/related/<int:id>', methods=['GET'])
@csrf.exempt
def get_related_products(id):
    try:
        product = Product.query.get(id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404

        categories = [category.name for category in product.categories]

        related_products = Product.query.filter(
            Product.categories.any(Category.name.in_(categories)),
            Product.id != id
        ).limit(10).all()

        result = [{
            'id': prod.id,
            'name': prod.name,
            'description': prod.description,
            'price': prod.price,
            'stock': prod.stock,
            'image_url': prod.image_url
        } for prod in related_products]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching related products', 'message': str(e)}), 500

@products_bp.route('/random-latest-products', methods=['GET'])
def get_random_latest_products():
    try:
        # Get all categories
        categories = Category.query.all()
        category_names = [category.name for category in categories]

        # Fetch the latest products from each category
        products_by_category = {}
        for category_name in category_names:
            products = Product.query.filter(Product.categories.any(Category.name == category_name)).order_by(Product.created_at.desc()).limit(4).all()
            products_by_category[category_name] = products

        # Collect one product per category, but only up to 4 products
        selected_products = []
        for category, products in products_by_category.items():
            if products and len(selected_products) < 4:
                selected_products.append(random.choice(products))
                if len(selected_products) == 4:
                    break

        # If fewer than 4 products, add more random products
        if len(selected_products) < 4:
            all_products = Product.query.order_by(Product.created_at.desc()).limit(20).all()
            additional_products = [p for p in all_products if p not in selected_products]
            selected_products.extend(random.sample(additional_products, 4 - len(selected_products)))

        # Prepare the response
        result = [{
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'image_url': product.image_url
        } for product in selected_products[:4]]  # Ensure only 4 products are returned

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching random latest products', 'message': str(e)}), 500
    
@products_bp.route('/featured-products', methods=['GET'])
def get_featured_products():
    try:
        # Fetch featured products
        featured_products = Product.query.filter_by(is_featured=True).order_by(Product.created_at.desc()).limit(20).all()

        # Randomly select 4 products from the featured products
        selected_products = random.sample(featured_products, min(4, len(featured_products)))

        # Prepare the response
        result = [{
            'id': product.id,
            'name': product.name,
            'image_url': product.image_url
        } for product in selected_products]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching featured products', 'message': str(e)}), 500
    
@products_bp.route('/random-categories', methods=['GET'])
def get_random_categories():
    try:
        # Fetch all categories
        all_categories = Category.query.all()

        # Randomly select 2 categories
        selected_categories = random.sample(all_categories, min(2, len(all_categories)))

        # Fetch a random product image for each selected category
        result = []
        for category in selected_categories:
            product = Product.query.filter(Product.categories.any(Category.id == category.id)).first()
            category_image = product.image_url if product else 'default-image-url'  # Provide a default image if none found
            result.append({
                'id': category.id,
                'name': category.name,
                'image_url': category_image
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching random categories', 'message': str(e)}), 500