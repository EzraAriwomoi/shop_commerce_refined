from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager
import firebase_admin
from firebase_admin import credentials, storage

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()
csrf = CSRFProtect()
login_manager = LoginManager()

cred_path = os.getenv('FIREBASE_CREDENTIALS')

# Initialize Firebase
cred = credentials.Certificate(cred_path)
firebase_app = firebase_admin.initialize_app(cred, {
    'storageBucket': 'kletos-16f7b.appspot.com'
})

# Initialize Firebase Storage client
firebase_storage = storage.bucket(app=firebase_app)