from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Feature(models.Model):
    name = models.CharField(max_length=255)
    geom = models.GeometryField(srid=4326)
    style = models.JSONField(default=dict, blank=True)
    notes = models.TextField(max_length=500, blank=True, null=True)
    visibility = models.CharField(max_length=10, choices=(("only-me", "Only Me"), ("public", "Public"),), default="only-me")
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="feature_created",
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name