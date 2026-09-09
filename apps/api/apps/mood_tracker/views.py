from datetime import datetime

from django.db import IntegrityError
from django.db.models import QuerySet
from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from .exceptions import DuplicateMoodEntry
from .models import MoodEntry
from .serializers import MoodEntrySerializer


class MoodEntryViewSet(viewsets.ModelViewSet):
    """/api/v2/mood-entries/ — always scoped to the requesting user via
    request.user, never a client-supplied user id, so there is no way for
    one user to read or write another's mood entries (see get_queryset)."""

    serializer_class = MoodEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[MoodEntry]:
        queryset = MoodEntry.objects.filter(user=self.request.user)

        month = self.request.query_params.get("month")
        if month:
            try:
                parsed = datetime.strptime(month, "%Y-%m")
            except ValueError as exc:
                raise serializers.ValidationError({"month": "Expected YYYY-MM."}) from exc
            queryset = queryset.filter(date__year=parsed.year, date__month=parsed.month)

        return queryset

    def perform_create(self, serializer: MoodEntrySerializer) -> None:
        try:
            serializer.save(user=self.request.user)
        except IntegrityError as exc:
            # Safety net for the race condition the serializer-level check
            # (serializers.py) can't fully close — the unique_together
            # constraint on the model is the actual source of truth.
            raise DuplicateMoodEntry() from exc
