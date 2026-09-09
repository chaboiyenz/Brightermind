from rest_framework import serializers

from .models import ContentBlock


class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ["id", "slug", "title", "content", "created_at"]
        read_only_fields = ["id", "slug", "created_at"]
