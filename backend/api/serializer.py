from rest_framework import serializers

class CSVSerializer(serializers.Serializer):
    file = serializers.FileField()

class DTypeSerializer(serializers.Serializer):
    name = serializers.CharField()
    object = serializers.CharField()