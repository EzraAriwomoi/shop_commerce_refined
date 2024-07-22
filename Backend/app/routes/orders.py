from flask import Blueprint, Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Order, CartItem
from app.extensions import db
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app)
orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({'error': 'No items in cart'}), 400

    total_price = sum(item.product.price * item.quantity for item in cart_items)
    new_order = Order(user_id=user_id, total_price=total_price)

    db.session.add(new_order)
    db.session.commit()

    for item in cart_items:
        db.session.delete(item)
    db.session.commit()

    return jsonify({'message': 'Order placed successfully'}), 201

@orders_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=id, user_id=user_id).first()

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({
        'id': order.id,
        'user_id': order.user_id,
        'total_price': order.total_price,
        'status': order.status,
        'created_at': order.created_at
    }), 200
