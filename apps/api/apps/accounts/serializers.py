from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import PsychologistProfile, Role, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]
        read_only_fields = fields


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        user = authenticate(
            self.context["request"], username=attrs["username"], password=attrs["password"]
        )
        if user is None:
            raise serializers.ValidationError({"detail": "Invalid credentials."})
        attrs["user"] = user
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    """Student signup — docs/frontend-migration-plan.md module 1's
    SignupFormValues. Excludes the image upload for now (no media storage
    wired up yet); can be added once S3 (TDD §4.5) is provisioned."""

    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "password1", "password2"]

    def validate(self, attrs: dict) -> dict:
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        validate_password(attrs["password1"])
        return attrs

    def create(self, validated_data: dict) -> User:
        validated_data.pop("password2")
        password = validated_data.pop("password1")
        return User.objects.create_user(password=password, role=Role.STUDENT, **validated_data)


class PsychologistRegisterSerializer(RegisterSerializer):
    """Psychologist signup — extends the student fields with
    PsychologistSignupFormValues' extra fields, creating a linked
    PsychologistProfile (unapproved by default; see the model docstring)."""

    license_number = serializers.CharField()
    qualification = serializers.CharField()
    years_of_experience = serializers.IntegerField(min_value=0)
    area_of_expertise = serializers.CharField()
    contact_number = serializers.CharField()
    bio = serializers.CharField(required=False, allow_blank=True)

    class Meta(RegisterSerializer.Meta):
        fields = RegisterSerializer.Meta.fields + [
            "license_number",
            "qualification",
            "years_of_experience",
            "area_of_expertise",
            "contact_number",
            "bio",
        ]

    def create(self, validated_data: dict) -> User:
        profile_fields = {
            "license_number": validated_data.pop("license_number"),
            "qualification": validated_data.pop("qualification"),
            "years_of_experience": validated_data.pop("years_of_experience"),
            "area_of_expertise": validated_data.pop("area_of_expertise"),
            "contact_number": validated_data.pop("contact_number"),
            "bio": validated_data.pop("bio", ""),
        }
        validated_data.pop("password2")
        password = validated_data.pop("password1")
        user = User.objects.create_user(password=password, role=Role.PSYCHOLOGIST, **validated_data)
        PsychologistProfile.objects.create(user=user, **profile_fields)
        return user


def issue_token(user: User) -> str:
    token, _ = Token.objects.get_or_create(user=user)
    return token.key
