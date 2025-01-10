from functools import wraps
import re
from flask import current_app, json, jsonify, request
from flask_jwt_extended import create_access_token, decode_token
import datetime
from app.models import BlacklistToken, User

import jwt

def generate_token(user_id):
    token = jwt.encode(
        {
            'user_id': user_id,
            'sub': user_id,
            'iat': datetime.datetime.utcnow(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return token

def verify_token(token):
    try:
        # Print the SECRET_KEY to ensure it's correct
        # print(f"SECRET_KEY: {current_app.config['SECRET_KEY']}")

        # Decode the token using the JWT library
        decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
        return user_id
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {e}")
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization'].split()
            if len(auth_header) == 2 and auth_header[0] == "Bearer":
                token = auth_header[1]

        # print(f"Token received: {token}") 
        # token = request.headers.get('x-access-tokens')
        if not token:
            return jsonify({'error': 'Token is missing'}), 403

        if BlacklistToken.check_blacklist(token):
            return jsonify({'error': 'Token is blacklisted'}), 401


        try:
            # data = jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            decoded_token = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            token_json = json.loads(json.dumps(decoded_token))
            # current_user = User.query.filter_by(id=data['user_id']).first()
            current_user = User.query.filter_by(id=token_json['user_id']).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def validate_input(email, password):
    email_regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
    
    if not email or not password:
        return False, 'Email and password are required.'

    if re.match(email_regex, email):
        return True, 'Valid email format.'
    
    return False, 'Invalid email format.'

def decode_auth_token(token):
    try:
        payload = decode_token(token)
        return payload['identity']
    except:
        return None
