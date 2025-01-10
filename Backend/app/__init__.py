from dotenv import load_dotenv
from flask import Flask, request
from flask_migrate import Migrate
from .extensions import db, migrate, jwt, mail, csrf, login_manager
from flask_wtf.csrf import generate_csrf
from config import Config
from .error_handlers import register_error_handlers
from .routes import register_routes

load_dotenv()
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    # migrate.init_app(app, db)
    login_manager.init_app(app)
    jwt.init_app(app)
    csrf.init_app(app)
    mail.init_app(app)
    mail.init_app(app)

    migrate = Migrate(app, db)
    
    from app.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    @app.after_request
    def set_csrf_cookie(response):
        if 'csrf_token' not in request.cookies:
            response.set_cookie('csrf_token', generate_csrf())
        return response

    @app.before_request
    def disable_csrf_for_api():
        if request.path.startswith('/api/'):
            setattr(request, '_disable_csrf', True)
    
    register_routes(app)
    register_error_handlers(app)

    return app
