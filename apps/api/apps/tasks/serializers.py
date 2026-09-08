from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "notes",
            "deadline",
            "priority",
            "category",
            "is_completed",
            "score",
        ]
        # is_completed/score are only ever mutated via the toggle action
        # (TaskViewSet.toggle) — never a direct field write, so the score
        # delta rule stays in exactly one place (Task.toggle_completed).
        read_only_fields = ["id", "is_completed", "score"]
