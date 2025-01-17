from flask import Blueprint, request, jsonify
from app import db
from app.models import AuditTrail
from datetime import datetime, timedelta
from app.utils import retry_on_db_lock
import logging

audit_blueprint = Blueprint('audit', __name__)

def convert_to_ist(utc_timestamp):
    ist_offset = timedelta(hours=5, minutes=30)
    return utc_timestamp + ist_offset

@audit_blueprint.route('/audit-trail', methods=['GET'])
@retry_on_db_lock()
def get_audit_trail():
    try:
        audit_trail = AuditTrail.query.all()
        audit_list = [{
            'id': entry.id,
            'action': entry.action,
            'timestamp': convert_to_ist(entry.timestamp).strftime('%Y-%m-%d %H:%M:%S')  # Convert to IST
        } for entry in audit_trail]
        response = jsonify(audit_list)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200
    except Exception as e:
        logging.error(f"Error fetching audit trail: {e}")
        return jsonify({'error': 'Failed to fetch audit trail'}), 500

@audit_blueprint.route('/audit-trail', methods=['POST'])
@retry_on_db_lock()
def log_audit():
    try:
        data = request.get_json()
        timestamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
        ist_timestamp = convert_to_ist(timestamp)  # Convert to IST
        new_entry = AuditTrail(
            action=data['action'],
            timestamp=ist_timestamp
        )
        db.session.add(new_entry)
        db.session.commit()
        response = jsonify({'message': 'Audit entry logged successfully'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error logging audit entry: {e}")
        return jsonify({'error': 'Failed to log audit entry'}), 500
