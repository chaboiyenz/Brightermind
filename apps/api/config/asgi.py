"""
ASGI config for the BrighterMind API.

Routes HTTP through Django as usual and WebSocket connections through
Django Channels (chat, community feed, notifications — TDD §3, §4.3).
The websocket_urlpatterns list is empty for now; each real-time feature adds
its routes here as its consumers are built.
"""

import os

import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
django.setup()

websocket_urlpatterns: list = []

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": URLRouter(websocket_urlpatterns),
    }
)
