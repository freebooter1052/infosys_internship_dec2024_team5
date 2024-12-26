from flask import Blueprint, request, jsonify, session, make_response
from app import db, mail
from app.models import Course
from datetime import datetime
from flask_mail import Message
import logging

course_blueprint = Blueprint('course', __name__)

@course_blueprint.route('/courses', methods=['POST'])
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

    required_fields = ['id', 'title', 'description', 'start_date', 'end_date']
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
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date()
    )
    db.session.add(new_course)
    db.session.commit()

    # Get the email of the currently logged-in user
    user_email = session.get('user_email')
    if user_email:
        send_course_notification(new_course, user_email)

    response = make_response(jsonify({'message': 'Course registered successfully'}), 201)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response

@course_blueprint.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    courses_list = [{
        'id': course.id,
        'title': course.title,
        'description': course.description,
        'start_date': course.start_date,
        'end_date': course.end_date
    } for course in courses]
    response = make_response(jsonify(courses_list))
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response

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
        )
        mail.send(msg)
        logging.info("Email sent successfully")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
