from django.urls import path, include
from booking import views

urlpatterns = [
    path('availablerooms/', views.AvailableRooms.as_view(), name='booking'),
    path('bookroom/', views.BookRoom.as_view(), name='bookroom'),
    path('addroom/', views.AddRoom.as_view(), name='adminaddbooking'),
    ]