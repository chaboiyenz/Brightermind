from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """/api/v2/tasks/ — scoped to request.user. update_task's missing
    @login_required was an audit finding in v1 (docs/audit-findings.md);
    this is new code, built with IsAuthenticated + user-scoping from the
    start rather than a fix applied after the fact."""

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Task]:
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer: TaskSerializer) -> None:
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["patch"])
    def toggle(self, request: Request, pk: str | None = None) -> Response:
        task = self.get_object()
        task.toggle_completed()
        return Response(self.get_serializer(task).data)
