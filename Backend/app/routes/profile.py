from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.extensions import db
from flask_cors import CORS

profile_bp = Blueprint('profile', __name__)
CORS(profile_bp, resources={r"/*"})

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        'full_name': user.full_name,
        'email': user.email,
        'phone': user.phone,
        'location': user.location,
        'mpesaNumber': user.mpesaNumber
    }), 200

@profile_bp.route('/update-personal-details', methods=['PUT'])
@jwt_required()
def update_personal_details():
    user_id = get_jwt_identity()
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    phone = data.get('phone')

    if not all([first_name, last_name, email, phone]):
        return jsonify({'error': 'First name, last name, email, and phone are required'}), 400

    user = User.query.get(user_id)
    if user:
        user.full_name = f"{first_name} {last_name}"
        user.email = email
        user.phone = phone
        db.session.commit()
        return jsonify({'message': 'Personal details updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@profile_bp.route('/update-location', methods=['PUT'])
@jwt_required()
def update_location():
    user_id = get_jwt_identity()
    data = request.get_json()
    location = data.get('location')

    if not location:
        return jsonify({'error': 'Location is required'}), 400

    user = User.query.get(user_id)
    if user:
        user.location = location
        db.session.commit()
        return jsonify({'message': 'Location updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@profile_bp.route('/update-payment', methods=['PUT'])
@jwt_required()
def update_payment():
    user_id = get_jwt_identity()
    data = request.get_json()
    mpesaNumber = data.get('mpesaNumber')

    if not mpesaNumber:
        return jsonify({'error': 'M-PESA number is required'}), 400

    user = User.query.get(user_id)
    if user:
        user.mpesaNumber = mpesaNumber
        db.session.commit()
        return jsonify({'message': 'Payment information updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@profile_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not all([old_password, new_password]):
        return jsonify({'error': 'Old and new passwords are required'}), 400

    user = User.query.get(user_id)
    if user and user.check_password(old_password):
        user.set_password(new_password)
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'}), 200
    else:
        return jsonify({'error': 'Old password is incorrect or user not found'}), 400
