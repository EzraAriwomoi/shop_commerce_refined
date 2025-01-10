from app.models import CartItem, db

def get_cart_items(user_id):
    return CartItem.query.filter_by(user_id=user_id).all()

def add_cart_item(user_id, product_id, quantity):
    item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    db.session.add(item)
    db.session.commit()
    return item

def update_cart_item(user_id, product_id, quantity):
    item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        item.quantity = quantity
        db.session.commit()
        return item
    return None

def remove_cart_item(user_id, product_id):
    item = CartItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
        return item
    return None
