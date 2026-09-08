from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request: Request) -> Response:
    """Unauthenticated liveness check — used by the deploy pipeline and by
    apps/web during local integration testing to confirm the API is up."""
    return Response({"status": "ok"})
