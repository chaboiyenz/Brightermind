from django.urls import path

from .views import dev_login

urlpatterns = [
    # TEMPORARY — see the docstring on dev_login. Remove with Phase 3.
    path("auth/dev-login/", dev_login, name="dev-login"),
]
