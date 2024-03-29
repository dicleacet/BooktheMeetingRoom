from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.filters import UserFilters
from accounts.models import User, UserPasswordResetCode
from accounts.permissions import UserGetDataPermission, IsManager
from accounts import serializers
from app.helpers import DestroyModelMixin


class UserObtainTokenPairView(TokenObtainPairView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = serializers.UserTokenObtainPairSerializer

    @extend_schema(tags=['Users - Public'], responses=serializers.UserTokenRefreshSerializer)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserTokenRefreshView(TokenRefreshView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = serializers.UserTokenRefreshSerializer

    @extend_schema(tags=['Users - Public'], responses=serializers.UserTokenRefreshResponseSerializer)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


@extend_schema_view(
    list=extend_schema(tags=['Users - Manager'], description='ordering: id, last_login'),
    create=extend_schema(tags=['Users - Manager']),
    retrieve=extend_schema(tags=['Users - Manager']),
    update=extend_schema(tags=['Users - Manager']),
    partial_update=extend_schema(tags=['Users - Manager']),
    destroy=extend_schema(tags=['Users - Manager']),
    update_password=extend_schema(tags=['Users - Manager'], request=serializers.PasswordSerializer, responses=None),
)
class UserViewSet(DestroyModelMixin, ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.ReadUserSerializer
    permission_classes = (IsAuthenticated, IsManager)
    filter_class = UserFilters
    search_fields = (
        'username', 'email', 'first_name', 'last_name'
    )
    ordering_fields = (
        'id', 'last_login'
    )

    def get_serializer_class(self):
        if self.request.method not in SAFE_METHODS:
            self.serializer_class = serializers.UpdateUserSerializer
        if self.request.method == 'POST':
            self.serializer_class = serializers.CreateUserSerializer
        return self.serializer_class

    @action(methods=['PATCH'], detail=True, url_path='password')
    def update_password(self, request, pk):
        """Update pk user password"""
        user = self.get_object()
        serializer = serializers.PasswordSerializer(
            user,
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': _('Password updated successfully.')},
            status=status.HTTP_200_OK
        )


class UserGetDataView(APIView):
    serializer_class = serializers.UserDataSerializer
    permission_classes = [IsAuthenticated, UserGetDataPermission]

    @extend_schema(tags=['Users - Authenticated'])
    def get(self, request):
        serializer = self.serializer_class(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(tags=['Users - Public'], request=serializers.UserPasswordResetSerializer)
class PasswordResetApiView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @staticmethod
    def post(request):
        serializer = serializers.UserPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data.get('token')
        reset_code = UserPasswordResetCode.objects.filter(reset_code=token).first()
        if reset_code:
            user = reset_code.user
            user.set_password(
                serializer.validated_data.get('password1')
            )
            user.save()
            reset_code.delete()
            return Response(
                {"detail": _('Password reset successful.')},
                status=200
            )
        return Response(
            {"detail": _(
                'Password reset token is invalid or expired. Please request a new one.'
            )},
            status=400
        )


@extend_schema(tags=['Users - Public'], request=serializers.CreateUserSerializer)
class UserRegistrationView(APIView):
    serializer_class = serializers.CreateUserSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response('Registration Successful', status=status.HTTP_201_CREATED)
