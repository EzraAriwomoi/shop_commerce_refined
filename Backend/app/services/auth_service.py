from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.extensions import db
from flask_jwt_extended import create_access_token, decode_token
from datetime import timedelta

def create_user(full_name, email, password):
    user = User(full_name=full_name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None

def generate_token(user_id):
    return create_access_token(identity=user_id, expires_delta=timedelta(days=1))

def decode_auth_token(token):
    try:
        payload = decode_token(token)
        return payload['identity']
    except:
        return None