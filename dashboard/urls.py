from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', login_view, name="home"),
    path('dashboard/', Dashboard.as_view(), name="dashboard"),
    path('create_event/', CreateEventView.as_view(), name="create_event"),
    path('edit_event/<str:event_name>/', EditEventView.as_view(), name="edit_event"),
    path('delete_event/<str:event_name>/', DeleteEventView.as_view(), name="delete_event"),
    path('register_event/<str:event_name>/', EventRegistrationView.as_view(), name="register_event"),
    path('event_entries/<str:event_name>/', EventEntriesView.as_view(), name="event_entries"),
    path('view_entries/<str:event_name>/', EventEntriesView.as_view(), name="view_entries"),
    path('edit_entry/<str:event_name>/<int:registration_id>/', EditEntryView.as_view(), name="edit_entry"),
    path('signup/', signup, name="signup"),
    path('logout/', logout, name="logout"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)