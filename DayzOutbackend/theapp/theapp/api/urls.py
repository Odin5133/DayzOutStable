from rest_framework.routers import DefaultRouter
from socialmed.api.urls import login_router
from django.urls import path,include
router=DefaultRouter()

#login
router.registry.extend(login_router.registry)

urlpatterns=[
    path('',include(router.urls)), 
    
]