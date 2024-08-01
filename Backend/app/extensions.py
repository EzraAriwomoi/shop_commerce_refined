from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
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

# Initialize Firebase Admin SDK
cred = credentials.Certificate('C:\\Users\\USER\\Documents\\KLETOS\\Backend\\app\\kletos-d86bc-firebase-adminsdk-wpe3s-7c4898beb9.json')
firebase_app = firebase_admin.initialize_app(cred, {
    'storageBucket': 'kletos-16f7b.appspot.com'  # Update with your storage bucket name
})

# Initialize Firebase Storage client
firebase_storage = storage.bucket(app=firebase_app)