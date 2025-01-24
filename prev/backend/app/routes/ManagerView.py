from flask import Blueprint, jsonify, request
from app.models import db, Manager, Course, Enrollment, Module, Quiz, module_completion
from sqlalchemy import func
from flask_cors import CORS

manager_view_blueprint = Blueprint('manager_view', __name__)
CORS(manager_view_blueprint, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@manager_view_blueprint.route('/manager-view', methods=['GET'])
def get_team_progress():
    try:
        # Get filter parameters
        course_filter = request.args.get('course', '')
        employee_filter = request.args.get('employee', '')

        # Base query
        query = db.session.query(
            Enrollment,
            Course,
            func.count(module_completion.c.module_id).label('completed_modules'),
            func.avg(Quiz.correct_answer.cast(db.Float)).label('quiz_score')
        ).join(
            Course, Enrollment.course_id == Course.id
        ).outerjoin(
            module_completion, Enrollment.id == module_completion.c.enrollment_id
        ).outerjoin(
            Module, Course.id == Module.course_id
        ).outerjoin(
            Quiz, Module.id == Quiz.module_id
        ).group_by(
            Enrollment.id
        )

        # Apply filters
        if course_filter:
            query = query.filter(Course.title.ilike(f'%{course_filter}%'))
        if employee_filter:
            query = query.filter(Enrollment.user_name.ilike(f'%{employee_filter}%'))

        results = query.all()

        # Format response data
        response_data = []
        for enrollment, course, completed_modules, quiz_score in results:
            # Calculate total modules for completion percentage
            total_modules = db.session.query(func.count(Module.id)).filter(
                Module.course_id == course.id
            ).scalar() or 1  # Avoid division by zero

            completion_percentage = (completed_modules / total_modules) * 100 if total_modules > 0 else 0
            quiz_score = float(quiz_score) if quiz_score is not None else 0

            response_data.append({
                'id': enrollment.id,
                'name': enrollment.user_name,
                'course': course.title,
                'completion': round(completion_percentage, 2),
                'quizScore': round(quiz_score, 2),
                'status': 'Completed' if completion_percentage == 100 else 'Active'
            })

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
