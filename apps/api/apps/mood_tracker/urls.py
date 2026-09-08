from rest_framework.routers import DefaultRouter

from .views import MoodEntryViewSet

router = DefaultRouter()
router.register("mood-entries", MoodEntryViewSet, basename="mood-entry")

urlpatterns = router.urls
