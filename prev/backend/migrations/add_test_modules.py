from app import db
from app.models import Module, Enrollment
from datetime import datetime

def add_test_modules():
    try:
        # Add some test completed modules
        modules = Module.query.all()
        for module in modules[:2]:  # Mark first two modules as completed
            module.completion_status = 'Completed'
            module.completed_at = datetime.utcnow()
        
        db.session.commit()
        print(f"Added {len(modules[:2])} test completed modules")
        
        # Verify the updates
        completed_modules = Module.query.filter_by(completion_status='Completed').all()
        print(f"Total completed modules: {len(completed_modules)}")
        for module in completed_modules:
            print(f"Module: {module.title}, Status: {module.completion_status}, Completed at: {module.completed_at}")
            
    except Exception as e:
        print(f"Error adding test data: {str(e)}")
        db.session.rollback()
