from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    """The three roles referenced throughout the TDD's RLS/permission design
    (see docs/TDD.md §4.4, §6.1) — per-role row access is enforced both here
    (DRF permission classes) and, once policies are drafted, at the database
    level via PostgreSQL Row-Level Security."""

    STUDENT = "student", "Student"
    PSYCHOLOGIST = "psychologist", "Psychologist"
    ADMIN = "admin", "Admin"


class User(AbstractUser):
    """Custom user model so `role` exists from the first migration onward —
    swapping AUTH_USER_MODEL after the fact requires a full data migration,
    so this is set up now even though profile fields beyond `role` are still
    TBD pending the finalized general-mental-health data model."""

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)

    def __str__(self) -> str:
        return self.username
