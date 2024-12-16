from flask import Blueprint, request, jsonify
from app.models import db, Manager
from app.utils import send_otp
import random

password_blueprint = Blueprint('password', __name__)

# Use a global variable to store OTPs
otp_storage = {}

@password_blueprint.route('/forgot-password', methods=['POST'])
def forgot_password():
    global otp_storage
    data = request.json
    if 'email' not in data:
        return jsonify({"error": "Email is required"}), 400

    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager:
        return jsonify({"error": "Email not registered"}), 400

    otp = random.randint(100000, 999999)
    otp_storage[data['email']] = otp

    send_otp(manager.email, otp)
    #return jsonify({"message": "OTP sent to your registered email"}), 200

@password_blueprint.route('/verify-otp', methods=['POST'])
def verify_otp():
    global otp_storage
    data = request.json
    if 'email' not in data or 'otp' not in data:
        return jsonify({"error": "Email and OTP are required"}), 400

    email = data['email']
    otp = int(data['otp'])


    if email in otp_storage and otp_storage[email] == otp:
        del otp_storage[email]
        return jsonify({"message": "OTP verified successfully"}), 200
    else:
        return jsonify({"error": "Invalid OTP"}), 400
