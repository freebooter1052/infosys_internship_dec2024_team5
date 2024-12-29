from flask import Blueprint, request, jsonify
from app import db
from app.models import AuditTrail
from datetime import datetime
import logging

audit_blueprint = Blueprint('audit', __name__)

@audit_blueprint.route('/audit-trail', methods=['GET'])
def get_audit_trail():
    try:
        audit_trail = AuditTrail.query.all()
        audit_list = [{
            'id': entry.id,
            'action': entry.action,
            'timestamp': entry.timestamp
        } for entry in audit_trail]
        response = jsonify(audit_list)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200
    except Exception as e:
        logging.error(f"Error fetching audit trail: {e}")
        return jsonify({'error': 'Failed to fetch audit trail'}), 500

@audit_blueprint.route('/audit-trail', methods=['POST'])
def log_audit():
    try:
        data = request.get_json()
        timestamp = datetime.fromisoformat(data['timestamp'].replace('Z', '+00:00'))
        new_entry = AuditTrail(
            action=data['action'],
            timestamp=timestamp
        )
        db.session.add(new_entry)
        db.session.commit()
        response = jsonify({'message': 'Audit entry logged successfully'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 201
    except Exception as e:
        logging.error(f"Error logging audit entry: {e}")
        return jsonify({'error': 'Failed to log audit entry'}), 500
