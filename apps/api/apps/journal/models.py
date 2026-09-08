from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class JournalEntry(TimeStampedModel):
    """Personal reflective journal entries — docs/frontend-migration-plan.md
    module 5. Already clean CRUD in v1; nothing structural to fix here."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="journal_entries"
    )
    title = models.CharField(max_length=200)
    content = models.TextField()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user_id} — {self.title}"
