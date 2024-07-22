from flask import Flask
from flask_cors import CORS
from app import create_app

# Create Flask application instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Flask application using the create_app function from app module
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
