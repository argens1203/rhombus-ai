from django.db import models


# Create your models here.
class User(models.Model):
    age = models.IntegerField()
    name = models.CharField(max_length=100)

    # def __init__(self, name, age):
    #     self.name = name
    #     self.age = age

    def __str__(self):
        return self.name
