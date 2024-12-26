from flask import Blueprint, request, jsonify, session, make_response
from app.models import db, Manager

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
    required_fields = ["email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Email and password are required"}), 400

    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager or manager.password != data['password']:
        return jsonify({"error": "Invalid email or password"}), 401

    # Store the user's email in the session
    session['user_email'] = manager.email

    response = make_response(jsonify({"message": "Login successful"}), 200)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response
