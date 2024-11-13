from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .session import get_current_user
from ..models import Reservation, Profile
from django.conf import settings
from django.db.models import Q
from datetime import datetime
from django.core.mail import send_mail
from ..serializers import ReservationsSerializer
import math

@api_view(['GET'])
def get_reservations(request):
    reservations = Reservation.objects.filter(user=get_current_user())
    reservation_data = ReservationsSerializer(reservations, many=True).data

    return Response({"reservations": reservation_data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_reservation(request):
    payment_details = request.data['paymentDetails']
    reservation_details = request.data['reservationDetails']
    hotel_name, room_name, nights, rate, total_price = reservation_details['hotel'], reservation_details['room'], reservation_details['nights'], float(reservation_details['price']), reservation_details['totalPrice']
    check_in, check_out, adults, children, address, city =  reservation_details['checkIn'], reservation_details['checkOut'], reservation_details['adults'], reservation_details['children'], reservation_details['address'], reservation_details['city']
    # hotel related fields
    description, phone_number, website, email, images = reservation_details['description'], reservation_details['phone'], reservation_details['website'], reservation_details['email'], reservation_details['images']
    # TODO look to save payment details in future
    card_number, card_name, exp_date, cvv = payment_details['cardNum'], payment_details['cardName'], payment_details['expDate'], payment_details['CVV']
    # TODO use reward points if wanted
    # add to reward points 
    updated_reward_points = reservation_details['newRewards'] # overwrite old reward points in profile with this, this value takes into account applied rewards asw
    rewards_earned = reservation_details['rewardsEarned'] # reward points earned from this reservation
    rewards_used = reservation_details['rewardsApplied'] # reward points used for this reservation

    try:
        # update reward points
        user = get_current_user()
        user_profile = Profile.objects.get(user=user)
        user_profile.reward_points = updated_reward_points
        user_profile.save()
        # save reservation to db
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
            city=city,
            description=description,
            phone_number=phone_number,
            website=website,
            images=images,
            email=email,
            rewards_earned=rewards_earned,
            rewards_applied=rewards_used
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
            "Rate: $" + str(rate) + "\n" +
            "Rewards Earned: " + str(rewards_earned) + "\n" +
            "Rewards Used: " + str(rewards_used) + "\n" +
            "Total Price: $" + str(total_price) + "\n\n" +
            "We hope you enjoy your stay!\n\n" +
            "Sincerely,\n"
            "Team Nexus"
        )
        subject = "Thanks for Booking with LikeHome! Your Booking Details."
        send_email(user.email, subject, message)
    except Exception as e:
        return Response({'status': 'Error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def cancel_reservation(request):
    reservation_id = request.data['reservationId']
    try:
        user = get_current_user()
        reservation = Reservation.objects.get(id=reservation_id)
        # delete reservation
        reservation.delete()
        message = (
f'''Hello {user.first_name} \n
Your reservation with LikeHome has been cancelled. If you have any questions, please contact us at nexus.likehome@gmail.com.\n\n
Booking Details:\n
Hotel: {reservation.hotel_name}
Room: {reservation.room_name}
Check-In: {reservation.check_in}
Check-Out: {reservation.check_out}
Nights: {reservation.nights}
Adults: {reservation.adults}
Children: {reservation.children}
Rate: ${reservation.rate}
Total Price Refunded: ${reservation.total_price}\n
Forfeited Reward Points: {reservation.rewards_applied}\n
Sincerely,
Team Nexus'''
        )
        subject = "Your Reservation with LikeHome has been Cancelled."
        send_email(user.email, subject, message)
    except Exception as e:
        return Response({'status': 'Error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def modify_reservation(request):
    print("modify request received with data: ", request.data)
    user = get_current_user()
    payment_details = request.data['paymentDetails']
    reservation_details = request.data['reservationDetails']
    reservation_id = reservation_details['reservationId']
    check_in, check_out, nights, price = reservation_details['checkIn'], reservation_details['checkOut'], reservation_details['nights'], reservation_details['totalPrice']
    difference_paid = reservation_details['differencePaid']
    reservation = Reservation.objects.get(id=reservation_id)
    # continue modifying reservation
    reservation.check_in = check_in
    reservation.check_out = check_out
    reservation.nights = nights
    reservation.total_price = price
    reservation.rewards_earned = 0 # set rewards earned from this hotel to 0 since forfeit
    reservation.save()
    message = (
f'''Hello {user.first_name} \n
Your reservation with LikeHome has been modified. If you have any questions, please contact us at nexus.likehome@gmail.com.\n\n
Booking Details:\n
Hotel: {reservation.hotel_name}
Room: {reservation.room_name}
Check-In: {reservation.check_in}
Check-Out: {reservation.check_out}
Nights: {reservation.nights}
Adults: {reservation.adults}
Children: {reservation.children}
Rate: ${reservation.rate}
Total Price: ${reservation.total_price}\n
Difference Paid: ${difference_paid}\n
Forfeited Reward Points: {reservation.rewards_applied}\n
Sincerely,
Team Nexus
'''
    )
    subject = "Your Reservation with LikeHome has been Modified."
    send_email(user.email, subject, message)

    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def check_conflict(request):
    check_in, check_out = request.data['checkIn'], request.data['checkOut']
    hotel_name = request.data['hotelName']
    check_in = datetime.strptime(check_in, "%Y-%m-%d").date()
    check_out = datetime.strptime(check_out, "%Y-%m-%d").date()
    print(check_in, check_out)

    user_reservations = Reservation.objects.filter(user=get_current_user())
    user_reservations = user_reservations.exclude(hotel_name=hotel_name)
    # finds overlapping records
    overlapping_records = user_reservations.filter(
        Q(check_in__lte=check_out) & Q(check_out__gte=check_in)
    )

    if (overlapping_records.count() > 0):
        return Response({'status': 'Conflict'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

def send_email(email, subject, message):
    email_from = settings.EMAIL_HOST_USER
    recipient = [email]
    try:
        send_mail(subject, message, email_from, recipient)
    except Exception as e:
        return Exception(e)