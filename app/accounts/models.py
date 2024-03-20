from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, AbstractUser
from accounts.managers import UserManager
from django.utils.translation import gettext_lazy as _


class User(AbstractBaseUser, PermissionsMixin):
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        _('Username'),
        max_length=30,
        unique=True,
        validators=[username_validator],
        help_text=_('30 Characters or fewer. Letters, digits and @/./+/-/_ only.'),
    )
    first_name = models.CharField(_('Name'), max_length=80, null=True, blank=True)
    last_name = models.CharField(_('Last Name'), max_length=80, null=True, blank=True)
    email = models.EmailField(_('E-Mail'), null=True, blank=True)
    is_active = models.BooleanField(
        _('User Active'),
        default=True,
        help_text=_('User is active or not. If not, user cannot login to the system.')
    )
    user_permission = models.CharField(
        _('User Permission'),
        max_length=20,
        choices=(
            ('superuser', _('Superuser')),
            ('manager', _('Manager')),
            ('member', _('Member')),
        ),
        default='member',
        help_text=_('User permission group. '
                    'Superuser can access all of the system. Manager can access only admin panel.')
    )
    last_login = models.DateTimeField(
        _('Last Login Date'),
        null=True,
        blank=True,
        help_text=_('User last login date.')
    )
    date_joined = models.DateTimeField(
        _('Date Joined'),
        auto_now_add=True,
        help_text=_('User joined date.')
    )
    deleted_at = models.DateTimeField(_('User Deleted Date'), null=True, blank=True)

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    objects = UserManager()

    def __str__(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name} ( {self.username} )"
        return self.username

    def get_short_name(self):
        if self.first_name:
            return self.first_name
        return self.username

    def get_full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username

    @property
    def is_superuser(self):
        return True if self.user_permission == 'superuser' else False

    @property
    def is_staff(self):
        return True if self.user_permission == 'superuser' else False

    @property
    def is_manager(self):
        return True if self.user_permission == 'manager' else False

    @property
    def is_member(self):
        return True if self.user_permission == 'member' else False

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ('id', )
        db_table = 'users'


class UserPasswordResetCode(models.Model):
    user = models.OneToOneField(
        User,
        related_name='password_reset_code',
        on_delete=models.CASCADE,
        verbose_name=_('User')
    )
    reset_code = models.CharField(
        max_length=120,
        verbose_name=_('User Password Reset Code')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )

    class Meta:
        verbose_name = _('Password Reset Code')
        verbose_name_plural = _('Password Reset Codes')
        ordering = ['-id']
        db_table = 'user_password_reset_codes'
