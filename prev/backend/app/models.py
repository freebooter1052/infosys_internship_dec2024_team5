from app import db

class Manager(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # Add status field

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    instructor = db.Column(db.String(100), nullable=False)  # Add instructor field

class AuditTrail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

# Add new association table for module completion tracking
module_completion = db.Table('module_completion',
    db.Column('module_id', db.Integer, db.ForeignKey('module.id'), primary_key=True),
    db.Column('enrollment_id', db.Integer, db.ForeignKey('enrollment.id'), primary_key=True),
    db.Column('completed_at', db.DateTime, default=db.func.current_timestamp())
)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    user_name = db.Column(db.String(120), nullable=False)
    completed_modules = db.relationship('Module', 
                                      secondary=module_completion,
                                      lazy='dynamic')

class Userstatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, nullable=False)
    user_email = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Enrollment {self.user_email} - {self.course_id}>'

class Module(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    learning_points = db.Column(db.Integer, nullable=False)
    course_introduction = db.Column(db.Text, nullable=False)
    objectives = db.Column(db.Text, nullable=False)
    learning_outcomes = db.Column(db.Text, nullable=False)
    instructor_details = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    materials = db.relationship('ModuleMaterial', backref='module', lazy=True)
    quizzes = db.relationship('Quiz', backref='module', lazy=True)
    completion_status = db.Column(db.String(20), nullable=False, default='not started')  # Add completion status
    completed_at = db.Column(db.DateTime)  # Add completed_at field
    completed_by = db.relationship('Enrollment',
                                 secondary=module_completion,
                                 lazy='dynamic')

class ModuleMaterial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'video' or 'reading'
    title = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(255))  # for video materials
    file_path = db.Column(db.String(255))  # for reading materials
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # Store options as JSON array
    correct_answer = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
