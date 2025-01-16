import logging
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from app.models import Course, Enrollment, Userstatus, Module, Quiz, db  # Add Quiz to imports
from datetime import datetime

insights_blueprint = Blueprint('insights', __name__)
CORS(insights_blueprint, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

@insights_blueprint.route('/course/<int:course_id>/introduction', methods=['GET'])
def course_introduction(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    introduction = {
        'title': course.title,
        'description': course.description,
        'instructor': course.instructor,
        # 'objectives': 'Course objectives here',  # Placeholder
        # 'learning_outcomes': 'Learning outcomes here'  # Placeholder
    }
    return jsonify(introduction)

@insights_blueprint.route('/course/<int:course_id>/duration', methods=['GET'])
def course_duration(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    duration = {
        'start_date': course.start_date,
        'end_date': course.end_date,
        'total_duration': (course.end_date - course.start_date).days
    }
    return jsonify(duration)

@insights_blueprint.route('/course/<int:course_id>/modules', methods=['GET'])
def course_modules(course_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        modules = Module.query.filter_by(course_id=course_id).all()
        module_list = []
        for module in modules:
            try:
                # Fetch quizzes for this module
                quizzes = Quiz.query.filter_by(module_id=module.id).all()
                quiz_list = [{
                    'id': quiz.id,
                    'title': f'Quiz {idx + 1}',
                    'status': 'Not Started'
                } for idx, quiz in enumerate(quizzes)]

                module_data = {
                    'id': module.id,
                    'title': module.title,
                    'learning_points': module.learning_points,
                    'completion_status': module.completion_status,
                    'quizzes': quiz_list
                }

                # Only add completed_at if it exists
                if hasattr(module, 'completed_at'):
                    module_data['completed_at'] = module.completed_at.isoformat() if module.completed_at else None

                module_list.append(module_data)
            except Exception as module_error:
                logging.error(f"Error processing module {module.id}: {str(module_error)}")
                continue

        return jsonify(module_list)
    except Exception as e:
        logging.error(f"Error fetching modules for course {course_id}: {e}")
        return jsonify({'error': str(e)}), 500

@insights_blueprint.route('/course/<int:course_id>/module/<int:module_id>/complete', methods=['POST', 'OPTIONS'])
def complete_module(course_id, module_id):
    if request.method == 'OPTIONS':
        return handle_options_request()

    try:
        module = Module.query.get(module_id)
        if not module:
            return jsonify({'error': 'Module not found'}), 404

        # Update module status and completion time
        module.completion_status = 'Completed'
        module.completed_at = datetime.utcnow()
        
        # Get current user's enrollment
        enrollment = Enrollment.query.filter_by(
            course_id=course_id,
            user_email=request.headers.get('User-Email')
        ).first()
        
        if enrollment:
            # Add completion record to module_completion table
            if module not in enrollment.completed_modules:
                enrollment.completed_modules.append(module)

        db.session.commit()

        return jsonify({
            'message': 'Module marked as completed',
            'module_id': module_id,
            'completion_status': 'Completed',
            'completed_at': module.completed_at.isoformat()
        })

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating module completion: {str(e)}")
        return jsonify({'error': str(e)}), 500

@insights_blueprint.route('/course/<int:course_id>/module/<int:module_id>/quiz', methods=['GET'])
def get_module_quiz(course_id, module_id):
    try:
        quizzes = Quiz.query.filter_by(module_id=module_id).all()
        if not quizzes:
            return jsonify({'error': 'No quiz found for this module'}), 404

        quiz_data = [{
            'id': quiz.id,
            'question': quiz.question,
            'options': quiz.options
        } for quiz in quizzes]
        
        return jsonify(quiz_data)
    except Exception as e:
        logging.error(f"Error fetching quiz for module {module_id}: {e}")
        return jsonify({'error': str(e)}), 500

@insights_blueprint.route('/course/<int:course_id>/module/<int:module_id>/quiz/submit', methods=['POST'])
def submit_quiz_attempt(course_id, module_id):
    try:
        data = request.get_json()
        user_answers = data.get('answers', {})
        
        quizzes = Quiz.query.filter_by(module_id=module_id).all()
        total_questions = len(quizzes)
        correct_answers = 0

        for quiz in quizzes:
            if str(quiz.id) in user_answers and user_answers[str(quiz.id)] == quiz.correct_answer:
                correct_answers += 1

        score = (correct_answers / total_questions) * 100
        status = 'pass' if score >= 70 else 'fail'  # 70% passing threshold

        return jsonify({
            'score': score,
            'status': status,
            'correct_answers': correct_answers,
            'total_questions': total_questions
        })

    except Exception as e:
        logging.error(f"Error processing quiz submission: {e}")
        return jsonify({'error': str(e)}), 500

# @insights_blueprint.route('/course/<int:course_id>/quizzes', methods=['GET'])
# def course_quizzes(course_id):
#     # Placeholder for actual quiz data
#     quizzes = [
#         {'title': 'Quiz 1', 'pass_fail_status': 'pass', 'score': 85},
#         {'title': 'Quiz 2', 'pass_fail_status': 'fail', 'score': 45}
#     ]
#     return jsonify(quizzes)

@insights_blueprint.route('/course/<int:course_id>/progress', methods=['GET'])
def course_progress(course_id):
    try:
        modules = Module.query.filter_by(course_id=course_id).all()
        total_modules = len(modules)
        completed_modules = len([m for m in modules if m.completion_status == 'Completed'])
        
        module_progress = []
        for module in modules:
            # Fetch quizzes and their results for this module
            quizzes = Quiz.query.filter_by(module_id=module.id).all()
            quiz_results = []
            for quiz in quizzes:
                # You might want to fetch actual quiz attempts from a QuizAttempt model
                # This is a simplified version
                quiz_results.append({
                    'quiz_title': f'Quiz {quiz.id}',
                    'score': None,  # Will be updated when quiz is completed
                    'status': 'Not Started'
                })

            module_progress.append({
                'module': module.title,
                'status': module.completion_status,
                'quiz_results': quiz_results
            })
        
        progress = {
            'course_progress': round((completed_modules / total_modules * 100) if total_modules > 0 else 0, 2),
            'completed_modules': completed_modules,
            'total_modules': total_modules,
            'module_progress': module_progress
        }
        return jsonify(progress)
    except Exception as e:
        logging.error(f"Error calculating progress for course {course_id}: {e}")
        return jsonify({'error': str(e)}), 500

@insights_blueprint.route('/course/<int:course_id>/performance', methods=['GET'])
def course_performance(course_id):
    # Placeholder for actual performance data
    performance = {
        'strengths': 'Strengths here',  # Placeholder
        'areas_of_improvement': 'Areas of improvement here'  # Placeholder
    }
    return jsonify(performance)

@insights_blueprint.route('/course/<int:course_id>/user_performance', methods=['GET'])
def user_performance(course_id):
    try:
        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        enrollments = Enrollment.query.filter_by(course_id=course_id).all()
        if not enrollments:
            return jsonify([])  # Return empty array if no enrollments

        performance_data = []

        for enrollment in enrollments:
            try:
                user_email = enrollment.user_email
                user_name = enrollment.user_name

                modules = Module.query.filter_by(course_id=course_id).all()
                progress = (len([module for module in modules if module.completion_status == 'Completed']) / len(modules)) * 100 if modules else 0

                performance_data.append({
                    'name': user_name,
                    'email': user_email,
                    'progress': round(progress, 2),
                    'modules': [
                        {
                            'title': module.title,
                            'completedAt': module.completed_at.isoformat() if module.completed_at else None
                        } 
                        for module in modules
                    ] if modules else []
                })
            except Exception as e:
                logging.error(f"Error processing enrollment {enrollment.id}: {str(e)}")
                continue

        return jsonify(performance_data)
    except Exception as e:
        logging.error(f"Error fetching performance data for course {course_id}: {str(e)}")
        return jsonify([]), 500  # Return empty array on error
