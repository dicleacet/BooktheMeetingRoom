from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from accounts.forms import UserAdminChangeForm, UserAdminCreationForm
from accounts.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'last_login')
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('user_permission', 'is_active', 'last_login', 'date_joined')
    readonly_fields = ('last_login', 'date_joined')
    fieldsets = (
        (_('Member'), {'fields': ('username', 'password', 'is_active')}),
        (_('Personal Information'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permission Groups for Admin Panel'), {'fields': ('user_permission', 'groups')}),
        (_('Date Information'), {'fields': ('last_login', 'date_joined')}),
    )
