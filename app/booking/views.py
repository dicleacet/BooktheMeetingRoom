from rest_framework.permissions import AllowAny
from accounts.permissions import IsManager
from rest_framework.response import Response
from booking import serializers
from rest_framework.views import APIView
from booking.models import BookingRoom
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema


class AvailableRooms(APIView):
    serializer_class = serializers.BookingSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(tags=['Users - Authenticated'], request= serializer_class)
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
    authentication_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    @extend_schema(tags=['Users - Authenticated'], request=serializers.BookRoomSerializer, responses=serializers.BookRoomSerializer)
    def post(self, request):
        data = request.data
        serializer = serializers.BookRoomSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

