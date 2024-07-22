from app.models import Order, CartItem, db

def place_order(user_id):
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return None

    total = sum(item.product.price * item.quantity for item in cart_items)
    order = Order(user_id=user_id, total=total)
    db.session.add(order)
    db.session.commit()

    for item in cart_items:
        db.session.delete(item)
    db.session.commit()

    return order

def get_order_by_id(order_id, user_id):
    return Order.query.filter_by(id=order_id, user_id=user_id).first()
