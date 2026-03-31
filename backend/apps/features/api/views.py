# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Feature
from .serializers import FeatureSerializer
from django.contrib.gis.db.models.functions import Area, Length
from django.db.models import FloatField, ExpressionWrapper
from django.db.models.functions import Cast
from django.contrib.gis.db.models import GeometryField
import json

class FeatureViewSet(viewsets.ModelViewSet):
    serializer_class = FeatureSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            qs = Feature.objects.all()
        else:
            qs = Feature.objects.filter(created_by=self.request.user)

        return qs.annotate(
            area=ExpressionWrapper(
                Area(Cast("geom", GeometryField(geography=True))),
                output_field=FloatField(),
            ),
            length=Length("geom", geography=True),
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data.dict()

        if data.get("geom"):
            print("GEOM: ", json.loads(data["geom"]))
            try:
                data["geom"] = json.loads(data["geom"])
            except Exception as e:
                print("GEOM PARSE ERROR:", e)

        if data.get("style"):
            print(data["style"])
            data["style"] = json.loads(data["style"])

        serializer = self.get_serializer(data=data)

        if not serializer.is_valid():
            print("SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        annotated = self.get_queryset().get(pk=serializer.instance.pk)
        return Response(self.get_serializer(annotated).data)