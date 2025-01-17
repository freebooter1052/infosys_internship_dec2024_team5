from flask import Blueprint, request, jsonify, current_app
from app.models import db, Module, ModuleMaterial, Quiz, Course
from werkzeug.utils import secure_filename
import os
from datetime import datetime

module_blueprint = Blueprint('module', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@module_blueprint.route('/module/create', methods=['POST'])
def create_module():
    try:
        data = request.json

        # Create new module
        new_module = Module(
            course_id=data['courseId'],
            title=data['title'],
            learning_points=int(data['learningPoints']),
            course_introduction=data['courseIntroduction'],
            objectives=data['objectives'],
            learning_outcomes=data['learningOutcomes'],
            instructor_details=data['instructorDetails']
        )
        db.session.add(new_module)
        db.session.flush()  # Get the module ID without committing

        # Process materials
        for material in data['materials']:
            if material['type'] in ['video', 'reading']:
                new_material = ModuleMaterial(
                    module_id=new_module.id,
                    type=material['type'],
                    title=material['title'],
                    url=material.get('url', ''),
                    file_path=material.get('file', '')
                )
                db.session.add(new_material)
            
            elif material['type'] == 'quiz':
                for quiz_item in material['quiz']:
                    new_quiz = Quiz(
                        module_id=new_module.id,
                        question=quiz_item['question'],
                        options=quiz_item['options'],
                        correct_answer=quiz_item['correctAnswer']
                    )
                    db.session.add(new_quiz)

        db.session.commit()
        return jsonify({'message': 'Module created successfully', 'moduleId': new_module.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@module_blueprint.route('/module/<int:module_id>/material/upload', methods=['POST'])
def upload_material(module_id):
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_path = os.path.join(current_app.root_path, UPLOAD_FOLDER)
            if not os.path.exists(upload_path):
                os.makedirs(upload_path)
            
            file_path = os.path.join(upload_path, filename)
            file.save(file_path)
            
            return jsonify({
                'message': 'File uploaded successfully',
                'file_path': os.path.join(UPLOAD_FOLDER, filename)
            }), 200

        return jsonify({'error': 'File type not allowed'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@module_blueprint.route('/module/<int:module_id>', methods=['GET'])
def get_module(module_id):
    try:
        module = Module.query.get_or_404(module_id)
        materials = ModuleMaterial.query.filter_by(module_id=module_id).all()
        quizzes = Quiz.query.filter_by(module_id=module_id).all()

        return jsonify({
            'module': {
                'id': module.id,
                'title': module.title,
                'learning_points': module.learning_points,
                'course_introduction': module.course_introduction,
                'objectives': module.objectives,
                'learning_outcomes': module.learning_outcomes,
                'instructor_details': module.instructor_details,
                'materials': [{
                    'id': m.id,
                    'type': m.type,
                    'title': m.title,
                    'url': m.url,
                    'file_path': m.file_path
                } for m in materials],
                'quizzes': [{
                    'id': q.id,
                    'question': q.question,
                    'options': q.options,
                    'correct_answer': q.correct_answer
                } for q in quizzes]
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
