from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'

# Initialize database
db = SQLAlchemy(app)

# Import models first to ensure they're registered
from auth_microservices.models import Manager

# Import routes last to avoid circular imports
from auth_microservices.routes import auth_routes, password_routes

from auth_microservices import app, db
import auth_microservices.authe  # Ensure routes are registered

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5001)