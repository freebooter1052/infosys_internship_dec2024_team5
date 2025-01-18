from flask import Blueprint, jsonify
from flask_cors import CORS
from app.models import Course, Enrollment, Module, db
from sqlalchemy import desc

students_blueprint = Blueprint('students', __name__)
CORS(students_blueprint)

@students_blueprint.route('/api/courses/<int:course_id>/students', methods=['GET'])
def get_course_students(course_id):
    try:
        enrollments = Enrollment.query.filter_by(course_id=course_id).all()
        
        students_data = []
        for enrollment in enrollments:
            # Get all modules for this course
            all_modules = Module.query.filter_by(course_id=course_id).all()
            
            # Get completed modules for this student
            completed_modules = Module.query.filter_by(course_id=course_id, completion_status='Completed').all()
            
            # Calculate progress based on completed modules
            total_modules = len(all_modules)
            progress = (len(completed_modules) / total_modules * 100) if total_modules > 0 else 0

            students_data.append({
                'name': enrollment.user_name,
                'email': enrollment.user_email,
                'completed': progress == 100,
                'progress': round(progress, 2),
                'completedModules': [{
                    'title': module.title,
                    'completedAt': module.completed_at.isoformat() if module.completed_at else None
                } for module in completed_modules]
            })

        return jsonify(students_data)
    except Exception as e:
        logging.error(f"Error fetching student data: {str(e)}")
        return jsonify([])  # Return empty array on error
