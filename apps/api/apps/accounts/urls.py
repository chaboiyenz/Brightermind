from django.urls import path

from . import views

urlpatterns = [
    path("auth/login/", views.login, name="login"),
    path("auth/register/", views.register, name="register"),
    path("auth/register/psychologist/", views.register_psychologist, name="register-psychologist"),
    path("auth/me/", views.me, name="me"),
]
