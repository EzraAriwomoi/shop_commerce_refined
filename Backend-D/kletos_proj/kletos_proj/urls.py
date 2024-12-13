from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import include, path
from myapp import views

router = DefaultRouter()

router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myapp.urls')),
]
