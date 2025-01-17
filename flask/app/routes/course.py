from flask import Blueprint, request, jsonify, session, make_response
from app import db, mail
from app.models import Course, Enrollment
from datetime import datetime
from flask_mail import Message
from app.utils import retry_on_db_lock
import logging

course_blueprint = Blueprint('course', __name__)

@course_blueprint.route('/courses', methods=['POST'])
@retry_on_db_lock()
def register_course():
    try:
        logging.info(f"Raw request data: {request.data}")
        data = request.get_json()
        logging.info(f"Received JSON data: {data}")
    except Exception as e:
        logging.error(f"Failed to decode JSON object: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 400

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required_fields = ['id', 'title', 'description', 'start_date', 'end_date', 'instructor']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    course_id = data.get('id')
    
    if course_id:
        existing_course = Course.query.filter_by(id=course_id).first()
        if existing_course:
            return jsonify({'error': 'Course ID already exists'}), 400

    new_course = Course(
        id=course_id,  # Use provided id or let the database generate it
        title=data['title'],
        description=data['description'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
        instructor=data['instructor']  # Include instructor in course creation
    )
    db.session.add(new_course)
    db.session.commit()

    # Get the email of the currently logged-in user
    user_email = session.get('user_email')
    if user_email:
        send_course_notification(new_course, user_email)

    response = make_response(jsonify({'message': 'Course registered successfully'}), 201)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

@course_blueprint.route('/courses', methods=['GET'])
@retry_on_db_lock()
def get_courses():
    try:
        courses = Course.query.all()
        courses_list = [{
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'start_date': course.start_date,
            'end_date': course.end_date,
            'instructor': course.instructor  # Include instructor in response
        } for course in courses]
        if not courses_list:
            return jsonify([]), 203  # Return empty array with 200 status

        response = make_response(jsonify(courses_list))
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
    
    except Exception as e:
        # Log the error for debugging purposes
        print(f"Database error: {str(e)}")
        response = make_response(jsonify({"error": "Failed to fetch courses"}), 500)
        return response

@course_blueprint.route('/courses/<int:course_id>', methods=['PUT', 'OPTIONS'])
@retry_on_db_lock()
def update_course(course_id):
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, User-Role')
        response.headers.add('Access-Control-Allow-Methods', 'PUT')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    try:
        data = request.get_json()
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        # Update course fields
        course.title = data.get('title', course.title)
        course.description = data.get('description', course.description)
        course.start_date = datetime.strptime(data.get('start_date', course.start_date.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
        course.end_date = datetime.strptime(data.get('end_date', course.end_date.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
        course.instructor = data.get('instructor', course.instructor)  # Include instructor in update

        db.session.commit()
        
        response = jsonify({'message': 'Course updated successfully'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating course: {e}")
        return jsonify({'error': str(e)}), 500

@course_blueprint.route('/courses/<int:course_id>/students', methods=['GET'])
@retry_on_db_lock()
def get_course_students(course_id):
    try:
        enrollments = Enrollment.query.filter_by(course_id=course_id).all()
        students = [{
            'name': enrollment.user_name,
            'email': enrollment.user_email,
            # 'completed': enrollment.completed
        } for enrollment in enrollments]

        response = make_response(jsonify(students))
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    except Exception as e:
        logging.error(f"Error fetching students for course {course_id}: {e}")
        return jsonify({'error': 'Failed to fetch students'}), 500

def send_course_notification(course, recipient_email):
    try:
        logging.info(f"Sending email to {recipient_email} about course {course.title}")
        msg = Message(
            subject="New Course Created",
            sender="your-email@example.com",  # Update with your email
            recipients=[recipient_email],
            body=f"A new course has been created:\n\n"
                 f"Title: {course.title}\n"
                 f"Description: {course.description}\n"
                 f"Start Date: {course.start_date}\n"
                 f"End Date: {course.end_date}\n"
                 f"Instructor: {course.instructor}\n"  # Include instructor in email
        )
        mail.send(msg)
        logging.info("Email sent successfully")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
