from flask import Blueprint, request, jsonify, session, make_response
from app import db
from app.models import Enrollment, Course, User
import logging

enrollment_blueprint = Blueprint('enrollment', __name__)

@enrollment_blueprint.route('/enroll', methods=['POST', 'OPTIONS'])
def enroll_course():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    user_email = session.get('user_email')
    if not user_email:
        logging.error('User not logged in')
        return jsonify({'error': 'User not logged in'}), 401

    try:
        data = request.get_json()
        logging.info(f"Received enrollment data: {data}")
    except Exception as e:
        logging.error(f"Failed to decode JSON object: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 400

    if not data or 'courseId' not in data:
        return jsonify({'error': 'No course ID provided'}), 400

    course_id = data['courseId']

    user = User.query.filter_by(email=user_email).first()
    if not user:
        logging.error('User not found')
        return jsonify({'error': 'User not found'}), 404

    course = Course.query.get(course_id)
    if not course:
        logging.error('Course not found')
        return jsonify({'error': 'Course not found'}), 404

    existing_enrollment = Enrollment.query.filter_by(user_id=user.id, course_id=course_id).first()
    if existing_enrollment:
        logging.error('Already enrolled in this course')
        return jsonify({'error': 'Already enrolled in this course'}), 400

    new_enrollment = Enrollment(user_id=user.id, course_id=course_id)
    db.session.add(new_enrollment)
    db.session.commit()

    logging.info('Enrolled successfully')
    response = jsonify({'message': 'Enrolled successfully'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response, 200
