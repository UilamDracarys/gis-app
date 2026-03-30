from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ..models import Feature
from rest_framework_gis.fields import GeometryField
from rest_framework import serializers

class FeatureSerializer(GeoFeatureModelSerializer):
    geom = GeometryField()
    measure = serializers.SerializerMethodField()
    created_by = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = Feature
        geo_field = "geom"  # your PointField
        fields = "__all__"
        read_only_fields = ["created_by", "created_at"]

    def get_measure(self, obj):
        if not obj.geom:
            return None

        geom = obj.geom

        # projected = geom.transform(4326, clone=True)

        if geom.geom_type in ["Polygon", "MultiPolygon"]:
            return {
                "type": "area",
                "value": geom.transform(3857, clone=True).area  # m²
            }

        elif geom.geom_type in ["LineString", "MultiLineString"]:
            return {
                "type": "length",
                "value": geom.transform(32651, clone=True).length # meters
            }

        return None
    
