from django.urls import path

from . import views

app_name = "recordStoreAdmin"
urlpatterns = [
    path("<str:token>", views.index, name="index"),
    path("add_record/<str:token>", views.add_record, name="add_record"),
]