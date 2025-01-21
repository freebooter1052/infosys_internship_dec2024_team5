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
