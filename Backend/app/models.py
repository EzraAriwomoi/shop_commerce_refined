from datetime import datetime
from flask import current_app
from itsdangerous import Serializer
from sqlalchemy import Index
from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

# Association table for Product and Category many-to-many relationship
product_category = db.Table(
    'product_category',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_blocked = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime)
    phone = db.Column(db.String(10), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    mpesaNumber = db.Column(db.String(50), nullable=True)

    # Relationships
    carts = db.relationship('CartItem', backref='user', lazy='select', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='select', cascade='all, delete-orphan')
    supports = db.relationship('SupportTicket', backref='user', lazy='select', cascade='all, delete-orphan')
    wishlists = db.relationship('WishlistItem', backref='user', lazy='select', cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy='select', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

    def get_id(self):
         return str(self.id)

    def start_session(self):
        self.session_start_time = datetime.now()
        db.session.commit()

    def end_session(self):
        self.session_start_time = None
        db.session.commit()

    @staticmethod
    def generate_verification_token(user_id):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps(user_id, salt=current_app.config['SECURITY_PASSWORD_SALT'])

    @staticmethod
    def verify_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'])
        except:
            return None
        return user_id
    
    # Indexes
    __table_args__ = (
        Index('idx_user_email', email),
    )

class Product(db.Model):
    __tablename__ = 'product'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(200), nullable=True)  # Firebase Storage image URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Featured product attributes
    is_featured = db.Column(db.Boolean, default=False)
    featured_priority = db.Column(db.Integer)

    # Define many-to-many relationship with Category
    categories = db.relationship('Category', secondary='product_category', backref=db.backref('products', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'stock': self.stock,
            'image_url': self.image_url,
            'is_featured': self.is_featured,
            'featured_priority': self.featured_priority,
            'created_at': self.created_at.isoformat()
        }

    # Relationships
    cart_items = db.relationship('CartItem', backref='product', lazy='select', cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='product', lazy='select', cascade='all, delete-orphan')

    # Indexes
    __table_args__ = (
        Index('idx_product_name', name),
    )


class CartItem(db.Model):
    __tablename__ = 'cart_item'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        product = Product.query.get(self.product_id)
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'created_at': self.created_at.isoformat(),
            'product_name': product.name,
            'product_price': product.price,
            'image_url': product.image_url
        }

    # Indexes
    __table_args__ = (
        Index('idx_cart_item_user_product', user_id, product_id),
    )


class Order(db.Model):
    __tablename__ = 'order'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='select', cascade='all, delete-orphan')

    # Indexes
    __table_args__ = (
        Index('idx_order_user_status', user_id, status),
    )


class OrderItem(db.Model):
    __tablename__ = 'order_item'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity
        }

    # Indexes
    __table_args__ = (
        Index('idx_order_item_order_product', order_id, product_id),
    )


class Notification(db.Model):
    __tablename__ = 'notification'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'created_at': self.created_at.isoformat()
        }

    # Indexes
    __table_args__ = (
        Index('idx_notification_user_type', user_id, type),
    )


class SupportTicket(db.Model):
    __tablename__ = 'support_ticket'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Indexes
    __table_args__ = (
        Index('idx_support_ticket_user_status', user_id, status),
    )


class WishlistItem(db.Model):
    __tablename__ = 'wishlist_item'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Indexes
    __table_args__ = (
        Index('idx_wishlist_item_user_product', user_id, product_id),
    )
    product = db.relationship('Product', backref='wishlist_items')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'created_at': self.created_at.isoformat(),
            'product_name': self.product.name,
            'product_price': self.product.price,
            'image_url': self.product.image_url 
        }


class PaymentMethod(db.Model):
    __tablename__ = 'payment_method'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
            
        }

class ShippingMethod(db.Model):
    __tablename__ = 'shipping_method'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
            # Add more attributes if needed
        }

class FAQ(db.Model):
    __tablename__ = 'faq'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(200), nullable=False)
    answer = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'answer': self.answer,
            'created_at': self.created_at.isoformat()
        }
    
class ContactQuery(db.Model):
    __tablename__ = 'contact_query'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class Banner(db.Model):
    __tablename__ = 'banner'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat()
        }

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }

    # Indexes
    __table_args__ = (
        Index('idx_category_name', name),
    )    
class FeaturedProduct(db.Model):
    __tablename__ = 'featured_product'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id', ondelete='CASCADE'), nullable=False, unique=True)
    priority = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    product = db.relationship('Product', backref=db.backref('featured_product', uselist=False, lazy='select'))

    # Indexes
    __table_args__ = (
        Index('idx_featured_product_priority', priority),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'priority': self.priority,
            'created_at': self.created_at.isoformat(),
            'product': self.product.to_dict()  # Assuming Product has a to_dict() method
        }



class EmailVerificationToken(db.Model):
    # __tablename__ = 'email_verification_token'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token = db.Column(db.String(120), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    expires_at = db.Column(db.DateTime, nullable=False)

    user = db.relationship('User', backref=db.backref('email_verification_tokens', lazy=True))

    @staticmethod
    def generate_token(user_id):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps(user_id, salt=current_app.config['SECURITY_PASSWORD_SALT'])

    @staticmethod
    def verify_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'])
        except:
            return None
        return user_id

class BlacklistToken(db.Model):
    # __tablename__ = 'blacklist_tokens'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.utcnow()

    def __repr__(self):
        return f'<BlacklistToken token={self.token}>'

    @staticmethod
    def check_blacklist(auth_token):
        res = BlacklistToken.query.filter_by(token=auth_token).first()
        if res:
            return True
        else:
            return False
        
class PasswordResetToken(db.Model):
    # __tablename__ = 'password_reset_token'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token = db.Column(db.String(120), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def generate_token(user_id):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps(user_id, salt=current_app.config['SECURITY_PASSWORD_SALT'])

    @staticmethod
    def verify_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'])
        except:
            return None
        return user_id

class FlashSale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    discount = db.Column(db.Float, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'discount': self.discount,
            'start_time': self.start_time,
            'end_time': self.end_time,

        }

class Offer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    discount = db.Column(db.Float, nullable=False)
    valid_from = db.Column(db.DateTime, nullable=False)
    valid_until = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'discount': self.discount,
            'valid_from': self.valid_from,
            'valid_until': self.valid_until,
        }

class NewProduct(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    release_date = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'release_date': self.release_date,
        }
    
class BaseModel(db.Model):
    __abstract__ = True
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class MpesaCalls(BaseModel):
    id = db.Column(db.BigInteger, primary_key=True)
    ip_address = db.Column(db.Text)
    caller = db.Column(db.Text)
    conversation_id = db.Column(db.Text)
    content = db.Column(db.Text)

class MpesaCallBacks(BaseModel):
    id = db.Column(db.BigInteger, primary_key=True)
    ip_address = db.Column(db.Text)
    caller = db.Column(db.Text)
    conversation_id = db.Column(db.Text)
    content = db.Column(db.Text)

class MpesaPayment(BaseModel):
    id = db.Column(db.BigInteger, primary_key=True)
    amount = db.Column(db.Numeric(10, 2))
    description = db.Column(db.Text)
    type = db.Column(db.Text)
    reference = db.Column(db.Text)
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.Text)

    def __str__(self):
        return self.first_name