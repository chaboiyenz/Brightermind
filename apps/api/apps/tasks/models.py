from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Priority(models.TextChoices):
    LOW = "low", "Low"
    MEDIUM = "medium", "Medium"
    HIGH = "high", "High"


class TaskCategory(models.TextChoices):
    WORK = "work", "Work"
    PERSONAL = "personal", "Personal"
    SHOPPING = "shopping", "Shopping"


class Task(TimeStampedModel):
    """docs/frontend-migration-plan.md module 6. Simplified from v1's
    soft-delete (`deleted` boolean) to a real DELETE — nothing elsewhere
    reads deleted tasks, so there's no audit-trail requirement to carry
    forward; the frontend just calls DELETE and trusts the list endpoint,
    same end result the migration plan describes."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks"
    )
    title = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    deadline = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    category = models.CharField(
        max_length=20, choices=TaskCategory.choices, default=TaskCategory.PERSONAL
    )
    is_completed = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["is_completed", "-created_at"]

    def __str__(self) -> str:
        return f"{self.user_id} — {self.title}"

    def toggle_completed(self) -> None:
        """+1 on complete, max(score-1, 0) on un-complete — moved here from
        the old view-level logic so the toggle endpoint's response is the
        single source of truth for the score delta; the frontend applies
        whatever this returns rather than computing +1/-1 itself."""
        if self.is_completed:
            self.is_completed = False
            self.score = max(self.score - 1, 0)
        else:
            self.is_completed = True
            self.score += 1
        self.save(update_fields=["is_completed", "score", "updated_at"])
