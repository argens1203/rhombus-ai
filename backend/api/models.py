from django.db import models
import pandas as pd

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

def df_to_fields(df):
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

def create_model(name, fields=None, app_label='', module='', options=None, admin_opts=None):
    """
    Create specified model
    """
    class Meta:
        # Using type('Meta', ...) gives a dictproxy error during model creation
        pass

    if app_label:
        # app_label must be set using the Meta inner class
        setattr(Meta, 'app_label', app_label)

    # Update Meta with any options that were provided
    if options is not None:
        for key, value in options.iteritems():
            setattr(Meta, key, value)

    # Set up a dictionary to simulate declarations within a class
    attrs = {'__module__': module, 'Meta': Meta}

    # Add in any fields that were provided
    if fields:
        attrs.update(fields)

    # Create the class, which automatically triggers ModelBase processing
    model = type(name, (models.Model,), attrs)

    return model

def df_to_model(df, name, app_label):
    fields = df_to_fields(df)
    return create_model(name, fields=fields, app_label=app_label)