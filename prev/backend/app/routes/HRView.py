from flask import Blueprint, jsonify
from app.models import db, Course, Enrollment, Module, Quiz, module_completion
from sqlalchemy import func, case, distinct, alias
from flask_cors import CORS

hr_view_blueprint = Blueprint('hr_view', __name__)
CORS(hr_view_blueprint, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@hr_view_blueprint.route('/hr-view/stats', methods=['GET'])
def get_hr_stats():
    try:
        # Create alias for Module table
        ModuleAlias = alias(Module)
        module_alias = ModuleAlias.alias()

        # Updated query with proper table aliases
        enrollments = db.session.query(
            Enrollment.id,
            func.count(module_completion.c.module_id).label('completed'),
            func.count(distinct(module_alias.c.id)).label('total')
        ).join(
            Course, Course.id == Enrollment.course_id
        ).outerjoin(
            module_alias, module_alias.c.course_id == Course.id
        ).outerjoin(
            module_completion,
            db.and_(
                module_completion.c.enrollment_id == Enrollment.id,
                module_completion.c.module_id == module_alias.c.id
            )
        ).group_by(
            Enrollment.id
        ).all()

        # Calculate average completion rate
        total_completion = 0
        valid_enrollments = 0
        for _, completed, total in enrollments:
            if total > 0:
                total_completion += (completed * 100.0 / total)
                valid_enrollments += 1

        avg_completion = total_completion / valid_enrollments if valid_enrollments > 0 else 0

        # Updated top performer query
        top_performer = db.session.query(
            Enrollment.user_name,
            func.count(module_completion.c.module_id).label('modules_completed')
        ).join(
            module_completion,
            module_completion.c.enrollment_id == Enrollment.id
        ).group_by(
            Enrollment.user_name
        ).order_by(
            func.count(module_completion.c.module_id).desc()
        ).first()

        # Updated needs training query with proper join
        needs_training = db.session.query(
            Enrollment.user_name
        ).outerjoin(
            module_completion,
            module_completion.c.enrollment_id == Enrollment.id
        ).group_by(
            Enrollment.user_name
        ).having(
            func.count(module_completion.c.module_id) == 0
        ).all()

        return jsonify({
            'overall_completion_rate': round(float(avg_completion), 2),
            'top_performer': top_performer[0] if top_performer else None,
            'needs_training': [user[0] for user in needs_training] if needs_training else []
        })

    except Exception as e:
        print(f"Error in get_hr_stats: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@hr_view_blueprint.route('/hr-view/employees', methods=['GET'])
def get_employee_data():
    try:
        # Modified query to use func.count instead of distinct
        results = db.session.query(
            Enrollment.id,
            Enrollment.user_name,
            Course.title,
            func.count(module_completion.c.module_id).label('completed_modules'),
            func.count(Module.id).label('total_modules')
        ).join(
            Course, Enrollment.course_id == Course.id
        ).outerjoin(
            Module, Module.course_id == Course.id
        ).outerjoin(
            module_completion,
            db.and_(
                module_completion.c.enrollment_id == Enrollment.id,
                module_completion.c.module_id == Module.id
            )
        ).group_by(
            Enrollment.id,
            Course.id
        ).all()

        response_data = []
        for id, name, course, completed, total in results:
            completion_percentage = (completed / total * 100) if total > 0 else 0
            
            response_data.append({
                'id': id,
                'name': name,
                'team': 'Team A',
                'manager': 'Manager 1',
                'course': course,
                'completion': round(completion_percentage, 2),
                'quizScore': 0,  # You might want to add actual quiz score calculation
                'status': 'Completed' if completion_percentage == 100 else 'Active'
            })

        return jsonify(response_data)

    except Exception as e:
        print(f"Error in get_employee_data: {str(e)}")  # Add logging
        return jsonify({'error': str(e)}), 500 
