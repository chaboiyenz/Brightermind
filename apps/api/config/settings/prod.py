"""Production settings. All values come from the environment (AWS Secrets
Manager / App Runner env vars, per docs/TDD.md §6.3) — no .env file is read
here, unlike dev.py."""

from .base import *  # noqa: F401,F403
from .base import DATABASES, env

DEBUG = False

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")  # required, no default

# Enforce TLS on the RDS Postgres connection (TDD §6.1).
DATABASES["default"]["OPTIONS"] = {"sslmode": "require"}

# Redis-backed channel layer instead of base.py's in-memory one (TDD §4.3).
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env.str("REDIS_URL")],
        },
    }
}

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 365
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
