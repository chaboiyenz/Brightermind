import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.journal.models import JournalEntry


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
def test_create_entry(client: APIClient, user: User) -> None:
    response = client.post(
        "/api/v2/journal-entries/", {"title": "Today", "content": "It was fine."}
    )
    assert response.status_code == 201
    assert response.data["title"] == "Today"
    assert JournalEntry.objects.get(user=user).content == "It was fine."


@pytest.mark.django_db
def test_list_entries(client: APIClient, user: User) -> None:
    JournalEntry.objects.create(user=user, title="A", content="a")
    JournalEntry.objects.create(user=user, title="B", content="b")

    response = client.get("/api/v2/journal-entries/")
    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_update_entry_returns_full_content(client: APIClient, user: User) -> None:
    entry = JournalEntry.objects.create(user=user, title="Draft", content="Original")

    response = client.patch(
        f"/api/v2/journal-entries/{entry.id}/", {"content": "Updated"}, format="json"
    )
    assert response.status_code == 200
    assert response.data["title"] == "Draft"
    assert response.data["content"] == "Updated"


@pytest.mark.django_db
def test_delete_entry(client: APIClient, user: User) -> None:
    entry = JournalEntry.objects.create(user=user, title="Gone soon", content="x")

    response = client.delete(f"/api/v2/journal-entries/{entry.id}/")
    assert response.status_code == 204
    assert not JournalEntry.objects.filter(id=entry.id).exists()


@pytest.mark.django_db
def test_user_cannot_access_another_users_entry(
    client: APIClient, user: User, other_user: User
) -> None:
    other_entry = JournalEntry.objects.create(user=other_user, title="Private", content="x")

    get_response = client.get(f"/api/v2/journal-entries/{other_entry.id}/")
    assert get_response.status_code == 404

    delete_response = client.delete(f"/api/v2/journal-entries/{other_entry.id}/")
    assert delete_response.status_code == 404
    assert JournalEntry.objects.filter(id=other_entry.id).exists()


@pytest.mark.django_db
def test_unauthenticated_request_rejected() -> None:
    response = APIClient().get("/api/v2/journal-entries/")
    # 401, not 403 — Phase 3 switched DEFAULT_AUTHENTICATION_CLASSES to
    # TokenAuthentication only (see config/settings/base.py), which sets a
    # WWW-Authenticate header, so DRF returns 401 instead of session auth's
    # 403 fallback.
    assert response.status_code == 401
