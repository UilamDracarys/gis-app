from django.test import TestCase
from django.contrib.gis.geos import Point
from apps.features.models import Feature

class GeometryModelTest(TestCase):
    def test_create_geometry(self):
        obj = Feature.objects.create(
            name="Test Geometry",
            geom=Point(123.8854, 10.3157),
            style={"color": "red"}
        )

        self.assertEqual(obj.name, "Test Geometry")
        self.assertEqual(obj.style["color"], "red")