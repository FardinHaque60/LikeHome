from django.urls import path
from .views import * # imports all the routes from views, see views/__init__.py
from django.conf import settings

urlpatterns = [
    # authentication related paths
    path('login/', login),
    path('create-account/', create_account),
    path('verify-code/', verify_code),
    path('logout/', logout),

    # session related paths
    path('get-session/', get_session),
    path('get-reservations/', get_reservations),

    # search related paths
    path('search/', search),
    path('get-featured-hotels/', featured_hotels),
    path('get-search-result/', get_search_result),

    # reservation related paths
    path('create-reservation/', create_reservation),
    path('cancel-reservation/', cancel_reservation),
    path('modify-reservation/', modify_reservation),
]