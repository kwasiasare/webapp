import requests
import json

# Replace with the URL of your Azure Function App endpoint
FUNCTION_APP_URL = "https://webappfuncapp202410.azurewebsites.net/api/HttpTrigger1/shifts"

# Sample test data that mimics the format of shift data
shift_data = {
    "shift_id": "shift-002",
    "location": "Residential Group Home b",
    "date": "2024-11-16",
    "start_time": "08:00 AM",
    "endtime": "04:00 PM",
    "mapStaff": "yes",
    "gender": "male"
}

# Function to test retrieving data from the Azure Function App and storing it in ShiftDB
def test_shift_input(data):
    headers = {
        'Authorization': f'Bearer {os.getenv("ACCESS_TOKEN")}',  # Replace with actual access token
        'Content-Type': 'application/json'
    }

    try:
        # Make a GET request to the Azure Function App
        response = requests.get(FUNCTION_APP_URL, headers=headers)
        
        # Check if the request was successful
        if response.status_code == 200:
            api_data = response.json()
            print(f"Data successfully retrieved: {api_data}")
        else:
            print(f"Failed to retrieve data. Status code: {response.status_code}, Response: {response.text}")
        
        # Make a POST request to store shift data in the Azure Function App
        response = requests.post(FUNCTION_APP_URL, data=json.dumps(data), headers=headers)
        
        # Check if the request was successful
        if response.status_code == 200:
            print(f"Shift data successfully stored: {response.json()}")
        else:
            print(f"Failed to store shift data. Status code: {response.status_code}, Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error occurred during request: {e}")


if __name__ == "__main__":
    # Run the test locally
    # Ensure that you have Python installed in your local environment
    # Install the required packages using: pip install requests
    # Replace FUNCTION_APP_URL with the actual Azure Function URL
    # Then run this script using: python <script_name>.py
    test_shift_input(shift_data)

