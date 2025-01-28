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
    
    # Enable CORS for all routes
    CORS(app)
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Configure CORS
    CORS(app, 
         supports_credentials=True,
         resources={
             r"/api/*": {
                 "origins": ["http://localhost:3000"],
                 "methods": ["GET", "POST", "PUT", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization", "User-Role"],
                 "expose_headers": ["Set-Cookie"],
                 "max_age": 3600
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
    from app.routes.enroll import enroll_blueprint
    from app.routes.user_status import user_status_blueprint
    from app.routes.approval import approval_blueprint  # Add this line
    from app.routes.instructor import instructor_blueprint  # Add this line
    from app.routes.insights import insights_blueprint  # Add this line
    from app.routes.module import module_blueprint  # Add this line
    from app.routes.students import students_blueprint
    from app.routes.individual_progress import individual_progress_blueprint
    from app.routes.ManagerView import manager_view_blueprint  # Add this line
    from app.routes.HRView import hr_view_blueprint  # Add this line

    app.register_blueprint(auth_blueprint, url_prefix='/api')
    app.register_blueprint(password_blueprint, url_prefix='/api')
    app.register_blueprint(course_blueprint, url_prefix='/api')
    app.register_blueprint(audit_blueprint, url_prefix='/api')
    app.register_blueprint(enroll_blueprint, url_prefix='/api')
    app.register_blueprint(user_status_blueprint, url_prefix='/api')
    app.register_blueprint(approval_blueprint, url_prefix='/api')  # Add this line
    app.register_blueprint(instructor_blueprint, url_prefix='/api')  # Add this line
    app.register_blueprint(insights_blueprint, url_prefix='/api')  # Add this line
    app.register_blueprint(module_blueprint, url_prefix='/api')  # Add this line
    app.register_blueprint(students_blueprint)
    app.register_blueprint(individual_progress_blueprint, url_prefix='/api')
    app.register_blueprint(manager_view_blueprint, url_prefix='/api')  # Add this line
    app.register_blueprint(hr_view_blueprint, url_prefix='/api')  # Add this line

    with app.app_context():
        db.create_all()  # Create tables
        
        # Run migrations
        from migrations.add_completed_at import add_completed_at_column
        from migrations.create_module_completion import create_module_completion_table
        from migrations.add_test_modules import add_test_modules
        
        add_completed_at_column()
        create_module_completion_table()
        add_test_modules()  # Add test data

    return app
