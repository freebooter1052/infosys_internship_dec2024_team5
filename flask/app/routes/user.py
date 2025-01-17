from flask import Blueprint, jsonify
from app.models import Manager

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/users', methods=['GET'])
def get_users():
    users = Manager.query.all()
    users_list = [{'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email, 'role': user.role, 'status': user.status} for user in users]
    return jsonify(users_list), 200
