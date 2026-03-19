from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ..models import Feature
from rest_framework_gis.fields import GeometryField

class FeatureSerializer(GeoFeatureModelSerializer):
    geom = GeometryField()

    class Meta:
        model = Feature
        geo_field = "geom"  # your PointField
        fields = "__all__"
        read_only_fields = ["created_by", "created_at"]
