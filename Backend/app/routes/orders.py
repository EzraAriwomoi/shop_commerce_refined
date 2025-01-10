from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Order, CartItem, Product, OrderItem
from app.extensions import db
from flask_cors import CORS

orders_bp = Blueprint('orders', __name__)
CORS(orders_bp, resources={r"/*": {"origins": "*"}})

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
        order_item = OrderItem(order_id=new_order.id, product_id=item.product_id, quantity=item.quantity)
        db.session.add(order_item)
        db.session.delete(item)
    
    db.session.commit()

    return jsonify({'order_id': new_order.id, 'message': 'Order placed successfully'}), 201

@orders_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_order(id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=id, user_id=user_id).first()

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Get order items with product details
    order_items = []
    for item in order.items:
        product = Product.query.get(item.product_id)
        order_items.append({
            'product_id': product.id,
            'product_name': product.name,
            'image_url': product.image_url,
            'quantity': item.quantity,
            'price': product.price
        })

    return jsonify({
        'id': order.id,
        'user_id': order.user_id,
        'total_price': order.total_price,
        'status': order.status,
        'created_at': order.created_at,
        'items': order_items
    }), 200

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).all()

    if not orders:
        return jsonify({'error': 'No orders found'}), 404

    order_list = []
    for order in orders:
        # Get order items with product details
        order_items = []
        for item in order.items:
            product = Product.query.get(item.product_id)
            order_items.append({
                'product_id': product.id,
                'product_name': product.name,
                'image_url': product.image_url,
                'quantity': item.quantity,
                'price': product.price
            })

        order_list.append({
            'id': order.id,
            'total_price': order.total_price,
            'status': order.status,
            'created_at': order.created_at,
            'items': order_items
        })

    return jsonify(order_list), 200
