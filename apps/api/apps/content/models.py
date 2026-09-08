from django.db import models

from apps.core.models import TimeStampedModel


class ContentBlock(TimeStampedModel):
    """CMS content for public marketing pages — docs/frontend-migration-plan.md
    module 17. `slug` identifies the page ("home", "about"); content editing
    moves to a separate admin route, never embedded inline on the public
    page like v1's superuser-conditional <form> in home.html/about.html."""

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()

    class Meta:
        ordering = ["slug"]

    def __str__(self) -> str:
        return self.slug
