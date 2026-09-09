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


class PsychologistProfile(models.Model):
    """Extra fields collected at psychologist signup — docs/frontend-migration-
    plan.md module 1's PsychologistSignupFormValues. `is_approved` exists now
    (defaulting False) even though the approval workflow UI itself is Phase 4
    (docs/roadmap.md) — the field needs to exist before that workflow can act
    on it, and a newly-registered psychologist shouldn't read as approved by
    default."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="psychologist_profile")
    license_number = models.CharField(max_length=100)
    qualification = models.CharField(max_length=200)
    years_of_experience = models.PositiveIntegerField()
    area_of_expertise = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=30)
    bio = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.user_id} ({'approved' if self.is_approved else 'pending'})"
