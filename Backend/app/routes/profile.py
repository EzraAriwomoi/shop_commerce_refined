from flask import Blueprint, Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.extensions import db
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)

profile_bp = Blueprint('profile', __name__)
CORS(profile_bp, resources={r"/*"})

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        'full_name': user.full_name,
        'email': user.email,
    }), 200

@profile_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')

    if not all([full_name, email]):
        return jsonify({'error': 'Full name and email are required'}), 400

    user = User.query.get(user_id)
    if user:
        user.full_name = full_name
        user.email = email
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
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
