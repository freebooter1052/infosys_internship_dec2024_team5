from app import db
from flask import current_app
import sqlite3

def create_module_completion_table():
    try:
        with current_app.app_context():
            conn = sqlite3.connect('instance/managers.db')
            cursor = conn.cursor()
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS module_completion (
                    module_id INTEGER NOT NULL,
                    enrollment_id INTEGER NOT NULL,
                    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (module_id, enrollment_id),
                    FOREIGN KEY (module_id) REFERENCES module (id),
                    FOREIGN KEY (enrollment_id) REFERENCES enrollment (id)
                )
            ''')
            
            conn.commit()
            conn.close()
            print("Successfully created module_completion table")
            
    except Exception as e:
        print(f"Error creating table: {str(e)}")
        if 'conn' in locals():
            conn.close()
