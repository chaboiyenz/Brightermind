from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .serializers import (
    LoginSerializer,
    PsychologistRegisterSerializer,
    RegisterSerializer,
    UserSerializer,
    issue_token,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request: Request) -> Response:
    """POST /api/v2/auth/login/ — token auth, per Phase 3 (docs/roadmap.md).
    Replaces the TEMPORARY dev-login endpoint from Phase 2."""
    serializer = LoginSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]
    return Response({"token": issue_token(user), "user": UserSerializer(user).data})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request: Request) -> Response:
    """POST /api/v2/auth/register/ — student signup. Auto-issues a token
    (logs the user in immediately) rather than requiring a separate login
    call right after signing up."""
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(
        {"token": issue_token(user), "user": UserSerializer(user).data},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_psychologist(request: Request) -> Response:
    """POST /api/v2/auth/register/psychologist/ — psychologist signup.
    Creates an unapproved PsychologistProfile (Phase 4 builds the approval
    workflow that acts on it) but still auto-issues a token — being
    unapproved gates what the account can *do* via the role/approval state
    itself, not whether it can log in at all."""
    serializer = PsychologistRegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(
        {"token": issue_token(user), "user": UserSerializer(user).data},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request: Request) -> Response:
    """GET /api/v2/auth/me/ — what RoleGate/RoleProvider on the frontend
    wire to, replacing the mocked role from Phase 0/2."""
    return Response(UserSerializer(request.user).data)
