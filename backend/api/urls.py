from django.urls import path
from .views import get_items, create_item, item_handle, parse_csv

urlpatterns = [
    path("items/", get_items, name="get_items"),
    path("items/create", create_item, name="create_item"),
    path("items/<int:pk>", item_handle, name="item_handle"),
    path("items/parse_csv", parse_csv, name="parse_csv"),
]
