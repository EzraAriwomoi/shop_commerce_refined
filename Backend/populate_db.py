from datetime import datetime, timedelta
from random import randint
from flask import app
from werkzeug.security import generate_password_hash
from app.models import (
    Category, User, Product, CartItem, Order, OrderItem, Notification,
    SupportTicket, WishlistItem, PaymentMethod, ShippingMethod,
    FAQ, ContactQuery, Banner, FeaturedProduct
)
from app import create_app, db  # Replace 'your_app' with the actual name of your app

app = create_app()

def populate_database():
    # Drop all tables
    db.drop_all()
    db.create_all()

    # Create categories
    categories = [
        Category(name='Watches', description='Various types of watches'),
        Category(name='Bracelets', description='Various types of bracelets'),
        Category(name='Rings', description='Various types of rings'),
        Category(name='Earrings', description='Various types of earrings'),
        Category(name='Necklaces', description='Various types of necklaces'),
    ]
    db.session.add_all(categories)
    db.session.commit()

    # Create users
    users = [
        User(full_name='Alice Smith', email='alice@example.com', password=generate_password_hash('password')),
        User(full_name='Bob Johnson', email='bob@example.com', password=generate_password_hash('password')),
        User(full_name='Charlie Lee', email='charlie@example.com', password=generate_password_hash('password')),
        User(full_name='Diana Green', email='diana@example.com', password=generate_password_hash('password'))
    ]
    db.session.add_all(users)
    db.session.commit()

    # Create products and associate them with categories
    image_urls = [
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/African%20Print%20fans%2F1.jpg?alt=media&token=1218beff-b090-4bac-b730-d021c0ba11ec",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/African%20Print%20fans%2F3.jpg?alt=media&token=3d5deca5-6644-4982-ad6d-b79bda04ca26",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/African%20Print%20fans%2F4.jpg?alt=media&token=d7c285e0-743e-4565-a9d1-bc4dfd1cfe77",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Artifacts%2FAfrican%20stool%20made%20from%20hard%20wood%20(available%20in%20various%20sizes)%20-%209%2C000.jpg?alt=media&token=fb6f63a7-ecf7-43fb-9aec-40ddd63e9272",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Artifacts%2FAfrican%20woman%20-%203%2C000.jpg?alt=media&token=3b527ae3-40ea-4cc6-840e-7e1117059a38",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Artifacts%2FAfrican%20woman%20and%20child%20-%203%2C100.jpg?alt=media&token=a99393b0-e79f-48cb-b750-656b108bb2c6",
        # "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Artifacts%2FAfrican%20woman%20carrying%20her%20child%20-%203%2C000.jpg?alt=media&token=919379e",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F1200%2F17.jpg?alt=media&token=e047fa86-b33d-40c8-a2b4-5c86221e50f7",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F1200%2F18.jpg?alt=media&token=7cafd85d-186c-47fa-b2d4-c22880024316",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F12.jpg?alt=media&token=94a2d4bc-7b8d-402f-a476-23c483715628",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F21.jpg?alt=media&token=af530eae-293f-480a-9234-ccbdece8c65a",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F22.jpg?alt=media&token=13805484-2477-4e7b-b972-7b45dd87667a",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F23.jpg?alt=media&token=8356b19f-2c5a-4322-a186-986695803462",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F25.jpg?alt=media&token=236d1c63-239d-4736-baf1-31ed5fdd311a6",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F26.jpg?alt=media&token=0fa2ecb2-c35c-4169-a6ab-cea2db8dde52",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F2000%2F27.jpg?alt=media&token=b64890db-673f-460b-9f48-0c0bce78b289",
        "https://firebasestorage.googleapis.com/v0/b/kletos-d86bc.appspot.com/o/Bracelets%2F1200%2F20.jpg?alt=media&token=3a954663-c789-4947-8712-074ff8732490"
    ]

    # Define your products
    products = [
        Product(name='African Print Fan 1', description='Beautiful African print fan.', price=1000, stock=10, image_url=image_urls[0], is_featured=True, featured_priority=1, categories=[categories[0]]),
        Product(name='African Print Fan 2', description='Elegant African print fan.', price=1200, stock=15, image_url=image_urls[1], is_featured=True, featured_priority=2, categories=[categories[1]]),
        Product(name='African Print Fan 3', description='Stylish African print fan.', price=1000, stock=12, image_url=image_urls[2], is_featured=True, featured_priority=3, categories=[categories[2]]),
        Product(name='African Stool', description='Handcrafted African stool made from hard wood.', price=2500, stock=5, image_url=image_urls[3], is_featured=True, featured_priority=4, categories=[categories[3]]),
        Product(name='African Woman', description='Beautiful statue of an African woman.', price=3000, stock=8, image_url=image_urls[4], is_featured=True, featured_priority=5, categories=[categories[4]]),
        Product(name='African Woman and Child', description='Elegant statue of an African woman and her child.', price=3000, stock=7, image_url=image_urls[5], is_featured=True, featured_priority=6, categories=[categories[0]]),
        # Product(name='African Woman Carrying Child', description='Graceful statue of an African woman carrying her child.', price=3000, stock=9, image_url=image_urls[6], is_featured=True, featured_priority=7, categories=[categories[1]]),
        Product(name='Bracelet 17', description='Stylish bracelet.', price=1200, stock=20, image_url=image_urls[7], is_featured=True, featured_priority=8, categories=[categories[2]]),
        Product(name='Bracelet 18', description='Elegant bracelet.', price=1200, stock=18, image_url=image_urls[8], is_featured=True, featured_priority=9, categories=[categories[3]]),
        Product(name='Bracelet 12', description='Beautiful bracelet.', price=1000, stock=15, image_url=image_urls[9], is_featured=True, featured_priority=10, categories=[categories[4]]),
        Product(name='Bracelet 21', description='Luxurious bracelet.', price=2500, stock=10, image_url=image_urls[10], is_featured=True, featured_priority=11, categories=[categories[0]]),
        # Product(name='Bracelet 22', description='Handcrafted bracelet.', price=2500, stock=12, image_url=image_urls[11], is_featured=True, featured_priority=12, categories=[categories[1]]),
        # Product(name='Bracelet 23', description='Shiny bracelet.', price=3000, stock=14, image_url=image_urls[12], is_featured=True, featured_priority=13, categories=[categories[2]]),
        Product(name='Bracelet 25', description='Exquisite bracelet.', price=3000, stock=11, image_url=image_urls[13], is_featured=True, featured_priority=14, categories=[categories[3]]),
        Product(name='Bracelet 26', description='Elegant and stylish bracelet.', price=1200, stock=16, image_url=image_urls[14], is_featured=True, featured_priority=15, categories=[categories[4]])
    ]

    # Add to session
    db.session.add_all(products)
    db.session.commit()

    # Create cart items for users
    cart_items = [
        CartItem(user_id=users[0].id, product_id=products[0].id, quantity=2),
        CartItem(user_id=users[1].id, product_id=products[1].id, quantity=1),
        CartItem(user_id=users[2].id, product_id=products[2].id, quantity=1),
        CartItem(user_id=users[3].id, product_id=products[3].id, quantity=3),
        CartItem(user_id=users[2].id, product_id=products[3].id, quantity=3),
    ]
    db.session.add_all(cart_items)
    db.session.commit()

    # Create orders for users
    orders = [
        Order(user_id=users[0].id, total_price=399.98, status='Pending'),
        Order(user_id=users[1].id, total_price=49.99, status='Completed'),
        Order(user_id=users[2].id, total_price=299.99, status='Pending'),
        Order(user_id=users[3].id, total_price=269.97, status='Shipped'),
    ]
    db.session.add_all(orders)
    db.session.commit()

    # Create order items
    order_items = [
        OrderItem(order_id=orders[0].id, product_id=products[0].id, quantity=2),
        OrderItem(order_id=orders[1].id, product_id=products[1].id, quantity=1),
        OrderItem(order_id=orders[2].id, product_id=products[2].id, quantity=1),
        OrderItem(order_id=orders[3].id, product_id=products[3].id, quantity=3),
    ]
    db.session.add_all(order_items)
    db.session.commit()

    # Create notifications for users
    notifications = [
        Notification(user_id=users[0].id, title='Order Confirmation', message='Your order has been confirmed.', type='order', created_at=datetime.utcnow()),
        Notification(user_id=users[1].id, title='Shipping Update', message='Your order has been shipped.', type='shipping', created_at=datetime.utcnow()),
        Notification(user_id=users[2].id, title='Delivery Update', message='Your order is out for delivery.', type='delivery', created_at=datetime.utcnow()),
        Notification(user_id=users[3].id, title='Order Delivered', message='Your order has been delivered.', type='delivery', created_at=datetime.utcnow()),
    ]
    db.session.add_all(notifications)
    db.session.commit()

    # Create support tickets for users
    support_tickets = [
        SupportTicket(user_id=users[0].id, subject='Issue with order', message='I received a damaged product.', status='Open'),
        SupportTicket(user_id=users[1].id, subject='Payment issue', message='I was charged twice.', status='Open'),
        SupportTicket(user_id=users[2].id, subject='Shipping delay', message='My order is delayed.', status='Closed'),
        SupportTicket(user_id=users[3].id, subject='Product inquiry', message='Is this product available in other colors?', status='Open'),
    ]
    db.session.add_all(support_tickets)
    db.session.commit()

    # Create wishlist items for users
    wishlist_items = [
        WishlistItem(user_id=users[0].id, product_id=products[1].id),
        WishlistItem(user_id=users[1].id, product_id=products[2].id),
        WishlistItem(user_id=users[2].id, product_id=products[3].id),
        WishlistItem(user_id=users[3].id, product_id=products[4].id),
    ]
    db.session.add_all(wishlist_items)
    db.session.commit()

    # Create payment methods
    payment_methods = [
        PaymentMethod(name='Credit Card', description='Pay with credit card'),
        PaymentMethod(name='PayPal', description='Pay with PayPal'),
        PaymentMethod(name='Bank Transfer', description='Pay via bank transfer'),
        PaymentMethod(name='Cash on Delivery', description='Pay with cash upon delivery')
    ]
    db.session.add_all(payment_methods)
    db.session.commit()

    # Create shipping methods
    shipping_methods = [
        ShippingMethod(name='Standard Shipping', description='Delivers in 5-7 business days'),
        ShippingMethod(name='Express Shipping', description='Delivers in 2-3 business days'),
        ShippingMethod(name='Overnight Shipping', description='Delivers next day'),
        ShippingMethod(name='International Shipping', description='Delivers in 7-14 business days')
    ]
    db.session.add_all(shipping_methods)
    db.session.commit()

    # Create FAQs
    faqs = [
        FAQ(question='How can I track my order?', answer='You can track your order using the tracking number provided in the shipment confirmation email.'),
        FAQ(question='What is the return policy?', answer='You can return products within 30 days of delivery for a full refund.'),
        FAQ(question='How do I change my shipping address?', answer='You can change your shipping address from your account settings before the order is shipped.'),
        FAQ(question='How do I contact customer service?', answer='You can contact our customer service through the support page on our website.')
    ]
    db.session.add_all(faqs)
    db.session.commit()

    # Create contact queries
    contact_queries = [
        ContactQuery(name='Alice Smith', email='alice@example.com', message='I have a question about my order.'),
        ContactQuery(name='Bob Johnson', email='bob@example.com', message='I need help with a product.'),
        ContactQuery(name='Charlie Lee', email='charlie@example.com', message='I want to change my shipping address.'),
        ContactQuery(name='Diana Green', email='diana@example.com', message='I have a question about payment.')
    ]
    db.session.add_all(contact_queries)
    db.session.commit()

    # Create banners
    banners = [
        Banner(title='Summer Sale', image_url='banner_image_url_1'),
        Banner(title='New Arrivals', image_url='banner_image_url_2'),
        Banner(title='Holiday Discounts', image_url='banner_image_url_3'),
        Banner(title='Clearance Sale', image_url='banner_image_url_4')
    ]
    db.session.add_all(banners)
    db.session.commit()

    # Create featured products
    featured_products = [
        FeaturedProduct(product_id=products[0].id, priority=1),
        FeaturedProduct(product_id=products[1].id, priority=2),
        FeaturedProduct(product_id=products[2].id, priority=3),
        FeaturedProduct(product_id=products[3].id, priority=4)
    ]
    db.session.add_all(featured_products)
    db.session.commit()

    print("Database populated successfully!")

if __name__ == '__main__':
    with app.app_context():
        populate_database()
