from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend

class EmailAuthBackend(ModelBackend):
    """
    Authenticate using email and password instead of username and password.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            # Fetch the user by email
            user = User.objects.get(email=email)
            # Check if the password matches
            if user.check_password(password):
                return user  # Return the user if authentication is successful
        except User.DoesNotExist:
            return None  # Return None if no user is found with the given email
