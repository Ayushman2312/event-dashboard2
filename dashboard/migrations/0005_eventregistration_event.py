# Generated by Django 5.1.4 on 2024-12-18 12:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0004_alter_eventregistration_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventregistration',
            name='event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.events'),
        ),
    ]