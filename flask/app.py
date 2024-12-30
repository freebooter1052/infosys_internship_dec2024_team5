from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # This enables CORS for all routes (useful for frontend-backend interaction)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///courses.db'  # Using SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the SQLAlchemy object
db = SQLAlchemy(app)

# Create the Student and Course models
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    enrolled_courses = db.relationship('Course', secondary='enrollment', backref='students', lazy='dynamic')

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    instructor = db.Column(db.String(100), nullable=False)
    creation_date = db.Column(db.DateTime, default=datetime.utcnow)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    students = db.relationship('Student', secondary='enrollment', backref='courses', lazy='dynamic')

# Many-to-many relationship table for Student and Course
class Enrollment(db.Model):
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)

# Initialize the database (Run this once to create the tables)
@app.before_first_request
def create_tables():
    db.create_all()

# Route to get all courses
@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.all()
        courses_data = []
        for course in courses:
            courses_data.append({
                'id': course.id,
                'title': course.title,
                'instructor': course.instructor,
                'creation_date': course.creation_date.strftime('%Y-%m-%d'),
                'start_date': course.start_date.strftime('%Y-%m-%d'),
                'end_date': course.end_date.strftime('%Y-%m-%d'),
            })
        return jsonify(courses_data)
    except Exception as e:
        return jsonify({"message": "Error fetching courses", "error": str(e)}), 500

# Route to get details of a specific course
@app.route('/api/course-details/<int:course_id>', methods=['GET'])
def get_course_details(course_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": "Course not found"}), 404

        students = []
        for student in course.students:
            students.append({
                'name': student.name,
                'email': student.email
            })

        course_details = {
            'id': course.id,
            'title': course.title,
            'instructor': course.instructor,
            'creation_date': course.creation_date.strftime('%Y-%m-%d'),
            'start_date': course.start_date.strftime('%Y-%m-%d'),
            'end_date': course.end_date.strftime('%Y-%m-%d'),
            'students': students
        }

        return jsonify(course_details)
    except Exception as e:
        return jsonify({"message": "Error fetching course details", "error": str(e)}), 500

# Route to enroll a student in a course
@app.route('/api/enroll', methods=['POST'])
def enroll_in_course():
    try:
        student_email = request.json.get('email')
        course_id = request.json.get('courseId')

        # Fetch the student and course
        student = Student.query.filter_by(email=student_email).first()
        course = Course.query.get(course_id)

        if not student:
            return jsonify({"message": "Student not found"}), 404
        if not course:
            return jsonify({"message": "Course not found"}), 404

        # Check if the student is already enrolled in the course
        if course in student.enrolled_courses:
            return jsonify({"message": "Student is already enrolled in this course"}), 400

        # Enroll the student
        student.enrolled_courses.append(course)
        db.session.commit()

        return jsonify({"message": f"Student {student.name} successfully enrolled in '{course.title}'!"}), 200
    except Exception as e:
        return jsonify({"message": "Error enrolling student", "error": str(e)}), 500

# Route to get enrollment status of a student in a course
@app.route('/api/enrollment-status', methods=['GET'])
def get_enrollment_status():
    try:
        student_email = request.args.get('email')
        course_id = request.args.get('courseId')

        student = Student.query.filter_by(email=student_email).first()
        course = Course.query.get(course_id)

        if not student or not course:
            return jsonify({"message": "Student or course not found"}), 404

        if course in student.enrolled_courses:
            return jsonify({"message": f"Student is enrolled in the course '{course.title}'."}), 200
        else:
            return jsonify({"message": f"Student is not enrolled in the course '{course.title}'."}), 200
    except Exception as e:
        return jsonify({"message": "Error fetching enrollment status", "error": str(e)}), 500

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
