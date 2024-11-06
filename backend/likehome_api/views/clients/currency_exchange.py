import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

def get_currency_exchange_rate(from_currency, to_currency):
    try:
        # Correct URL format to fetch data for the base currency file
        url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{from_currency}.json"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception if the response is not 200
        
        data = response.json()[from_currency]
        
        # Extract the exchange rate for the target currency
        rate = data[to_currency]
        if rate:
            return rate
        else:
            print(f"Exchange rate from {from_currency.upper()} to {to_currency.upper()} not found.")
            return None
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP error occurred: {errh}")
    except Exception as err:
        print(f"An error occurred: {err}")

# Define a function to convert currency
def convert_currency(amount, from_currency, to_currency):
    rate = get_currency_exchange_rate(from_currency, to_currency)
    if rate:
        return amount * rate
    else:
        print("Could not retrieve exchange rate.")
        return None

# if __name__ == "__main__":
#     print("Welcome to the Currency Exchange Tool!")
    
#     # Get user input for amount and currency codes
#     amount = float(input("Enter the amount to convert: "))
#     from_currency = input("Enter the currency code you are converting from (e.g., 'usd'): ").lower()
#     to_currency = input("Enter the currency code you are converting to (e.g., 'eur'): ").lower()
    
#     # Perform conversion
#     converted_amount = convert_currency(amount, from_currency, to_currency)
#     if converted_amount:
#         print(f"{amount} {from_currency.upper()} is equal to {converted_amount:.2f} {to_currency.upper()}.")
