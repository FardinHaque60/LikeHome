import requests

def currency_list() -> list:
    try:
        url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception if the response is not 200
        response = response.json()
        list_form = []
        for i in response:
            # only return currencies with 3 letter codes
            if len(i) == 3:
                list_form.append(f"{i} ({response[i]})")
        return list_form
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP error occurred: {errh}")
    except Exception as err:
        print(f"An error occurred: {err}")

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

# Define a function to convert currency and return the exchange rate
def convert_currency(from_currency, to_currency):
    rate = get_currency_exchange_rate(from_currency.lower(), to_currency.lower())
    if rate:
        return rate
    else:
        print("Could not retrieve exchange rate.")
        return None