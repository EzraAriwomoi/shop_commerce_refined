import os

class Config:
    SECRET_KEY = 'oukTCBjR5s05jv-B6LoZzeeJnmNVX_ZB'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    JWT_SECRET_KEY = 'oukTCBjR5s05jv-B6LoZzeeJnmNVX_ZB'
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'abdulnassirbakari@gmail.com'
    MAIL_PASSWORD = 'mmlmpakzphfitjyi'
    MAIL_DEFAULT_SENDER = 'abdulnassirbakari@gmail.com'
    SECURITY_PASSWORD_SALT = os.getenv('SECURITY_PASSWORD_SALT')