from flask import Blueprint, request, jsonify, make_response, current_app
from auth_microservices import db
from auth_microservices.models import Manager
import jwt
import datetime
import logging

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    required_fields = ["firstName", "lastName", "email", "password", "confirmPassword", "role"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    if data['password'] != data['confirmPassword']:
        return jsonify({"error": "Passwords do not match"}), 400

    existing_manager = Manager.query.filter_by(email=data['email']).first()
    if existing_manager:
        return jsonify({"error": "Email already registered"}), 400

    role = data['role'].lower()
    if role == 'learner':
        role = 'user'

    status = 'approved' if role == 'hr' else 'pending'

    new_manager = Manager(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=data['password'],
        role=role,
        status=status
    )
    db.session.add(new_manager)
    db.session.commit()

    return jsonify({"message": "registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    logging.info(f"Login attempt with data: {data}")

    required_fields = ["email", "password", "role"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Email, password, and role are required"}), 400

    manager = Manager.query.filter_by(email=data['email']).first()
    logging.info(f"Found manager: {manager}")
    
    if not manager:
        return jsonify({"error": "Invalid email"}), 401
    if manager.password != data['password']:
        return jsonify({"error": "Invalid password"}), 401
    if manager.status != 'approved' and manager.role != 'hr':  # Check if the user is approved or HR
        return jsonify({"error": "Account not approved"}), 403

    # Normalize roles for comparison
    provided_role = data['role'].lower()
    stored_role = manager.role.lower()

    # Treat 'learner' and 'user' as equivalent
    if provided_role == 'learner':
        provided_role = 'user'
    if stored_role == 'learner':
        stored_role = 'user'
        manager.role = 'user'
        db.session.commit()

    logging.info(f"Comparing roles: provided={provided_role}, stored={stored_role}")

    if stored_role != provided_role:
        return jsonify({"error": "Invalid role"}), 401

    token = jwt.encode({
        'user_email': manager.email,
        'role': stored_role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    

    response = make_response(jsonify({
        "message": "Login successful",
        "token": token,
        "role": stored_role,
        "email": manager.email,
        "name": manager.first_name
    }), 200)

    print(token)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response



