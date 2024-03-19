from django.urls import path, include
from booking import views
from rest_framework.routers import DefaultRouter

app_name = 'booking'

router = DefaultRouter()

router.register('bookings', views.BookingRoomViewSet, basename='manager_user')

urlpatterns = [
    path('', include(router.urls)),
    path('availablerooms/', views.AvailableRooms.as_view(), name='booking'),
    path('bookroom/', views.BookRoom.as_view(), name='bookroom'),
    path('getallrooms/', views.GetAllRooms.as_view(), name='getallrooms')
]
