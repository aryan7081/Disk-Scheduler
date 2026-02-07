from django.urls import path
from . import views

urlpatterns = [
    path('', views.root, name='root'),
    path('algorithms/', views.get_algorithms, name='algorithms'),
    path('simulate/', views.simulate, name='simulate'),
    path('compare/', views.compare_algorithms, name='compare'),
]
