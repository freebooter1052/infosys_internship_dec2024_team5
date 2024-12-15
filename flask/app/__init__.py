from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # App configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///managers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Register blueprints
    from app.routes.auth import auth_blueprint
    from app.routes.password import password_blueprint

    app.register_blueprint(auth_blueprint, url_prefix='/api')
    app.register_blueprint(password_blueprint, url_prefix='/api')

    return app
