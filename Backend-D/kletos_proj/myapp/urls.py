# from django import views
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AuthStatusView, UserViewSet

router = DefaultRouter()

router.register(r'users', UserViewSet)

urlpatterns = [
    path('auth/status/', AuthStatusView.as_view(), name='auth_status'),
]

urlpatterns += router.urls
