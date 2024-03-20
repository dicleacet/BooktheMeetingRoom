from django.http import Http404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from django.db.models.deletion import ProtectedError
from django.utils.translation import gettext_lazy as _


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 200


class DestroyModelMixin:
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {'detail': _('Delete operation failed because there are related data to the object.')},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Http404:
            return Response({"detail": "Bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

    def perform_destroy(self, instance):
        if getattr(instance, 'author'):
            if self.request.user != instance.user:
                raise serializers.ValidationError({'detail': _('Denied operation.')})
        instance.delete()


class DestroyManagerModelMixin:
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if request.user == instance:
                return Response(
                    {"detail": "You cannot delete your own account."}, status=status.HTTP_400_BAD_REQUEST
                )
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {'detail': _('Cannot delete because there are related data to the object.')},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Http404:
            return Response({"detail": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    def perform_destroy(self, instance):
        instance.delete()
