import pandas as pd
import io

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializer import UserSerializer, CSVSerializer

from .infer_data_types import infer_and_convert_data_types


@api_view(["GET"])
def get_users(request):
    users = User.objects.all()

    serialized = UserSerializer(users, many=True).data
    return Response(serialized)


@api_view(["POST"])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def parse_csv(request):
    serializer = CSVSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    csv = serializer.validated_data["file"]
    print("hello")
    print(csv)
    csv_data = pd.read_csv(io.StringIO(csv.read().decode("utf-8")))
    print("goodbye")
    print(csv_data)
    infer_and_convert_data_types(csv_data)
    return Response(status=status.HTTP_200_OK)
