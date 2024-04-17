import requests
import json

url = 'https://us-states.p.rapidapi.com/all'
headers = {
    'X-RapidAPI-Key': 'd2723e7092msh73570b71c395d9cp1cc331jsn6fc6046677f4',  # Replace with your actual API key
    'X-RapidAPI-Host': 'us-states.p.rapidapi.com'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    with open('states_all.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print('Data has been written to states_data.json')
else:
    print(f'Failed to fetch data: {response.status_code}')
