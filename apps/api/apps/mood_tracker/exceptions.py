from rest_framework.exceptions import APIException
from rest_framework.status import HTTP_409_CONFLICT


class DuplicateMoodEntry(APIException):
    """Raised for a same-day duplicate mood entry — 409, not the generic 400
    a plain serializers.ValidationError would produce, so the frontend can
    tell "you already logged today" apart from "this field is invalid"."""

    status_code = HTTP_409_CONFLICT
    default_detail = "You already logged a mood entry for this date."
    default_code = "duplicate_mood_entry"
