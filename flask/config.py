class Config:
    SECRET_KEY = 'your_secret_key'  # Replace with a strong, unique key
    SQLALCHEMY_DATABASE_URI = 'sqlite:///managers.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.example.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'your-email@example.com'
    MAIL_PASSWORD = 'your-email-password'
