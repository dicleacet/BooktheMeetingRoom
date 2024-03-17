from django.urls import path, include
from booking import views

app_name = 'booking'


urlpatterns = [
    path('availablerooms/', views.AvailableRooms.as_view(), name='booking'),
    path('bookroom/', views.BookRoom.as_view(), name='bookroom'),
    ]