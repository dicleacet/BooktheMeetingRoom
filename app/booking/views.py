from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from booking import serializers
from rest_framework.views import APIView
from booking.models import BookingRoom
from datetime import datetime
from app.helper import admin_only

class AvailableRooms(APIView):
    serializer_class = serializers.BookingSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        number_of_people = request.GET.get('numberOfPeople')
        start_date = request.GET.get('startDate')
        start_date = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
        end_date = request.GET.get('endDate')
        end_date = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")
        queryset = BookingRoom.objects.filter(max_people__gte=number_of_people, start_date__lte=start_date,
                                              end_date__gte=end_date)
        serializer = serializers.BookingSerializer(queryset, many=True)
        return Response({"avaliableRooms": serializer.data}, status=200)


class BookRoom(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        serializer = serializers.BookRoomSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)


class AddRoom(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @admin_only
    def post(self, request):
        data = request.data
        serializer = serializers.BookingSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)
