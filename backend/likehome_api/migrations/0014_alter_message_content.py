# Generated by Django 5.1.1 on 2024-11-07 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('likehome_api', '0013_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='content',
            field=models.CharField(default='N/A', max_length=500),
        ),
    ]
