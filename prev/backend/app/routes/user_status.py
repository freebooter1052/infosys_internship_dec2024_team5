from flask import Blueprint, request, jsonify
from app import db
from app.models import Enrollment, Userstatus
import logging

user_status_blueprint = Blueprint('user_status', __name__)

@user_status_blueprint.route('/user-status', methods=['GET', 'OPTIONS'])
def get_user_status():
    logging.info("Received user-status request")
    logging.info(f"Request method: {request.method}")
    logging.info(f"Request headers: {request.headers}")
    
    # Handle OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'preflight'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    try:
        user_email = request.args.get('email')
        if not user_email:
            return jsonify({'error': 'Email is required'}), 400

        enrolled_courses = Enrollment.query.filter_by(user_email=user_email).all()
        enrolled_course_ids = [enrollment.course_id for enrollment in enrolled_courses]

        completed_courses = Userstatus.query.filter_by(user_email=user_email, status='completed').all()
        completed_course_ids = [status.course_id for status in completed_courses]

        user_status = {
            'enrolledCourses': enrolled_course_ids,
            'completedCourses': completed_course_ids
        }

        response = jsonify(user_status)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    except Exception as e:
        logging.error(f"Error in user-status route: {str(e)}")
        return jsonify({'error': str(e)}), 500
