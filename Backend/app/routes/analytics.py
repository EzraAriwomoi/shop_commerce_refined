from flask import Blueprint, Flask, jsonify
from flask_jwt_extended import jwt_required
from app.models import Order
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app)
analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/sales', methods=['GET'])
@jwt_required()
def sales_analytics():
    # Example logic to retrieve sales analytics
    total_sales = Order.query.filter_by(status='Completed').count()
    total_orders = Order.query.count()
    average_order_value = Order.query.with_entities(func.avg(Order.total_price)).scalar()

    return jsonify({
        'total_sales': total_sales,
        'total_orders': total_orders,
        'average_order_value': average_order_value,
    }), 200