import pytest
from rest_framework.test import APIClient

from apps.accounts.models import Role, User
from apps.content.models import ContentBlock


@pytest.fixture
def content_block(db) -> ContentBlock:
    return ContentBlock.objects.create(slug="test-block", title="Test Block", content="Welcome.")


@pytest.mark.django_db
def test_public_get_requires_no_auth(content_block: ContentBlock) -> None:
    response = APIClient().get("/api/v2/content/test-block/")
    assert response.status_code == 200
    assert response.data["title"] == "Test Block"


@pytest.mark.django_db
def test_missing_slug_returns_404() -> None:
    response = APIClient().get("/api/v2/content/nonexistent/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_student_cannot_edit_content(content_block: ContentBlock) -> None:
    student = User.objects.create_user(username="student1", password="pw", role=Role.STUDENT)
    client = APIClient()
    client.force_authenticate(user=student)

    response = client.patch("/api/v2/content/test-block/", {"title": "Hacked"}, format="json")
    assert response.status_code == 403
    content_block.refresh_from_db()
    assert content_block.title == "Test Block"


@pytest.mark.django_db
def test_anonymous_cannot_edit_content(content_block: ContentBlock) -> None:
    response = APIClient().patch("/api/v2/content/test-block/", {"title": "Hacked"}, format="json")
    assert response.status_code in (401, 403)


@pytest.mark.django_db
def test_admin_can_edit_content(content_block: ContentBlock) -> None:
    admin = User.objects.create_user(username="admin1", password="pw", role=Role.ADMIN)
    client = APIClient()
    client.force_authenticate(user=admin)

    response = client.patch("/api/v2/content/test-block/", {"title": "Updated Home"}, format="json")
    assert response.status_code == 200
    content_block.refresh_from_db()
    assert content_block.title == "Updated Home"


@pytest.mark.django_db
def test_admin_cannot_change_slug(content_block: ContentBlock) -> None:
    admin = User.objects.create_user(username="admin1", password="pw", role=Role.ADMIN)
    client = APIClient()
    client.force_authenticate(user=admin)

    client.patch("/api/v2/content/test-block/", {"slug": "hijacked"}, format="json")
    content_block.refresh_from_db()
    assert content_block.slug == "test-block"  # slug is read-only
