from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Events)
admin.site.register(EventRegistration)
admin.site.register(Attendee)
admin.site.register(TransportDetails)