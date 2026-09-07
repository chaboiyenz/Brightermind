from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base for the created_at/updated_at pair every domain model
    in this project needs. Inherit from this instead of adding the two
    fields by hand in each app."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
