from flask import Blueprint, Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import CartItem, Product
from app.extensions import db, csrf
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app)
cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@cross_origin()
@csrf.exempt
@jwt_required()
def get_cart_items():
    try:
        user_id = get_jwt_identity()
        print(f"Fetching cart items for user ID: {user_id}")
        cart_items = CartItem.query.filter_by(user_id=user_id).all()
        print("Cart items fetched:", cart_items)
        return jsonify([item.to_dict() for item in cart_items]), 200
    except Exception as e:
        print("Error fetching cart items:", e)
        return jsonify({'error': 'An error occurred while fetching cart items'}), 500

@cart_bp.route('/add', methods=['POST'])
@cross_origin()
@csrf.exempt
@jwt_required()
def add_cart_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not all([product_id, quantity]):
        return jsonify({'error': 'Product ID and quantity are required'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Check if the cart item already exists
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart_item:
        # If the item already exists in the cart, update the quantity
        cart_item.quantity += quantity
    else:
        # Otherwise, create a new cart item
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    db.session.commit()

    return jsonify({'message': 'Item added to cart successfully'}), 201

@cart_bp.route('/update/<int:product_id>', methods=['PUT'])
@cross_origin()
@jwt_required()
def update_cart_item(product_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not all([product_id, quantity]):
        return jsonify({'error': 'Product ID and quantity are required'}), 400

    try:
        cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()

        if not cart_item:
            return jsonify({'error': 'Cart item not found'}), 404

        cart_item.quantity = quantity
        db.session.commit()

        return jsonify({'message': 'Cart item updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update cart item: {str(e)}'}), 500
    
@cart_bp.route('/remove/<int:product_id>', methods=['DELETE'])
@cross_origin()
@csrf.exempt
@jwt_required()
def remove_cart_item(product_id):
    user_id = get_jwt_identity()

    # No need to get JSON data from request body since product_id is in the URL

    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404

    db.session.delete(cart_item)
    db.session.commit()

    return jsonify({'message': 'Cart item removed successfully'}), 200

@cart_bp.route('/summary', methods=['GET'])
@cross_origin()
@csrf.exempt
@jwt_required()
def calculate_cart_summary():
    try:
        user_id = get_jwt_identity()
        cart_items = CartItem.query.filter_by(user_id=user_id).all()

        # Calculate subtotal
        subtotal = sum(item.to_dict()['product_price'] * item.to_dict()['quantity'] for item in cart_items)

        # Shipping cost (assuming constant for now)
        shipping_cost = 25.00

        # Calculate discount (6.12% of subtotal)
        discount = subtotal * 0.0612

        # Total calculation (subtotal + shipping - discount)
        total = subtotal + shipping_cost - discount

        # Round values to 2 decimal places
        subtotal = round(subtotal, 2)
        discount = round(discount, 2)
        total = round(total, 2)

        # Prepare response
        response = {
            'subtotal': subtotal,
            'shipping': shipping_cost,
            'discount': discount,
            'total': total
        }

        return jsonify(response), 200

    except Exception as e:
        print("Error calculating cart summary:", e)
        return jsonify({'error': 'An error occurred while calculating cart summary'}), 500

@cart_bp.route('/count', methods=['GET'])
@cross_origin()
@csrf.exempt
@jwt_required()
def get_cart_item_count():
    try:
        user_id = get_jwt_identity()
        cart_item_count = CartItem.query.filter_by(user_id=user_id).count()

        return jsonify({'count': cart_item_count}), 200
    except Exception as e:
        print("Error fetching cart item count:", e)
        return jsonify({'error': 'An error occurred while fetching cart item count'}), 500
