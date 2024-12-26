from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail

db = SQLAlchemy()
mail = Mail()

def create_app():
    app = Flask(__name__)

    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///managers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Update with your SMTP server
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'test9125978@gmail.com'  # Update with your email
    app.config['MAIL_PASSWORD'] = 'obos bipa kdfp svsd'  # Update with your email password
    app.config['SECRET_KEY'] = 'a3f5e67b8a9b4e1c8d29e3f7f21c5d3c9b4f8e1d3c6f7a9b2d3f5e6b7a9d8e1f'  # Set a unique and secret key

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    from app.routes.auth import auth_blueprint
    from app.routes.password import password_blueprint
    from app.routes.course import course_blueprint

    app.register_blueprint(auth_blueprint, url_prefix='/api')
    app.register_blueprint(password_blueprint, url_prefix='/api')
    app.register_blueprint(course_blueprint, url_prefix='/api')

    with app.app_context():
        db.create_all()

    return app
