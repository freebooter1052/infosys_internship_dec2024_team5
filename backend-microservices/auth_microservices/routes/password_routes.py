from flask import Blueprint, request, jsonify, make_response
from auth_microservices import db
from auth_microservices.models import Manager
from auth_microservices.authe import otp_storage
from auth_microservices.utils import send_otp
import random
import logging

password_bp = Blueprint('password_bp', __name__)

@password_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    global otp_storage
    data = request.json
    if 'email' not in data:
        logging.error("Email is required")
        return jsonify({"error": "Email is required"}), 400

    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager:
        logging.error("Email not registered")
        return jsonify({"error": "Email not registered"}), 400

    otp = random.randint(100000, 999999)
    otp_storage[data['email']] = otp
    logging.info(f"Stored OTP for {data['email']}: {otp}")
    send_otp(manager.email, otp)
    
    logging.info("OTP sent to registered email")
    return jsonify({"message": "OTP sent to your registered email"})

@password_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    global otp_storage
    data = request.json
    logging.info(f"Received data for verify-otp: {data}")
    if 'email' not in data or 'otp' not in data:
        logging.error("Email and OTP are required")
        response = make_response(jsonify({"error": "Email and OTP are required"}), 400)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    email = data['email']
    otp = int(data['otp'])

    logging.info(f"Stored OTPs: {otp_storage}")
    logging.info(f"Received OTP: {otp} for email: {email}")

    if email in otp_storage and otp_storage[email] == otp:
        del otp_storage[email]
        logging.info("OTP verified successfully")
        response = jsonify({"message": "OTP verified successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    else:
        logging.error("Invalid OTP")
        response = jsonify({"error": "Invalid OTP"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return make_response(response, 400)

@password_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    if 'email' not in data or 'new_password' not in data:
        logging.error("Email and new password are required")
        response = make_response(jsonify({"error": "Email and new password are required"}), 400)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    # Query manager
    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager:
        logging.error("Email not registered")
        response = make_response(jsonify({"error": "Email not registered"}), 400)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    # Update password
    manager.password = data['new_password']
    db.session.commit()

    logging.info("Password reset successfully")
    # Return success response
    response = make_response(jsonify({"message": "Password reset successfully"}), 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
