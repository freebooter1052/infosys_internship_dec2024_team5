import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp(email, otp):
    message = MIMEMultipart()
    message["From"] = 'test9125978@gmail.com'
    message["To"] = email
    message["Subject"] = "Password Reset OTP"

    body = f"Your OTP for password reset is: {otp}"
    message.attach(MIMEText(body, "plain"))

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    sender_email = 'test9125978@gmail.com'
    sender_password = 'obos bipa kdfp svsd'

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending OTP: {e}")
        return False
