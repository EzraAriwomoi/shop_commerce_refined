from flask import Flask, Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import WishlistItem, Product
from app.extensions import db
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('/', methods=['GET'])
@jwt_required()
@cross_origin()
def get_wishlist():
    user_id = get_jwt_identity()
    wishlist_items = WishlistItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in wishlist_items]), 200

@wishlist_bp.route('/<int:product_id>', methods=['POST'])
@jwt_required()
@cross_origin()
def add_to_wishlist(product_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    existing_item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_item:
        return jsonify({'error': 'Product already in wishlist'}), 400

    new_wishlist_item = WishlistItem(user_id=user_id, product_id=product_id)
    db.session.add(new_wishlist_item)
    db.session.commit()

    return jsonify({'message': 'Product added to wishlist successfully'}), 201

@wishlist_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
@cross_origin()
def remove_from_wishlist(product_id):
    user_id = get_jwt_identity()

    wishlist_item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not wishlist_item:
        return jsonify({'error': 'Product not found in wishlist'}), 404

    db.session.delete(wishlist_item)
    db.session.commit()

    return jsonify({'message': 'Product removed from wishlist successfully'}), 200

@wishlist_bp.route('/check/<int:product_id>', methods=['GET'])
@jwt_required()
@cross_origin()
def check_wishlist(product_id):
    user_id = get_jwt_identity()
    existing_item = WishlistItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    return jsonify({'exists': existing_item is not None}), 200

# Register blueprint
app.register_blueprint(wishlist_bp, url_prefix='/wishlist')

if __name__ == '__main__':
    app.run(debug=True)
