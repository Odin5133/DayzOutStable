# Example migration file (socialmed/migrations/0002_set_user_id_start.py)
from django.db import migrations, connection

def set_user_id_start(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("UPDATE sqlite_sequence SET seq = 999 WHERE name = 'socialmed_user';")

class Migration(migrations.Migration):
    dependencies = [
        ('socialmed', '0002_user_username'),
    ]
    operations = [
        migrations.RunPython(set_user_id_start),
    ]
