from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .session import get_current_user
from ..models import Reservation
from django.conf import settings
from django.core.mail import send_mail

@api_view(['POST'])
def create_reservation(request):
    payment_details = request.data['paymentDetails']
    reservation_details = request.data['reservationDetails']
    hotel_name, room_name, nights, rate, total_price = reservation_details['hotel'], reservation_details['room'], reservation_details['nights'], float(reservation_details['price']), reservation_details['totalPrice']
    check_in, check_out, adults, children, address, city =  reservation_details['checkIn'], reservation_details['checkOut'], reservation_details['adults'], reservation_details['children'], reservation_details['address'], reservation_details['city']
    # TODO look to save payment details in future
    card_number, card_name, exp_date, cvv = payment_details['cardNum'], payment_details['cardName'], payment_details['expDate'], payment_details['CVV']

    try:
        user = get_current_user()
        reservation = Reservation.objects.create(
            user=user, 
            hotel_name=hotel_name, 
            room_name=room_name, 
            nights=nights, 
            rate=rate, 
            total_price=total_price, 
            check_in=check_in, 
            check_out=check_out, 
            adults=adults, 
            children=children, 
            address=address, 
            city=city
        )

        message = (
            "Hello " + user.first_name + ",\n\n" +
            "Thank you for booking with LikeHome! Your reservation details are as follows: \n\n" +
            "Hotel: " + hotel_name + "\n" +
            "Address: " + address + ", " + city + "\n" +
            "Room: " + room_name + "\n" +
            "Check-In: " + str(check_in) + "\n" +
            "Check-Out: " + str(check_out) + "\n" +
            "Adults: " + str(adults) + "\n" +
            "Children: " + str(children) + "\n" +
            "Rate: " + str(rate) + "\n" +
            "Total Price: $" + str(total_price) + "\n\n" +
            "We hope you enjoy your stay!\n\n" +
            "Sincerely,\n"
            "Team Nexus"
        )
        send_email(user.email, message)
    except Exception as e:
        return Response({'status': 'Error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'status': 'OK'}, status=status.HTTP_200_OK)


def send_email(email, message):
    subject = "Thanks for Booking with LikeHome! Your Booking Details."
    email_from = settings.EMAIL_HOST_USER
    recipient = [email]
    try:
        send_mail(subject, message, email_from, recipient)
    except Exception as e:
        return Exception(e)