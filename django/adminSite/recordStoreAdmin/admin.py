from django.contrib import admin
from .models import Records, Artists, Genres, Addresses, Users, Orders

# Register your models here.

admin.site.register(Genres)
admin.site.register(Records)
admin.site.register(Artists)
admin.site.register(Addresses)
admin.site.register(Users)
admin.site.register(Orders)