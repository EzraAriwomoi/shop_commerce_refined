from flask import Blueprint, Flask, app, request, jsonify, current_app
from flask_cors import CORS
import requests
import json
from requests.auth import HTTPBasicAuth
from app.utils.mpesa import MpesaAccessToken, LipanaMpesaPpassword
from app.models import MpesaPayment
from app.extensions import db

app = Flask(__name__)
mpesa_bp = Blueprint('mpesa', __name__)
CORS(mpesa_bp, resources={r"/*": {"origins": "*"}})
app.config.from_object('config.Config')


@mpesa_bp.route('/')
def home():
    return "Welcome to Kletos !"

@mpesa_bp.route('/access/token', methods=['GET'])
def get_access_token():
    token = MpesaAccessToken.get_access_token()
    return token

@mpesa_bp.route('/online/lipa', methods=['POST'])
def lipa_na_mpesa_online():
    json_data = request.get_json()
    phone_number = json_data.get('phone_number')
    amount = json_data.get('amount')

    # Print values for debugging
    print(phone_number)
    print(amount)

    # Round the amount to the nearest whole number
    try:
        amount = round(float(amount))
    except ValueError:
        return jsonify({"error": "Invalid amount format"}), 400

    # Get access token
    access_token = MpesaAccessToken.get_access_token()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = {"Authorization": f"Bearer {access_token}"}

    # Prepare request data
    request_data = {
        "BusinessShortCode": LipanaMpesaPpassword.Business_short_code,
        "Password": LipanaMpesaPpassword.online_password,
        "Timestamp": LipanaMpesaPpassword.lipa_time,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": LipanaMpesaPpassword.Business_short_code,
        "PhoneNumber": phone_number,
        "CallBackURL": 'https://9069-102-0-11-2.ngrok-free.app/c2b/callback',
        "AccountReference": "Kletos",
        "TransactionDesc": "Testing",
    }

    # Make the request to the M-PESA API
    response = requests.post(api_url, json=request_data, headers=headers)

    return jsonify(response.json())

@mpesa_bp.route('/c2b/register', methods=['POST'])
def register_urls():
    access_token = MpesaAccessToken.get_access_token()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    headers = {"Authorization": f"Bearer {access_token}"}
    options = {
        "ShortCode": LipanaMpesaPpassword.Test_c2b_shortcode,
        "ResponseType": "Completed",
        "ConfirmationURL": current_app.config['CONFIRMATION_URL'],
        "ValidationURL": current_app.config['VALIDATION_URL']
    }
    response = requests.post(api_url, json=options, headers=headers)
    return response.text

@mpesa_bp.route('/c2b/callback', methods=['POST'])
def callback():
    try:
        print("STK PUSH CALLBACK")
        json_data = request.json
        with open("stkcallback.json", "w") as file:
            json.dump(json_data, file)
        print("STK PUSH CALLBACK JSON FILE SAVED")
        print(json_data)

        # Process the STK push callback data
        body = json_data.get("Body", {})
        stk_callback = body.get("stkCallback", {})
        callback_metadata = stk_callback.get("CallbackMetadata", {})
        items = callback_metadata.get("Item", [])

        # Extracting metadata
        metadata = {
            "MerchantRequestID": stk_callback.get("MerchantRequestID", ""),
            "CheckoutRequestID": stk_callback.get("CheckoutRequestID", ""),
            "ResultCode": stk_callback.get("ResultCode", ""),
            "ResultDesc": stk_callback.get("ResultDesc", ""),
        }

        # Extracting MPesa data
        mpesa_data = {item["Name"]: item["Value"] for item in items}

        # Merging metadata and MPesa data
        mpesa_data.update(metadata)

        # Logging MPesa data
        # app.logger.info(mpesa_data)

        # Sending data to frontend React application
        # You can use a message broker like RabbitMQ or a WebSocket for real-time updates
        # For simplicity, let's just return the data as JSON
        return jsonify(mpesa_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@mpesa_bp.route('/c2b/confirmation', methods=['POST'])
def confirmation():
    try:
        mpesa_payment = request.get_json()
        
        # Save the payment to the database
        payment = MpesaPayment(
            first_name=mpesa_payment.get('FirstName', ''),
            last_name=mpesa_payment.get('LastName', ''),
            middle_name=mpesa_payment.get('MiddleName', ''),
            description=mpesa_payment.get('TransID', ''),
            phone_number=mpesa_payment.get('MSISDN', ''),
            amount=mpesa_payment.get('TransAmount', ''),
            reference=mpesa_payment.get('BillRefNumber', ''),
            organization_balance=mpesa_payment.get('OrgAccountBalance', ''),
            type=mpesa_payment.get('TransactionType', '')
        )
        db.session.add(payment)
        db.session.commit()

        response = {
            "ResultCode": 0,
            "ResultDesc": "Accepted"
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mpesa_bp.route('/c2b/validation', methods=['POST'])
def validation():
    response = {
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }
    return jsonify(response)
