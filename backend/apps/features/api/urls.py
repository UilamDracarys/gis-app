from rest_framework.routers import DefaultRouter
from .views import FeatureViewSet

router = DefaultRouter()
router.register('', FeatureViewSet)

urlpatterns = router.urls