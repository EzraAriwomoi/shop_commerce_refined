from flask import Blueprint, Flask, jsonify
from app.models import ShippingMethod, PaymentMethod
from app.extensions import db
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app)
shipping_bp = Blueprint('shipping', __name__)

@shipping_bp.route('/methods', methods=['GET'])
def get_shipping_methods():
    shipping_method = ShippingMethod.query.all()
    return jsonify([method.to_dict() for method in shipping_method]), 200

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/methods', methods=['GET'])
def get_payment_methods():
    payment_method = PaymentMethod.query.all()
    return jsonify([method.to_dict() for method in payment_method]), 200
