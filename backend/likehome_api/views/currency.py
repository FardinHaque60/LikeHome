from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .clients import *

@api_view(['GET'])
def get_currency_list(request):
    try:
        currencies = currency_list()
        return Response(currencies, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error retrieving currency list'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def currency_convert(request):
    from_currency, to_currency = request.data['fromCurrency'], request.data['toCurrency']

    try: 
        rate = convert_currency(from_currency, to_currency)
        return Response({'rate': rate}, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'Error converting amount'}, status=status.HTTP_400_BAD_REQUEST)