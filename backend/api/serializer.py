from rest_framework import serializers
import pandas as pd

class CSVSerializer(serializers.Serializer):
    file = serializers.FileField()

def get_serializer(Model):
    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = Model
            fields = "__all__"
    return UserSerializer

from pandas.api.types import is_complex_dtype, is_bool_dtype, is_integer_dtype, is_float_dtype, is_datetime64_any_dtype
def serialize_dtype(dtype):
    if is_complex_dtype(dtype):
        return 'Complex'
    if isinstance(dtype, pd.CategoricalDtype):
        return str(dtype.categories._data)
    if is_bool_dtype(dtype):
        return 'Bool'
    if is_integer_dtype(dtype):
        return 'Int'
    if is_float_dtype(dtype):
        return 'Float'
    if is_datetime64_any_dtype(dtype):
        return 'Datetime'
    return 'Str'