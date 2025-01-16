from flask import Blueprint, request, jsonify
from app import db
from app.models import Enrollment
import logging

enroll_blueprint = Blueprint('enroll', __name__)

@enroll_blueprint.route('/enroll', methods=['POST'])
def enroll_course():
    logging.info(f"Received enrollment request. Method: {request.method}")
    logging.info(f"Headers: {request.headers}")

    # if request.method == 'OPTIONS':
    #     response = jsonify({'message': 'preflight'})
    #     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    #     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    #     response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
    #     response.headers.add('Access-Control-Allow-Credentials', 'true')
    #     return response, 200
    
    try:
        logging.info("Processing enrollment request")
        data = request.get_json()
        logging.info(f"Enrollment data received: {data}")

        # Check if all required fields are present
        if 'courseId' not in data or 'user_email' not in data or 'user_name' not in data:
            return jsonify({'error': 'Missing required fields'}), 402

        # Check if user is already enrolled
        existing_enrollment = Enrollment.query.filter_by(
            course_id=data['courseId'],
            user_email=data['user_email']
        ).first()
        
        if existing_enrollment:
            return jsonify({'error': 'Already enrolled in this course'}), 400

        new_enrollment = Enrollment(
            course_id=data['courseId'],
           user_email=data['user_email'],
           user_name=data['user_name']
        )
        print("hello")
        
        db.session.add(new_enrollment)
        db.session.commit()
        logging.info(f"Successfully enrolled user {data['user_email']} in course {data['courseId']}")
        
        response = jsonify({'message': 'Successfully enrolled'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Enrollment error: {e}")
        return jsonify({'error': str(e)}), 500
