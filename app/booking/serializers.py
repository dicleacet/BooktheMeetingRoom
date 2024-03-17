from rest_framework import serializers
from booking.models import BookingRoom


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRoom
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'max_people']
        read_only_fields = ['id']


class BookRoomSerializer(serializers.Serializer):
    between = serializers.ListField(child=serializers.DateTimeField())
    roomId = serializers.IntegerField()
    numberOfPeople = serializers.IntegerField()

    def validate(self, data):
        start_date = data['between'][0]
        end_date = data['between'][1]
        id = data['roomId']  # id değerini roomId olarak alıyorsunuz
        try:
            booking = BookingRoom.objects.get(id=id)
        except BookingRoom.DoesNotExist:
            raise serializers.ValidationError("Booking not found")  # id ile bir rezervasyon bulunamazsa hata ver

        if start_date > end_date:
            raise serializers.ValidationError("End date should be greater than start date")
        if not booking.status:
            raise serializers.ValidationError("Room is already booked")
        if booking.max_people < data['numberOfPeople']:
            raise serializers.ValidationError("Number of people exceeds the limit")
        return data

    def create(self, validated_data):
        booking = BookingRoom.objects.get(id=validated_data['roomId'])
        booking.status = False
        booking.save()
        return validated_data
