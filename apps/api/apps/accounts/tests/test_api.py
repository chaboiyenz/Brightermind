import pytest
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from apps.accounts.models import PsychologistProfile, Role, User


@pytest.fixture
def user(db) -> User:
    return User.objects.create_user(username="student1", password="correct-password")


@pytest.mark.django_db
def test_login_success_returns_token(user: User) -> None:
    response = APIClient().post(
        "/api/v2/auth/login/", {"username": "student1", "password": "correct-password"}
    )
    assert response.status_code == 200
    assert response.data["token"] == Token.objects.get(user=user).key
    assert response.data["user"]["role"] == "student"


@pytest.mark.django_db
def test_login_wrong_password_rejected(user: User) -> None:
    response = APIClient().post(
        "/api/v2/auth/login/", {"username": "student1", "password": "wrong"}
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_register_creates_student_and_returns_token() -> None:
    response = APIClient().post(
        "/api/v2/auth/register/",
        {
            "username": "newstudent",
            "first_name": "New",
            "last_name": "Student",
            "email": "new@example.com",
            "password1": "a-strong-passw0rd",
            "password2": "a-strong-passw0rd",
        },
    )
    assert response.status_code == 201
    assert response.data["user"]["role"] == "student"
    user = User.objects.get(username="newstudent")
    assert user.check_password("a-strong-passw0rd")


@pytest.mark.django_db
def test_register_password_mismatch_rejected() -> None:
    response = APIClient().post(
        "/api/v2/auth/register/",
        {
            "username": "newstudent",
            "first_name": "New",
            "last_name": "Student",
            "email": "new@example.com",
            "password1": "a-strong-passw0rd",
            "password2": "does-not-match",
        },
    )
    assert response.status_code == 400
    assert not User.objects.filter(username="newstudent").exists()


@pytest.mark.django_db
def test_register_weak_password_rejected() -> None:
    response = APIClient().post(
        "/api/v2/auth/register/",
        {
            "username": "newstudent",
            "first_name": "New",
            "last_name": "Student",
            "email": "new@example.com",
            "password1": "123",
            "password2": "123",
        },
    )
    assert response.status_code == 400
    assert not User.objects.filter(username="newstudent").exists()


@pytest.mark.django_db
def test_register_psychologist_creates_unapproved_profile() -> None:
    response = APIClient().post(
        "/api/v2/auth/register/psychologist/",
        {
            "username": "drstudent",
            "first_name": "Dr",
            "last_name": "Student",
            "email": "dr@example.com",
            "password1": "a-strong-passw0rd",
            "password2": "a-strong-passw0rd",
            "license_number": "LIC-123",
            "qualification": "PhD Psychology",
            "years_of_experience": 5,
            "area_of_expertise": "Anxiety",
            "contact_number": "555-0100",
        },
    )
    assert response.status_code == 201
    assert response.data["user"]["role"] == "psychologist"
    profile = PsychologistProfile.objects.get(user__username="drstudent")
    assert profile.is_approved is False
    assert profile.license_number == "LIC-123"


@pytest.mark.django_db
def test_me_returns_current_user(user: User) -> None:
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get("/api/v2/auth/me/")
    assert response.status_code == 200
    assert response.data["username"] == "student1"
    assert response.data["role"] == "student"


@pytest.mark.django_db
def test_me_requires_authentication() -> None:
    response = APIClient().get("/api/v2/auth/me/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_registered_user_can_immediately_use_returned_token() -> None:
    register_response = APIClient().post(
        "/api/v2/auth/register/",
        {
            "username": "freshuser",
            "first_name": "Fresh",
            "last_name": "User",
            "email": "fresh@example.com",
            "password1": "a-strong-passw0rd",
            "password2": "a-strong-passw0rd",
        },
    )
    token = register_response.data["token"]

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    me_response = client.get("/api/v2/auth/me/")
    assert me_response.status_code == 200
    assert me_response.data["username"] == "freshuser"

    role_check = Role(me_response.data["role"])
    assert role_check == Role.STUDENT
