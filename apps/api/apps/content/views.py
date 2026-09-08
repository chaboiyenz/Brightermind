from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.core.permissions import IsAdmin

from .models import ContentBlock
from .serializers import ContentBlockSerializer


class ContentBlockDetailView(generics.RetrieveUpdateAPIView):
    """GET /api/v2/content/<slug>/ — public, no auth (SEO-relevant marketing
    pages should render fast and reliably for anyone).
    PATCH — admin only. Content editing is a separate concern from the
    public page itself, per the migration plan's explicit note that v1's
    inline admin <form> must not carry forward into HomePage/AboutPage."""

    queryset = ContentBlock.objects.all()
    serializer_class = ContentBlockSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in ("PATCH", "PUT"):
            return [IsAdmin()]
        return [AllowAny()]
