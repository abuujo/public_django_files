from django.urls import path
from . import views
from .views import (blog_post)

urlpatterns = [
    path('', views.home, name = 'home'),

    # Main Pages
    path('election/', views.election, name = 'election'),
    path('election_fn_polling/', views.fn_polling, name = 'fn_polling'),
    path('election_fn_meckerras/', views.fn_meckerras, name = 'fn_meckerras'),
    path('election_fn_bellwether/', views.fn_bellwether, name = 'fn_bellwether'),
    path('nswcovid/', views.covid, name = 'nswcovid'),
    path('covid_fn_public_transit/', views.fn_public_transit, name = 'fn_public_transit'),
    path('covid_fn_postcode/', views.fn_postcode, name = 'fn_postcode'),
    path('chess/', views.chess, name = 'chess'),

    # Guides
    path('guides/django_help', views.django_help, name = 'django'),
    path('guides/react_help', views.react_help, name = 'react'),
    path('guides/vba_scripts', views.vba_scripts, name = 'vba'),

    #blog
    path('blog', views.blog, name = 'blog'),
    path("tag/<slug:slug>/", views.innertag, name='tagged'),
    path('blog/post/<int:pk>/', blog_post.as_view(), name = 'blog_post'),
]