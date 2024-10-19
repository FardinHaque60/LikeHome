# Generated by Django 5.1.1 on 2024-10-18 23:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('likehome_api', '0004_reservation'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='description',
            field=models.TextField(default='N/A'),
        ),
        migrations.AddField(
            model_name='reservation',
            name='email',
            field=models.EmailField(default='N/A', max_length=254),
        ),
        migrations.AddField(
            model_name='reservation',
            name='images',
            field=models.JSONField(default=[]),
        ),
        migrations.AddField(
            model_name='reservation',
            name='phone_number',
            field=models.CharField(default='N/A', max_length=10),
        ),
        migrations.AddField(
            model_name='reservation',
            name='website',
            field=models.CharField(default='N/A', max_length=100),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='address',
            field=models.CharField(default='N/A', max_length=100),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='city',
            field=models.CharField(default='N/A', max_length=100),
        ),
    ]