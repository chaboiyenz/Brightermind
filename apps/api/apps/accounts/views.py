from django.conf import settings
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([AllowAny])
def dev_login(request: Request) -> Response:
    """TEMPORARY, dev-only session login.

    Establishes a real Django session (proper CSRF protection stays on —
    this is deliberately NOT csrf_exempt, unlike the pattern the v1 audit
    flagged as critical) so Phase 2 pages can be built and tested against
    real auth-scoped endpoints before Phase 3 ships the actual
    login/signup/captcha flow. Delete this view once that lands — see
    docs/roadmap.md Phase 3.
    """
    if not settings.DEBUG:
        return Response(status=status.HTTP_404_NOT_FOUND)

    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)
    get_token(request)  # forces the csrftoken cookie to be set on this response
    return Response({"id": user.id, "username": user.username, "role": user.role})
