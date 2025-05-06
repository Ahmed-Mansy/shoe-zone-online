from django.contrib import admin
from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('orders', OrderViewSet)

urlpatterns = [
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('crud/', include(router.urls)),
    path('my-orders/', UserOrderHistoryView.as_view(), name='user-order-history'),
    path('create/', createOrder, name='create_order'),
    path('confirm-payment/', confirmPayment, name='confirm_payment'),
]
