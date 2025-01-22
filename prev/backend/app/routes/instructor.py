from flask import Blueprint, jsonify
from app import db
from app.models import Manager

instructor_blueprint = Blueprint('instructor', __name__)

@instructor_blueprint.route('/instructors', methods=['GET'])
def get_instructors():
    try:
        instructors = Manager.query.filter(Manager.role == 'instructor').all()
        instructor_list = [{
            'id': instructor.id,
            'first_name': instructor.first_name,
            'last_name': instructor.last_name
        } for instructor in instructors]
        return jsonify(instructor_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
