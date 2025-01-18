import smtplib
from email.mime.text import MIMEText
import time
from functools import wraps
from sqlalchemy.exc import OperationalError, PendingRollbackError
import logging
from app import db

def send_otp(email, otp):
    msg = MIMEText(f"Your OTP for password reset is: {otp}")
    msg['Subject'] = 'Password Reset OTP'
    msg['From'] = 'your-email@gmail.com'
    msg['To'] = email

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    sender_email = 'test9125978@gmail.com'
    sender_password = 'obos bipa kdfp svsd'

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
        print("OTP sent successfully!")
    except Exception as e:
        print(f"Error sending OTP: {e}")

def retry_on_db_lock(retries=5, delay=0.1):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            for _ in range(retries):
                try:
                    return f(*args, **kwargs)
                except Exception as e:
                    if 'database is locked' in str(e):
                        time.sleep(delay)
                    else:
                        raise
            return f(*args, **kwargs)
        return decorated_function
    return decorator
