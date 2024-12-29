from flask import Flask, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_session import Session
import logging
from datetime import timedelta

db = SQLAlchemy()
mail = Mail()

def create_app():
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Configure CORS
    CORS(app, 
         supports_credentials=True,
         resources={
             r"/api/*": {
                 "origins": ["http://localhost:3000"],
                 "allow_credentials": True,
                 "methods": ["GET", "POST", "PUT", "OPTIONS"],
                 "allow_headers": ["Content-Type"],
                 "expose_headers": ["Set-Cookie"]
             }
         })
    
    # Configure your app
    app.config['SECRET_KEY'] = 'your-secret-key'  # Replace with your secret key
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

    # Register blueprints
    from app.routes.auth import auth_blueprint
    from app.routes.password import password_blueprint
    from app.routes.course import course_blueprint
    from app.routes.audit import audit_blueprint

    app.register_blueprint(auth_blueprint, url_prefix='/api')
    app.register_blueprint(password_blueprint, url_prefix='/api')
    app.register_blueprint(course_blueprint, url_prefix='/api')
    app.register_blueprint(audit_blueprint, url_prefix='/api')

    with app.app_context():
        db.create_all()

    return app
