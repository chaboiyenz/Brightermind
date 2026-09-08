from rest_framework import serializers

from .exceptions import DuplicateMoodEntry
from .models import MoodEntry


class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = ["id", "date", "mood", "note", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs: dict) -> dict:
        # Proactive check so a duplicate-day POST gets a clear 409 instead of
        # surfacing the database's IntegrityError as a raw 500. The view's
        # perform_create() is still guarded separately as a race-condition
        # safety net — see views.py.
        request = self.context["request"]
        date = attrs.get("date")
        if date is not None:
            existing = MoodEntry.objects.filter(user=request.user, date=date)
            if self.instance is not None:
                existing = existing.exclude(pk=self.instance.pk)
            if existing.exists():
                raise DuplicateMoodEntry()
        return attrs
