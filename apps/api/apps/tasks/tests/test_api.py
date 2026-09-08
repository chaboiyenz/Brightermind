import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.tasks.models import Task


@pytest.fixture
def user(db) -> User:
    return User.objects.create_user(username="student1", password="pw")


@pytest.fixture
def other_user(db) -> User:
    return User.objects.create_user(username="student2", password="pw")


@pytest.fixture
def client(user: User) -> APIClient:
    api_client = APIClient()
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_create_task(client: APIClient, user: User) -> None:
    response = client.post("/api/v2/tasks/", {"title": "Buy milk", "category": "shopping"})
    assert response.status_code == 201
    assert response.data["is_completed"] is False
    assert response.data["score"] == 0
    assert Task.objects.get(user=user).title == "Buy milk"


@pytest.mark.django_db
def test_toggle_increments_score_on_complete(client: APIClient, user: User) -> None:
    task = Task.objects.create(user=user, title="Read")

    response = client.patch(f"/api/v2/tasks/{task.id}/toggle/")
    assert response.status_code == 200
    assert response.data["is_completed"] is True
    assert response.data["score"] == 1


@pytest.mark.django_db
def test_toggle_decrements_score_on_uncomplete_and_floors_at_zero(
    client: APIClient, user: User
) -> None:
    task = Task.objects.create(user=user, title="Read", is_completed=True, score=0)

    response = client.patch(f"/api/v2/tasks/{task.id}/toggle/")
    assert response.status_code == 200
    assert response.data["is_completed"] is False
    assert response.data["score"] == 0  # floored at 0, never negative


@pytest.mark.django_db
def test_toggle_is_not_reachable_via_direct_field_write(client: APIClient, user: User) -> None:
    task = Task.objects.create(user=user, title="Read")

    response = client.patch(f"/api/v2/tasks/{task.id}/", {"is_completed": True}, format="json")
    assert response.status_code == 200
    task.refresh_from_db()
    assert task.is_completed is False  # read_only_fields — direct PATCH can't set it


@pytest.mark.django_db
def test_delete_task(client: APIClient, user: User) -> None:
    task = Task.objects.create(user=user, title="Old")
    response = client.delete(f"/api/v2/tasks/{task.id}/")
    assert response.status_code == 204
    assert not Task.objects.filter(id=task.id).exists()


@pytest.mark.django_db
def test_user_cannot_toggle_another_users_task(
    client: APIClient, user: User, other_user: User
) -> None:
    other_task = Task.objects.create(user=other_user, title="Not yours")

    response = client.patch(f"/api/v2/tasks/{other_task.id}/toggle/")
    assert response.status_code == 404
    other_task.refresh_from_db()
    assert other_task.is_completed is False


@pytest.mark.django_db
def test_unauthenticated_request_rejected() -> None:
    response = APIClient().get("/api/v2/tasks/")
    assert response.status_code == 403
