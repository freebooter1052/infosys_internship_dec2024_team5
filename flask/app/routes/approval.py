from flask import Blueprint, request, jsonify
from app.models import db, Manager
from flask_cors import cross_origin

approval_blueprint = Blueprint('approval', __name__)

@approval_blueprint.route('/users', methods=['GET'])  # Remove /api prefix
def get_users():
    users = Manager.query.filter(Manager.status == 'pending').all()
    users_list = [{"email": user.email, "status": user.status, "role": user.role} for user in users if user.role != 'hr']
    return jsonify(users_list)

@approval_blueprint.route('/updateApprovalStatus', methods=['POST'])  # Remove /api prefix
def update_approval_status():
    data = request.get_json()
    email = data.get('email')
    status = data.get('status')
    user = Manager.query.filter_by(email=email).first()
    if user and user.role != 'hr':
        user.status = status
        db.session.commit()
        return jsonify({"message": f"User {email} status updated to {status}"}), 200
    return jsonify({"error": "User not found or user is HR"}), 404
