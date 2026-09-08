import pytest
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.mood_tracker.models import MoodEntry


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
def test_create_mood_entry(client: APIClient, user: User) -> None:
    response = client.post(
        "/api/v2/mood-entries/",
        {"date": "2026-01-15", "mood": "happy", "note": "Good day"},
    )

    assert response.status_code == 201
    assert response.data["mood"] == "happy"
    assert response.data["note"] == "Good day"
    assert MoodEntry.objects.get(user=user).date.isoformat() == "2026-01-15"


@pytest.mark.django_db
def test_list_entries_scoped_to_month(client: APIClient, user: User) -> None:
    MoodEntry.objects.create(user=user, date="2026-01-05", mood="happy")
    MoodEntry.objects.create(user=user, date="2026-01-20", mood="sad")
    MoodEntry.objects.create(user=user, date="2026-02-01", mood="neutral")

    response = client.get("/api/v2/mood-entries/?month=2026-01")

    assert response.status_code == 200
    dates = {entry["date"] for entry in response.data}
    assert dates == {"2026-01-05", "2026-01-20"}


@pytest.mark.django_db
def test_duplicate_day_returns_409(client: APIClient, user: User) -> None:
    MoodEntry.objects.create(user=user, date="2026-01-15", mood="happy")

    response = client.post(
        "/api/v2/mood-entries/",
        {"date": "2026-01-15", "mood": "sad"},
    )

    assert response.status_code == 409
    assert "already logged" in str(response.data).lower()
    # Confirm the duplicate was never written — only the original entry exists.
    assert MoodEntry.objects.filter(user=user, date="2026-01-15").count() == 1


@pytest.mark.django_db
def test_user_cannot_see_another_users_entries(
    client: APIClient, user: User, other_user: User
) -> None:
    MoodEntry.objects.create(user=other_user, date="2026-01-15", mood="anxious")
    own_entry = MoodEntry.objects.create(user=user, date="2026-01-16", mood="happy")

    list_response = client.get("/api/v2/mood-entries/?month=2026-01")
    assert list_response.status_code == 200
    assert [entry["id"] for entry in list_response.data] == [own_entry.id]

    other_entry = MoodEntry.objects.get(user=other_user)
    detail_response = client.get(f"/api/v2/mood-entries/{other_entry.id}/")
    assert detail_response.status_code == 404


@pytest.mark.django_db
def test_unauthenticated_request_rejected() -> None:
    response = APIClient().get("/api/v2/mood-entries/")
    # 403, not 401 — SessionAuthentication is first in DEFAULT_AUTHENTICATION_CLASSES
    # and doesn't set a WWW-Authenticate header, so DRF falls back to 403.
    assert response.status_code == 403
