import sys
import os
from flask import Blueprint, Flask, jsonify, request
from flask_cors import CORS
from flask_cors import cross_origin

# Add the backend directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))


from app.models import Category, FeaturedProduct, Banner, FlashSale, NewProduct, Offer
from app.extensions import db, csrf



app = Flask(__name__)
CORS(app)
misc_bp = Blueprint('miscellaneous', __name__)

@misc_bp.route('/categories', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_categories():
    categories = Category.query.all()
    return jsonify([category.to_dict() for category in categories]), 200

@misc_bp.route('/featured-products', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_featured_products():
    category_name = request.args.get('category', None)
    print(f"Requested category: {category_name}")

    if category_name:
        print("Category name provided. Fetching featured products for the category.")
        try:
            featured_products = (FeaturedProduct.query
                                 .join(Category, FeaturedProduct.category_id == Category.id)
                                 .filter(Category.name == category_name)
                                 .all())
            print(f"Number of featured products found: {len(featured_products)}")
        except Exception as e:
            print(f"Error fetching featured products for category {category_name}: {e}")
            return jsonify({'error': 'Failed to fetch featured products'}), 500
    else:
        print("No category name provided. Fetching all featured products.")
        try:
            featured_products = FeaturedProduct.query.all()
            print(f"Number of featured products found: {len(featured_products)}")
        except Exception as e:
            print(f"Error fetching all featured products: {e}")
            return jsonify({'error': 'Failed to fetch featured products'}), 500

    return jsonify([product.to_dict() for product in featured_products]), 200


@misc_bp.route('/banners', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_banners():
    banners = Banner.query.all()
    return jsonify([banner.to_dict() for banner in banners]), 200

@misc_bp.route('/flashsales', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_flashsales():
    flashsales = FlashSale.query.all()
    return jsonify([flashsale.to_dict() for flashsale in flashsales]), 200

@misc_bp.route('/offers', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_offers():
    offers = Offer.query.all()
    return jsonify([offer.to_dict() for offer in offers]), 200

@misc_bp.route('/newproducts', methods=['GET'])
@cross_origin()
@csrf.exempt
def get_new_products():
    new_products = NewProduct.query.all()
    return jsonify([new_product.to_dict() for new_product in new_products]), 200


app.register_blueprint(misc_bp, url_prefix='/miscellaneous')


if __name__ == '_main_':
    app.run(debug=True)