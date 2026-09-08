"""
Settings shared by every environment. dev.py and prod.py both import * from
here and only override what actually differs — see docs/TDD.md §4.3, §6.
"""

from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()

# SECURITY WARNING: keep the secret key used in production secret! Never
# hardcode it here — dev.py loads it from a local .env file (gitignored),
# prod.py expects it injected via AWS Secrets Manager as an env var.
SECRET_KEY = env.str("DJANGO_SECRET_KEY")

DEBUG = env.bool("DJANGO_DEBUG", default=False)

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

AUTH_USER_MODEL = "accounts.User"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "corsheaders",
    "channels",
    "drf_spectacular",
    # Local apps
    "apps.core",
    "apps.accounts",
    "apps.screening",
    "apps.mood_tracker",
    "apps.journal",
    "apps.tasks",
    "apps.content",
    "apps.coping_techniques",
    "apps.chat",
    "apps.community",
    "apps.hotlines",
    "apps.feedback",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database — DATABASE_URL is expected to point at PostgreSQL (AWS RDS in
# staging/prod, per docs/TDD.md §4.4). dev.py supplies a sqlite fallback so
# `manage.py runserver`/pytest work without a local Postgres install.
DATABASES = {
    "default": env.db("DATABASE_URL"),
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS — web/mobile clients are separate origins from the API (TDD §3).
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])
# Required for session-cookie + CSRF-cookie auth to work cross-origin
# (apps/web on :3000, apps/api on :8000) — off by default, only meaningful
# once CORS_ALLOWED_ORIGINS is a real, non-wildcard list (it is, above).
CORS_ALLOW_CREDENTIALS = env.bool("CORS_ALLOW_CREDENTIALS", default=False)

# Django's CSRF protection checks the Origin header against this list
# separately from the token itself, for any cross-origin unsafe request —
# needed for apps/web (a different origin/port) to POST/PATCH/DELETE here.
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# Schema used to generate packages/shared's TypeScript types (TDD §5).
SPECTACULAR_SETTINGS = {
    "TITLE": "BrighterMind API",
    "DESCRIPTION": "BrighterMind v2 backend API",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# Channels — dev.py uses the in-memory layer (no Redis required locally);
# prod.py switches to channels_redis (TDD §4.3).
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    }
}
