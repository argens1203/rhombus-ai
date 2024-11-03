from rest_framework import serializers

class CSVSerializer(serializers.Serializer):
    file = serializers.FileField()

def get_serializer(Model):
    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = Model
            fields = "__all__"
    return UserSerializer