from flask import Blueprint, Flask, logging, request, jsonify, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from itsdangerous import BadSignature, SignatureExpired
from werkzeug.security import generate_password_hash, check_password_hash
from app.forms import RequestPasswordResetForm, ResetPasswordForm
from app.models import BlacklistToken, EmailVerificationToken, PasswordResetToken, User
from app.extensions import db, csrf, mail
from app.services.email_service import send_email, send_login_alert_email, send_password_reset_email
from app.utils.validation import validate_email, validate_password
from app.utils.token import token_required, generate_token, validate_input, verify_token
from flask_cors import CORS, cross_origin
from flask_mail import Message
import logging

app = Flask(__name__)
auth_bp = Blueprint('auth', __name__)
CORS(auth_bp, resources={r"/*"})

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@auth_bp.route('/signup', methods=['POST'])
@cross_origin()
@csrf.exempt
def signup():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not all([full_name, email, password, confirm_password]):
        return jsonify({'error': 'All fields are required'}), 400

    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    if not validate_password(password):
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(password)
    user = User(full_name=full_name, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    token = EmailVerificationToken.generate_token(user.id)
    logging.debug(f"Generated token for email verification: {token}")

    verify_url = url_for('auth.verify_email', token=token, _external=True)
    body_template = f'\n\nClick the link below to verify:\n{verify_url}'
    body = body_template.format()
    send_email('Verify Your Email Address', [email], body, verify_url=verify_url)

    return jsonify({
        "message": "User registered successfully. Please check your email to verify your account.",
        'token': token
        }), 201

@auth_bp.route('/signin', methods=['POST'])
@cross_origin()
@csrf.exempt
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        access_token = generate_token(user.id)
        print(f"Generated Token: {access_token}")
        send_login_alert_email(user.email, access_token)
        return jsonify({'token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    
@auth_bp.route('/status', methods=['GET'])
@jwt_required()
def check_auth_status():
    current_user_id = get_jwt_identity()
    if current_user_id:
        user = User.query.get(current_user_id)
        if user:
            return jsonify({'authenticated': True, 'user_id': user.id, 'email': user.email}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'authenticated': False}), 401

@auth_bp.route('/resend-verification', methods=['POST'])
@cross_origin()
@csrf.exempt
def resend_verification():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.email_verified:
        return jsonify({'message': 'Email already verified'}), 200

    token = EmailVerificationToken.generate_token(user.id)
    logging.debug(f"Generated token for email verification: {token}")

    verify_url = url_for('auth.verify_email', token=token, _external=True)
    send_email('Verify Your Email Address', [email], 'email/verify', verify_url=verify_url)

    return jsonify({'message': 'Verification email sent'}), 200

@auth_bp.route('/logout', methods=['POST'])
@cross_origin()
@csrf.exempt
@token_required
def logout(current_user):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split()[1]
        blacklist_token = BlacklistToken(token=token)
        try:
            db.session.add(blacklist_token)
            db.session.commit()
            return jsonify({'message': 'Logged out successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Authorization header is missing'}), 400

@auth_bp.route('/request-password-reset', methods=['POST'])
@cross_origin()
@csrf.exempt
def request_password_reset():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    token = generate_token(user.id)
    reset_url = url_for('auth.password_reset_form', token=token, _external=True)
    body_template = f'\n\nClick to Reset Password:\n{reset_url}'
    body = body_template.format()
    send_email('Reset Your Password', [email], body, reset_url=reset_url)

    return jsonify({
        'message': 'Password reset email sent',
        'token': token
    }), 200

# @auth_bp.route('/reset-password/<token>', methods=['POST'])
# def reset_password_with_url(token):
#     data = request.get_json()
#     form = ResetPasswordForm(data=data)

#     if not form.validate():
#         return jsonify({'errors': form.errors}), 400

#     user_id = PasswordResetToken.verify_token(token)
#     user = User.query.get(user_id)

#     hashed_password = generate_password_hash(form.password.data, method='sha256')
#     user.password = hashed_password
#     db.session.commit()

#     return jsonify({'message': 'Password reset successfully'}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
@cross_origin()
@csrf.exempt
@cross_origin()
@csrf.exempt
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Email not found'}), 404

    token = generate_token(user.id)
    send_password_reset_email(user.email, token)

    return jsonify({
        'message': 'Password reset email sent',
        'token': token
        }), 200

@auth_bp.route('/password-reset', methods=['POST'])
@cross_origin()
@csrf.exempt
def password_reset():
    data = request.get_json()

    if not data:
        print("No JSON body received")
        return jsonify({'error': 'Invalid request, JSON body required'}), 400

    token = data.get('token')
    new_password = data.get('new_password')
    print(f"Token received for password reset: {token}")  # Debug print statement
    print(f"New password received for password reset: {new_password}")  # Debug print statement

    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400

    user_id = verify_token(token)
    if user_id is None:
        return jsonify({'error': 'Invalid or expired token'}), 400

    user = User.query.get(user_id)
    if user:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({'message': 'Password reset successful'}), 200

    return jsonify({'error': 'User not found'}), 404



@auth_bp.route('/verify-email/<token>', methods=['GET'])
@cross_origin()
@csrf.exempt
def verify_email(token):
    # logging.debug(f"Received token for verification: {token}")  # Log the received token
    try:
        user_id = EmailVerificationToken.verify_token(token)
        # logging.debug(f"Token corresponds to user ID: {user_id}")  # Log the user ID from the token
    except (SignatureExpired, BadSignature) as e:
        # logging.error(f"Token verification failed: {e}")  # Log the error
        return jsonify({'error': 'Invalid or expired token'}), 400

    user = User.query.get(user_id)
    if not user:
        logging.error("User not found for the given token")  # Log user not found error
        return jsonify({'error': 'User not found'}), 404

    user.email_verified = True
    db.session.commit()

    return jsonify({'message': 'Email verified successfully'}), 200

@auth_bp.route('/block-account/<token>', methods=['GET'])
@cross_origin()
@csrf.exempt
def block_account(token):
    # data = request.get_json()
    # token = data.get('token')
    # print(f"Token received for block account: {token}")

    user_id = verify_token(token)
    if user_id is None:
        print("Invalid or expired token")
        return jsonify({'error': 'Invalid or expired token'}), 400

    user = User.query.get(user_id)
    if user:
        user.is_blocked = True
        db.session.commit()
        print(f"User {user.email} blocked successfully")
        return jsonify({'message': 'Account blocked successfully'}), 200

    print("User not found")
    return jsonify({'error': 'User not found'}), 404

@auth_bp.route('/refresh-token', methods=['POST'])
@cross_origin()
@csrf.exempt
@token_required
def refresh_token(current_user):
    token = generate_token(current_user.id)
    return jsonify({'token': token}), 200

@auth_bp.route('/password-reset-form/<token>', methods=['GET'])
@cross_origin()
@csrf.exempt
def password_reset_form(token):
    return jsonify({'token': token}), 200