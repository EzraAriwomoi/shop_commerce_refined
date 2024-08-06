from flask import Flask
from flask_cors import CORS
from .auth import auth_bp
from .cart import cart_bp
from .products import products_bp
from .orders import orders_bp
from .profile import profile_bp
from .analytics import analytics_bp
from .notifications import notifications_bp
from .miscellaneous import misc_bp
from .payments import payment_bp, shipping_bp
from .support import support_bp
from .wishlist import wishlist_bp
from .mpesa import mpesa_bp

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})  # This allows all origins, adjust as needed

    # Register routes
    register_routes(app)
    
    return app

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(cart_bp, url_prefix='/cart')
    app.register_blueprint(products_bp, url_prefix='/products')
    app.register_blueprint(support_bp, url_prefix='/support')
    app.register_blueprint(orders_bp, url_prefix='/orders')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(analytics_bp, url_prefix='/analytics')
    app.register_blueprint(notifications_bp, url_prefix='/notifications')
    app.register_blueprint(misc_bp, url_prefix='/misc')
    app.register_blueprint(payment_bp, url_prefix='/pay')
    app.register_blueprint(shipping_bp, url_prefix='/ship')
    app.register_blueprint(wishlist_bp, url_prefix='/wishlist')
    app.register_blueprint(mpesa_bp, url_prefix='/mpesa')
