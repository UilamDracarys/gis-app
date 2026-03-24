from rest_framework.routers import DefaultRouter
from .views import FeatureViewSet

router = DefaultRouter()
router.register('', FeatureViewSet, basename="feature")

urlpatterns = router.urls