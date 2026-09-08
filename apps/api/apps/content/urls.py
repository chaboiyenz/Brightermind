from django.urls import path

from .views import ContentBlockDetailView

urlpatterns = [
    path("content/<slug:slug>/", ContentBlockDetailView.as_view(), name="content-block"),
]
