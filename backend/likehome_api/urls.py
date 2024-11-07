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
    path('check-conflict/', check_conflict),

    # watchlist related paths
    path('add-to-watchlist/', add_to_watchlist),
    path('remove-from-watchlist/', remove_from_watchlist),
    path('is-watchlist/', is_watchlist),
    path('get-watchlist/', get_watchlist),

    # currency related paths
    path('get-currency-list/', get_currency_list),
    path('currency-convert/', currency_convert),

    # chatbot related paths
    path('send-message/', generate_response),
    path('get-messages/', get_messages),
    path('clear-chat/', clear_chat),
]