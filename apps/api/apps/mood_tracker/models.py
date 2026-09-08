from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class MoodValue(models.TextChoices):
    """Matches the frontend's MoodValue union exactly — see
    docs/frontend-migration-plan.md module 3."""

    HAPPY = "happy", "Happy"
    NEUTRAL = "neutral", "Neutral"
    SAD = "sad", "Sad"
    EXCITED = "excited", "Excited"
    ANXIOUS = "anxious", "Anxious"


class MoodEntry(TimeStampedModel):
    """One mood check-in per user per day.

    v1's save_mood view only checked for a same-day duplicate at the
    application layer (docs/audit-findings.md) — the unique_together
    constraint below is the fix, enforced by the database itself, not
    just a view-level check that a race condition could slip past.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mood_entries"
    )
    date = models.DateField()
    mood = models.CharField(max_length=20, choices=MoodValue.choices)
    note = models.TextField(blank=True)

    class Meta:
        unique_together = [("user", "date")]
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.user_id} — {self.date} ({self.mood})"
