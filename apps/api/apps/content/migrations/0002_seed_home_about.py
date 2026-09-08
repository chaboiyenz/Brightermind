from django.db import migrations


def seed_content(apps, schema_editor):
    ContentBlock = apps.get_model("content", "ContentBlock")
    ContentBlock.objects.get_or_create(
        slug="home",
        defaults={
            "title": "BrighterMind",
            "content": (
                "Mental health support for students — screening tools, mood "
                "tracking, coping techniques, and support from registered "
                "psychologists, all in one place."
            ),
        },
    )
    ContentBlock.objects.get_or_create(
        slug="about",
        defaults={
            "title": "About BrighterMind",
            "content": (
                "BrighterMind is a mental health support platform built for "
                "students. It provides screening tools, mood tracking, coping "
                "technique modules, and a way to connect with registered "
                "psychologists. It is a screening and support tool, not a "
                "diagnostic one."
            ),
        },
    )


def unseed_content(apps, schema_editor):
    ContentBlock = apps.get_model("content", "ContentBlock")
    ContentBlock.objects.filter(slug__in=["home", "about"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_content, unseed_content),
    ]
