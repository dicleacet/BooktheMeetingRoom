from django.db import models


class BookingRoom(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField(null=False, blank=False)
    end_date = models.DateTimeField(null=False, blank=False)
    max_people = models.IntegerField(null=False, blank=False)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.name

