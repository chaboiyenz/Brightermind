"""Local development settings. Run with DJANGO_SETTINGS_MODULE=config.settings.dev
(the default — see manage.py)."""

from pathlib import Path

import environ

# Computed independently of base.py (rather than imported from it) because
# base.py's module-level env.* calls must not run until .env is loaded below.
_BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load apps/api/.env (gitignored — copy .env.example to get started) before
# base.py's module-level env.* calls run.
environ.Env.read_env(_BASE_DIR / ".env")

from .base import *  # noqa: E402,F401,F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# In-memory channel layer (set in base.py) needs no further config for dev —
# no local Redis required to run `manage.py runserver`.
