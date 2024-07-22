from flask import Blueprint, Flask, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import FAQ, SupportTicket
from app.extensions import db
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
support_bp = Blueprint('support', __name__)
CORS(support_bp, resources={r"/*"})

@support_bp.route('/faqs', methods=['GET'])
def get_faqs():
    faqs = FAQ.query.all()
    return jsonify([faq.to_dict() for faq in faqs]), 200

@support_bp.route('/contact', methods=['POST'])
@jwt_required()
def submit_support_query():
    user_id = get_jwt_identity()
    data = request.get_json()
    subject = data.get('subject')
    message = data.get('message')

    if not all([subject, message]):
        return jsonify({'error': 'Subject and message are required'}), 400

    new_ticket = SupportTicket(user_id=user_id, subject=subject, message=message)
    db.session.add(new_ticket)
    db.session.commit()

    return jsonify({'message': 'Support ticket submitted successfully'}), 201
