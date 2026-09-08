"""
URL configuration for the BrighterMind API.

Per-app URLs get included under /api/ as each app grows real endpoints
(e.g. path('api/screening/', include('apps.screening.urls'))) — none are
wired up yet since the data model for those apps isn't finalized (TDD §9).
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.core.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    # OpenAPI schema — packages/shared generates its TypeScript types from
    # this (TDD §5).
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Versioned per docs/frontend-migration-plan.md's endpoint contracts
    # (e.g. /api/v2/mood-entries/) — new domain resources go under here.
    path('api/v2/', include('apps.mood_tracker.urls')),
    path('api/v2/', include('apps.accounts.urls')),
    path('api/v2/', include('apps.journal.urls')),
    path('api/v2/', include('apps.tasks.urls')),
]
