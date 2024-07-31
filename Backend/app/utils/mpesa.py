import requests
import json
from requests.auth import HTTPBasicAuth
from datetime import datetime
import base64
from flask import current_app

class MpesaAccessToken:
    @staticmethod
    def get_access_token():
        r = requests.get(current_app.config['API_URL'], 
                         auth=HTTPBasicAuth(current_app.config['CONSUMER_KEY'], current_app.config['CONSUMER_SECRET']))
        mpesa_access_token = json.loads(r.text)
        return mpesa_access_token['access_token']

class LipanaMpesaPpassword:
    lipa_time = datetime.now().strftime('%Y%m%d%H%M%S')
    Business_short_code = '4084887'
    Test_c2b_shortcode = '600344'
    passkey = 'a5ce9f8f9b6621de9573b4f3eac5d2f3c245e4fefe96722be3ce2c421277f960'

    data_to_encode = Business_short_code + passkey + lipa_time
    online_password = base64.b64encode(data_to_encode.encode()).decode('utf-8')
