from flask import Blueprint, request, jsonify, make_response
from app.models import db, Manager
from app.utils import send_otp
from werkzeug.security import generate_password_hash
import random

password_blueprint = Blueprint('password', __name__)

# Use a global variable to store OTPs
otp_storage = {}

# Forgot Password Route: Sends OTP
@password_blueprint.route('/forgot-password', methods=['POST'])
def forgot_password():
    global otp_storage
    data = request.json
    if 'email' not in data:
        return make_response(jsonify({"error": "Email is required"}), 400)

    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager:
        return make_response(jsonify({"error": "Email not registered"}), 400)

    otp = random.randint(100000, 999999)
    otp_storage[data['email']] = otp

    send_otp(manager.email, otp)
    response = jsonify({"message": "OTP sent to your registered email"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# Verify OTP Route
@password_blueprint.route('/verify-otp', methods=['POST'])
def verify_otp():
    global otp_storage
    data = request.json
    if 'email' not in data or 'otp' not in data:
        return make_response(jsonify({"error": "Email and OTP are required"}), 400)

    email = data['email']
    otp = int(data['otp'])

    if email in otp_storage and otp_storage[email] == otp:
        del otp_storage[email]
        response = jsonify({"message": "OTP verified successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        response = jsonify({"error": "Invalid OTP"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return make_response(response, 400)

# Reset Password Route
@password_blueprint.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    if 'email' not in data or 'new_password' not in data:
        return make_response(jsonify({"error": "Email and new password are required"}), 400)

    # Query manager
    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager:
        return make_response(jsonify({"error": "Email not registered"}), 400)

    # Hash the new password and update it in the database
    hashed_password = generate_password_hash(data['new_password'], method='sha256')
    manager.password = hashed_password

    # Commit changes
    db.session.commit()

    response = jsonify({"message": "Password reset successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
