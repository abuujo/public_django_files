from django.db import models
from django.utils import timezone
from taggit.managers import TaggableManager

# Blog Models:
class Post(models.Model):
    title = models.CharField(max_length = 100)
    description = models.CharField(max_length = 250)
    content = models.TextField()
    date_posted = models.DateTimeField(default = timezone.now)
    tags = TaggableManager()
    read_time = models.CharField(max_length = 50, default = '6')

    def __str__(self):
        return self.title