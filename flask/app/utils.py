import smtplib
from email.mime.text import MIMEText

def send_otp(email, otp):
    msg = MIMEText(f"Your OTP for password reset is: {otp}")
    msg['Subject'] = 'Password Reset OTP'
    msg['From'] = 'your-email@gmail.com'
    msg['To'] = email

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    sender_email = 'test9125978@gmail.com'
    sender_password = 'odmb qngn hcpq ajqa'

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, msg.as_string())
        print("OTP sent successfully!")
    except Exception as e:
        print(f"Error sending OTP: {e}")
