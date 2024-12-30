from flask import Blueprint, request, jsonify, session, make_response
from app.models import db, Manager
from flask_cors import cross_origin
import logging

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/signup', methods=['POST'])
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

    new_manager = Manager(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=data['password'],
        role=data['role']
    )
    db.session.add(new_manager)
    db.session.commit()

    response = make_response(jsonify({"message": " registered successfully"}), 201)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    logging.info(f"Login attempt with data: {data}")  # Debug log

    required_fields = ["email", "password", "role"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Email, password, and role are required"}), 400

    manager = Manager.query.filter_by(email=data['email']).first()
    logging.info(f"Found manager: {manager}")  # Debug log
    
    if manager:
        logging.info(f"Comparing roles: provided={data['role'].lower()}, stored={manager.role.lower()}")  # Debug log
        
    if not manager:
        return jsonify({"error": "Invalid email"}), 401
    if manager.password != data['password']:
        return jsonify({"error": "Invalid password"}), 401
    if manager.role.lower() != data['role'].lower():
        return jsonify({"error": "Invalid role"}), 401

    # Store the user's email and role in the session
    session['user_email'] = manager.email
    session['user_role'] = manager.role.lower()
    
    logging.info(f"Login successful for {manager.email} with role {manager.role}")  # Debug log

    response = make_response(jsonify({
        "message": "Login successful",
        "role": manager.role.lower()
    }), 200)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response
'''
@auth_blueprint.route('/get-user-role', methods=['GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def get_user_role():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    user_role = session.get('user_role')
    if user_role:
        response = make_response(jsonify({"role": user_role.lower()}), 200)
    else:
        response = make_response(jsonify({"error": "User role not found"}), 404)
    
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response
'''


