import pytest
from rest_framework.test import APIRequestFactory

from apps.accounts.models import Role, User
from apps.core.permissions import IsAdmin, IsPsychologist, IsStudent

factory = APIRequestFactory()


def _request_as(user):
    request = factory.get("/")
    request.user = user
    return request


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("permission_class", "role", "should_pass"),
    [
        (IsStudent, Role.STUDENT, True),
        (IsStudent, Role.PSYCHOLOGIST, False),
        (IsStudent, Role.ADMIN, False),
        (IsPsychologist, Role.PSYCHOLOGIST, True),
        (IsPsychologist, Role.STUDENT, False),
        (IsAdmin, Role.ADMIN, True),
        (IsAdmin, Role.STUDENT, False),
    ],
)
def test_role_permission(permission_class, role, should_pass) -> None:
    user = User.objects.create_user(username=f"user-{role}", password="pw", role=role)
    request = _request_as(user)
    assert permission_class().has_permission(request, None) is should_pass


@pytest.mark.django_db
def test_anonymous_user_rejected_by_every_role_permission() -> None:
    from django.contrib.auth.models import AnonymousUser

    request = _request_as(AnonymousUser())
    for permission_class in (IsStudent, IsPsychologist, IsAdmin):
        assert permission_class().has_permission(request, None) is False
