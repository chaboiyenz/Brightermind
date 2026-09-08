from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.accounts.models import Role


class _HasRole(BasePermission):
    """Base for the three role-scoped permission classes below. Not used
    directly — subclass and set `role`."""

    role: Role

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user and request.user.is_authenticated and request.user.role == self.role
        )


class IsStudent(_HasRole):
    role = Role.STUDENT


class IsPsychologist(_HasRole):
    role = Role.PSYCHOLOGIST


class IsAdmin(_HasRole):
    # Supersedes the minimal standalone IsAdmin content.views used while
    # this (the full reusable set) was still Phase 3's job — see
    # docs/roadmap.md. Same behavior, now sharing _HasRole with its siblings.
    role = Role.ADMIN
