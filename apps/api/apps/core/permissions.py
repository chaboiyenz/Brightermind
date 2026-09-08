from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.accounts.models import Role


class IsAdmin(BasePermission):
    """Minimal role check, scoped to what content.views actually needs right
    now. The full reusable IsStudent/IsPsychologist/IsAdmin set (built
    against the role field, unit tested, used everywhere) is Phase 3's job
    per docs/roadmap.md — this isn't a substitute for that, just enough to
    not leave a content-write endpoint open while Phase 3 is still pending."""

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user and request.user.is_authenticated and request.user.role == Role.ADMIN
        )
