from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Manager

app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app)

# Configuring the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///managers.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable unnecessary tracking

# Initialize the database
db.init_app(app)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json  # Get JSON data from the frontend
    print(request.json)  # To ensure data is received

    # Validate incoming data
    required_fields = ["firstName", "lastName", "email", "password", "confirmPassword", "role"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    # Check if passwords match
    if data['password'] != data['confirmPassword']:
        return jsonify({"error": "Passwords do not match"}), 400

    # Check if email already exists
    existing_manager = Manager.query.filter_by(email=data['email']).first()
    if existing_manager:
        return jsonify({"error": "Email already registered"}), 400

    # Create a new manager instance and save to database
    new_manager = Manager(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=data['password'],  # In a real app, you'd hash the password!
        role=data['role']
    )

    db.session.add(new_manager)
    db.session.commit()

    return jsonify({"message": "Manager registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json  # Get JSON data from the frontend

    # Validate incoming data
    required_fields = ["email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Email and password are required"}), 400

    # Check if the user exists and the password is correct
    manager = Manager.query.filter_by(email=data['email']).first()
    if not manager or manager.password != data['password']:  # In a real app, you'd hash and verify the password!
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful"}), 200

if __name__ == "__main__":
    app.run(debug=True)
