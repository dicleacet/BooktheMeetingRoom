from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from booking.models import BookingRoom


@admin.register(BookingRoom)
class BookingRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'max_people', 'status')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('name', 'description')
    date_hierarchy = 'start_date'
    ordering = ('start_date', 'end_date')
    fieldsets = (
        (None, {'fields': ('name', 'description')}),
        ('Date information', {'fields': ('start_date', 'end_date')}),
        ('People information', {'fields': ('max_people', 'status')}),
    )
