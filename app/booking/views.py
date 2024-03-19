from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from accounts.permissions import IsManager, IsMember
from rest_framework.response import Response
from app.helpers import DestroyModelMixin
from booking import serializers
from rest_framework.views import APIView
from booking.models import BookingRoom
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view


class AvailableRooms(APIView):
    serializer_class = serializers.BookingSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(tags=['Booking - Authenticated'], request=serializer_class)
    def get(self, request):
        number_of_people = request.GET.get('numberOfPeople')
        start_date = request.GET.get('startDate')
        start_date = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
        end_date = request.GET.get('endDate')
        end_date = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")
        queryset = BookingRoom.objects.filter(max_people__gte=number_of_people, start_date__lte=start_date,
                                              end_date__gte=end_date, status=True)
        serializer = serializers.BookingSerializer(queryset, many=True)
        return Response({"avaliableRooms": serializer.data}, status=200)


class GetAllRooms(APIView):
    serializer_class = serializers.BookingSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    @extend_schema(tags=['Booking - Authenticated'], request=serializer_class)
    def get(self, request):
        queryset = BookingRoom.objects.filter(status=True)
        serializer = serializers.BookingSerializer(queryset, many=True)
        return Response({"rooms": serializer.data}, status=200)


class BookRoom(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(tags=['Booking - Authenticated'], request=serializers.BookRoomSerializer, responses=serializers.BookRoomSerializer)
    def post(self, request):
        data = request.data
        serializer = serializers.BookRoomSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)


@extend_schema_view(
    list=extend_schema(tags=['Booking - Manager']),
    create=extend_schema(tags=['Booking - Manager']),
    retrieve=extend_schema(tags=['Booking - Manager']),
    update=extend_schema(tags=['Booking - Manager']),
    partial_update=extend_schema(tags=['Booking - Manager']),
    destroy=extend_schema(tags=['Booking - Manager']),
)
class BookingRoomViewSet(ModelViewSet):
    queryset = BookingRoom.objects.all()
    serializer_class = serializers.BookingSerializer
    permission_classes = (IsAuthenticated, IsManager)
    search_fields = (
        'room', 'max_people', 'start_date', 'end_date'
    )
    ordering_fields = (
        'id', 'start_date'
    )

    # def get_serializer_class(self):
    #     if self.request.method not in ['GET']:
    #         self.serializer_class = serializers.BookRoomSerializer
    #     return self.serializer_class
