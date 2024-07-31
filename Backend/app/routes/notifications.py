from flask import Blueprint, Flask, jsonify
from app.extensions import db, csrf
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Notification
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app)
notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@cross_origin()
@csrf.exempt
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).all()
    
    if not notifications:
        return jsonify({"message": "No notifications available"}), 204  # HTTP 204 No Content
    
    return jsonify([notification.to_dict() for notification in notifications]), 200

@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@cross_origin()
@csrf.exempt
@jwt_required()
def mark_notification_as_read(notification_id):
    user_id = get_jwt_identity()

    notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
    if not notification:
        return jsonify({'error': 'Notification not found'}), 404

    notification.read = True
    db.session.commit()

    return jsonify({'message': 'Notification marked as read successfully'}), 200
