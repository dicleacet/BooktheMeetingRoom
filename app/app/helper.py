from rest_framework import status
from rest_framework.response import Response


def admin_only(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({"error : You must have admin permission to perform this operation."}, status=status.HTTP_403_FORBIDDEN)
        return view_func(request, *args, **kwargs)
    return _wrapped_view
