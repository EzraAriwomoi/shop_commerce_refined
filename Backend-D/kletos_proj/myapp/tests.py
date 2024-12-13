from django.test import TestCase
import requests

url = "http://127.0.0.1:8000/api/users/sign_in/"
data = {"email": "kropezra@gmail.com", "password": "Mypass2."}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("An error occurred:", str(e))

