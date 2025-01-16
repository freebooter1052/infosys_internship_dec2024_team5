from flask import Flask, session, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_session import Session
import logging
from datetime import timedelta
from dotenv import load_dotenv
import os

db = SQLAlchemy()
mail = Mail()

def create_app():
    load_dotenv()  # Load environment variables from .env file
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Update CORS configuration
    CORS(app, 
         supports_credentials=True,
         resources={
             r"/api/*": {
                 "origins": ["http://localhost:3000"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "expose_headers": ["Content-Type", "Authorization"],
                 "supports_credentials": True
             }
         })
    
    # Configure your app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-generated-secret-key')  # Load from environment variable
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///managers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

    db.init_app(app)
    mail.init_app(app)
    Session(app)

    # Add debug route to test API
    @app.route('/api/test', methods=['GET'])
    def test_route():
        return jsonify({"message": "API is working"}), 200

    # Add request logging
    @app.before_request
    def log_request_info():
        logging.info(f"Request Path: {request.path}")
        logging.info(f"Request Method: {request.method}")
        logging.info(f"Request Headers: {request.headers}")

    # Register blueprints
    from app.routes.auth import auth_blueprint
    from app.routes.password import password_blueprint
    from app.routes.course import course_blueprint
    from app.routes.audit import audit_blueprint
    from app.routes.enroll import enroll_blueprint
    from app.routes.user_status import user_status_blueprint
    from app.routes.user import user_blueprint  # Import user blueprint
    from app.routes.instructor import instructor_blueprint  # Import instructor blueprint
    

    logging.info("Registering blueprints...")
    app.register_blueprint(auth_blueprint, url_prefix='/api')
    app.register_blueprint(password_blueprint, url_prefix='/api')
    app.register_blueprint(course_blueprint, url_prefix='/api')
    app.register_blueprint(audit_blueprint, url_prefix='/api')
    app.register_blueprint(enroll_blueprint, url_prefix='/api')
    app.register_blueprint(user_status_blueprint, url_prefix='/api')
    app.register_blueprint(user_blueprint, url_prefix='/api')  # Register user blueprint under /api
    app.register_blueprint(instructor_blueprint, url_prefix='/api')  # Register instructor blueprint under /api

    with app.app_context():
        db.create_all()

    return app
