from app import db
from flask import current_app
import sqlite3

def add_completed_at_column():
    try:
        with current_app.app_context():
            # Connect to SQLite database
            conn = sqlite3.connect('instance/managers.db')
            cursor = conn.cursor()
            
            # Add completed_at column to module table
            cursor.execute('''
                ALTER TABLE module 
                ADD COLUMN completed_at DATETIME
            ''')
            
            conn.commit()
            conn.close()
            print("Successfully added completed_at column to module table")
            
    except Exception as e:
        print(f"Error adding column: {str(e)}")
        if 'conn' in locals():
            conn.close()
