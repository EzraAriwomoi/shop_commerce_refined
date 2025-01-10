# mpesa.py
import requests
import json
from requests.auth import HTTPBasicAuth
from datetime import datetime
import base64
from flask import current_app

class MpesaAccessToken:
    @staticmethod
    def get_access_token():
        try:
            # Correct URL for obtaining the access token
            access_token_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            
            r = requests.get(access_token_url, 
            auth=HTTPBasicAuth(current_app.config['CONSUMER_KEY'], current_app.config['CONSUMER_SECRET']))
            r.raise_for_status()  # Check if the request was successful
            mpesa_access_token = r.json()
            print("Response from API:", mpesa_access_token)
            if 'access_token' in mpesa_access_token:
                return mpesa_access_token['access_token']
            else:
                raise KeyError("'access_token' not found in the response")
        except requests.exceptions.RequestException as e:
            print(f"HTTP error occurred: {e}")
            raise
        except KeyError as e:
            print(f"Key error occurred: {e}")
            raise

class LipanaMpesaPpassword:
    lipa_time = datetime.now().strftime('%Y%m%d%H%M%S')
    Business_short_code = '174379'
    Test_c2b_shortcode = '98974'
    passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'

    data_to_encode = Business_short_code + passkey + lipa_time
    online_password = base64.b64encode(data_to_encode.encode()).decode('utf-8')
