import pandas as pd
import io

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import  create_model
from .serializer import  CSVSerializer, DTypeSerializer

from .infer_data_types import infer_and_convert_data_types

User = None

from rest_framework import serializers

def get_serializer():
    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = "__all__"
    return UserSerializer


@api_view(["GET"])
def get_users(request):
    users = User.objects.all()
    print(users)

    serialized = get_serializer()(users, many=True).data
    return Response(serialized)


@api_view(["POST"])
def create_user(request):

    serializer = get_serializer()(data=request.data)
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
        serializer = get_serializer()(user)
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = get_serializer()(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from django.db import models
import pandas as pd
import numpy as np

def map_dtype_to_django_field(dtype):
    if pd.api.types.is_integer_dtype(dtype):
        return models.IntegerField
    elif pd.api.types.is_float_dtype(dtype):
        return models.FloatField
    elif pd.api.types.is_bool_dtype(dtype):
        return models.BooleanField
    elif pd.api.types.is_datetime64_any_dtype(dtype):
        return models.DateTimeField
    else:
        return models.CharField


def create_model_from_dataframe(df, model_name="DynamicModel", app_label='', module=''):
    """
    Dynamically create a Django model class from a Pandas DataFrame.
    
    Args:
    - df (pd.DataFrame): The DataFrame to base the model on.
    - model_name (str): Name of the new model class.
    - app_label (str): The app label to register the model under.
    - module (str): The module where the model is defined.
    
    Returns:
    - Django model class.
    """
    fields = {}
    for column in df.columns:
        # Map DataFrame column dtype to a Django field type
        field_type = map_dtype_to_django_field(df[column].dtype)
        
        # Define the field with appropriate parameters
        if field_type == models.CharField:
            max_length = df[column].map(lambda x: len(str(x)) if pd.notna(x) else 0).max()
            fields[column] = field_type(max_length=min(max_length, 255), blank=True, null=True)
        else:
            fields[column] = field_type(blank=True, null=True)
    return fields

    # Set up the module and model name
    fields['__module__'] = module
    
    # Dynamically create the model class
    model = type(model_name, (models.Model,), fields)
    
    # Register the model in the app's model registry
    model._meta.app_label = app_label
    
    return model


from django.core.management import call_command
from django.utils.module_loading import import_module
from django.conf import settings
from importlib import reload
from django.apps import apps

@api_view(["POST"])
def parse_csv(request):
    global User
    serializer = CSVSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    csv = serializer.validated_data["file"]
    print("hello")
    print(csv)
    csv_data = pd.read_csv(io.StringIO(csv.read().decode("utf-8")))
    print("goodbye")
    print(csv_data)
    df = infer_and_convert_data_types(csv_data)
    fields = create_model_from_dataframe(df)
    User = create_model('Empty', fields, app_label='dynamic')
    # from django.core.management import  color
    from django.db import connection

    with connection.schema_editor() as schema_editor:
        schema_editor.delete_model(User)
        schema_editor.create_model(User)
    # style = color.no_style()

    # cursor = connection.cursor()
    # statements, pending = sql.sql_model_create(empty, style)
    # for sql in statements:
    #     cursor.execute(sql)
    # apps.register_model('dynamic', empty)
    print(User)
    # reload(import_module(settings.ROOT_URLCONF))
    # call_command('makemigrations')
    # call_command('migrate')

    # print(df.dtypes)
    # # print(df.dtypes["Name"])
    # # print(df.dtypes["Object"])

    # print('ret')
    # ret = []
    # for name, type in df.dtypes.items():
    #     print(f"name: {name}, type: {type}")
    #     ret.append({name: type})

    # # dTypeSerializer = DTypeSerializer(data=df.dtypes)
    # # if not dTypeSerializer.is_valid():
    # #     return Response(dTypeSerializer.data, status=status.HTTP_400_BAD_REQUEST)

    # # print(dTypeSerializer.validated_data)
    # # df_records = df.to_dict('records')
    # # DynamicModel = create_model('DynamicModel', df.dtypes, app_label='app_label', module=__name__ )
    # print('ret')
    # print(ret)
    return Response([], status=status.HTTP_200_OK)
