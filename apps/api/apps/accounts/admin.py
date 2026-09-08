from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import PsychologistProfile, User

admin.site.register(User, UserAdmin)
admin.site.register(PsychologistProfile)
