import logging
from flask import Blueprint, jsonify, request
from flask_cors import CORS
from app.models import Course, Enrollment, Module, Quiz, db
from sqlalchemy import func

individual_progress_blueprint = Blueprint('individual_progress', __name__)
CORS(individual_progress_blueprint)

@individual_progress_blueprint.route('/user/overall-progress', methods=['GET'])
def get_overall_progress():
    try:
        user_email = request.headers.get('User-Email')
        logging.info(f"Fetching progress for user: {user_email}")
        
        if not user_email:
            logging.error("No user email provided in headers")
            return jsonify({'error': 'User email not provided'}), 400

        # Get all enrollments for the user
        enrollments = Enrollment.query.filter_by(user_email=user_email).all()
        logging.info(f"Found {len(enrollments)} enrollments for user")
        
        if not enrollments:
            logging.info(f"No enrollments found for user {user_email}")
            return jsonify({
                'courses': [],
                'completedCourses': 0,
                'inProgressCourses': 0
            })

        courses_data = []
        completed_courses = 0
        in_progress_courses = 0

        for enrollment in enrollments:
            try:
                course = Course.query.get(enrollment.course_id)
                if not course:
                    logging.warning(f"Course not found for id: {enrollment.course_id}")
                    continue

                # Calculate completion percentage
                total_modules = Module.query.filter_by(course_id=course.id).count()
                if total_modules == 0:
                    logging.warning(f"No modules found for course: {course.id}")
                    continue

                completed_modules = Module.query.filter_by(
                    course_id=course.id,
                    completion_status='Completed'
                ).count()
                
                completion_percentage = (completed_modules / total_modules * 100) if total_modules > 0 else 0

                # Calculate performance metrics safely
                try:
                    quizzes = Quiz.query.join(Module).filter(Module.course_id == course.id).all()
                    quiz_scores = [quiz.highest_score for quiz in quizzes if quiz.highest_score is not None]
                    avg_quiz_score = sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0
                except Exception as quiz_error:
                    logging.error(f"Error calculating quiz scores: {str(quiz_error)}")
                    avg_quiz_score = 0

                # Determine course status
                status = 'Completed' if completion_percentage == 100 else 'Active'
                if status == 'Completed':
                    completed_courses += 1
                else:
                    in_progress_courses += 1

                # Get learning points safely
                try:
                    learning_points = db.session.query(func.sum(Module.learning_points))\
                        .filter(Module.course_id == course.id)\
                        .scalar() or 0
                except Exception as lp_error:
                    logging.error(f"Error calculating learning points: {str(lp_error)}")
                    learning_points = 0

                course_data = {
                    'id': course.id,
                    'name': course.title,
                    'status': status,
                    'completionPercentage': round(completion_percentage, 2),
                    'performanceScore': round(avg_quiz_score, 2),
                    'milestones': completed_modules,
                    'learningPoints': learning_points,
                    'quizScore': round(avg_quiz_score, 2)
                }
                courses_data.append(course_data)
                
            except Exception as course_error:
                logging.error(f"Error processing course {enrollment.course_id}: {str(course_error)}")
                continue

        return jsonify({
            'courses': courses_data,
            'completedCourses': completed_courses,
            'inProgressCourses': in_progress_courses
        })

    except Exception as e:
        logging.error(f"Global error in get_overall_progress: {str(e)}")
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500
