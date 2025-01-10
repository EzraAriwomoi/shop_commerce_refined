from flask import url_for
from flask_mail import Message
from app.extensions import mail

def send_password_reset_email(user_email, token):
    # Construct the frontend URL for password reset
    reset_url = f"http://localhost:3000/password-reset?token={token}"
    
    # Create the email message
    msg = Message('Password Reset Request', sender='noreply@example.com', recipients=[user_email])
    msg.body = f'To reset your password, visit the following link:\n{reset_url}'
    
    try:
        # Send the email
        mail.send(msg)
        print(f'Password reset email sent to {user_email} with token: {token}')
    except Exception as e:
        print(f'Failed to send password reset email: {str(e)}')
        
def send_login_alert_email(user_email, token):
    block_url = url_for('auth.block_account', token=token, _external=True)
    msg = Message('Login Alert', sender='noreply@example.com', recipients=[user_email])
    msg.body = f'Your account was logged in. If it was not you, click the link to block the account:\n {block_url}'
    try:
        mail.send(msg)
        print(f'Login alert email sent to {user_email}')
    except Exception as e:
        print(f'Failed to send login alert email: {str(e)}')


def send_email(subject, recipients, body_template, **kwargs):
    msg = Message(subject, sender='noreply@example.com', recipients=recipients)
    msg.body = body_template
    try:
        mail.send(msg)
        print(f'Email sent to {recipients} with subject: {subject}')
    except Exception as e:
        print(f'Failed to send email: {str(e)}')

# def send_email(subject, recipients, template, **kwargs):
#     msg = Message(subject, recipients=recipients)
#     msg.body = template
#     mail.send(msg)

