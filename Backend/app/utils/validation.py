import re

def validate_signup(data):
    errors = []
    if not data.get('full_name'):
        errors.append('Full name is required.')
    if not data.get('email'):
        errors.append('Email is required.')
    if not data.get('password'):
        errors.append('Password is required.')
    if data.get('password') != data.get('confirm_password'):
        errors.append('Passwords do not match.')
    if data.get('email') and not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        errors.append('Invalid email format.')
    return errors

def validate_signin(data):
    errors = []
    if not data.get('email'):
        errors.append('Email is required.')
    if not data.get('password'):
        errors.append('Password is required.')
    if data.get('email') and not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
        errors.append('Invalid email format.')
    return errors

def validate_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def validate_password(password):
    return len(password) >= 6