import pandas as pd
import io

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import  df_to_model
from .serializer import  CSVSerializer, get_serializer, serialize_dtype
from .infer_data_types import infer_and_convert_data_types

DynamicModel = None

@api_view(["GET"])
def get_items(request):
    users = DynamicModel.objects.all()
    print(users)

    serialized = get_serializer(DynamicModel)(users, many=True).data
    return Response(serialized)


@api_view(["POST"])
def create_item(request):

    serializer = get_serializer(DynamicModel)(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def item_handle(request, pk):
    try:
        user = DynamicModel.objects.get(pk=pk)
    except DynamicModel.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = get_serializer(DynamicModel)(user)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = get_serializer(DynamicModel)(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from pandas.api.types import is_complex_dtype

@api_view(["POST"])
def parse_csv(request):
    global DynamicModel
    serializer = CSVSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    csv = serializer.validated_data["file"]
    csv_data = pd.read_csv(io.StringIO(csv.read().decode("utf-8")))

    df = infer_and_convert_data_types(csv_data)
    DynamicModel = df_to_model(df, name='Empty', app_label='dynamic')

    from django.db import connection
    with connection.schema_editor() as schema_editor:
        schema_editor.delete_model(DynamicModel)
        schema_editor.create_model(DynamicModel)

    dtype_dict = df.dtypes.to_dict()
    for record in df.to_dict(orient='records'):
        for key in record:
            if is_complex_dtype(dtype_dict[key]):
                record[key]=str(record[key])
        serializer = get_serializer(DynamicModel)(data=record)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

    serialized = {key: serialize_dtype(value) for key, value in dtype_dict.items()}
    return Response(serialized, status=status.HTTP_200_OK)
