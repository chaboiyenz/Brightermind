from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import JournalEntry
from .serializers import JournalEntrySerializer


class JournalEntryViewSet(viewsets.ModelViewSet):
    """/api/v2/journal-entries/ — scoped to request.user, same pattern as
    mood_tracker.MoodEntryViewSet."""

    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[JournalEntry]:
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer: JournalEntrySerializer) -> None:
        serializer.save(user=self.request.user)
