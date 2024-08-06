from flask import Flask
from flask_cors import CORS
from app import create_app
from dotenv import load_dotenv
import os

app = Flask(__name__)
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})

app = create_app()

load_dotenv()

app.config['CONSUMER_KEY'] = os.getenv('CONSUMER_KEY')
app.config['CONSUMER_SECRET'] = os.getenv('CONSUMER_SECRET')
app.config['API_URL'] = os.getenv('API_URL')
app.config['BUSINESS_SHORT_CODE'] = os.getenv('BUSINESS_SHORT_CODE')
app.config['TEST_C2B_SHORTCODE'] = os.getenv('TEST_C2B_SHORTCODE')
app.config['PASSKEY'] = os.getenv('PASSKEY')
app.config['CALLBACK_URL'] = os.getenv('CALLBACK_URL')
app.config['CONFIRMATION_URL'] = os.getenv('CONFIRMATION_URL')
app.config['VALIDATION_URL'] = os.getenv('VALIDATION_URL')

if __name__ == '__main__':
    app.run(debug=True)
