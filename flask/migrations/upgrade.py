import sys
import os
from sqlalchemy import text

# Ensure the app module is in the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db

def upgrade():
    app = create_app()
    with app.app_context():
        with db.engine.connect() as connection:
            connection.execute(text('ALTER TABLE manager ADD COLUMN status VARCHAR(20) DEFAULT "pending"'))
            connection.execute(text('ALTER TABLE course ADD COLUMN instructor VARCHAR(100) NOT NULL'))  # Add instructor column

if __name__ == "__main__":
    upgrade()
