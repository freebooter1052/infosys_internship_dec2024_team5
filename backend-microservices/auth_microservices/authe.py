from flask import request, jsonify, make_response
import jwt
import datetime
import random
from auth_microservices.utils import send_otp
from auth_microservices import app, db
from auth_microservices.models import Manager

# Global OTP storage
otp_storage = {}

@app.route('/test', methods=['GET'])
def test_service_status():
    return jsonify({
        "message": "Authentication service is running!",
        "status": "success"
    }), 200

@app.route('/getUserData', methods=['POST'])
def get_user_data():
    data = request.get_json()
    email = data.get('email')
    user = Manager.query.filter_by(email=email).first()
    if user:
        user_data = {
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404
