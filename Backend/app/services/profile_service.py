from app.models import User, db

def get_user_profile(user_id):
    return User.query.get(user_id)

def update_user_profile(user_id, full_name, email):
    user = User.query.get(user_id)
    if user:
        user.full_name = full_name
        user.email = email
        db.session.commit()
        return user
    return None

def change_user_password(user_id, old_password, new_password):
    user = User.query.get(user_id)
    if user and user.check_password(old_password):
        user.set_password(new_password)
        db.session.commit()
        return user
    return None
