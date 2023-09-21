document.addEventListener('DOMContentLoaded', function () {
  const fetchDataButton = document.getElementById('fetch-button');
  const apiDataDiv = document.getElementById('api-data');

  // Replace 'YOUR_API_URL_HERE' with the actual API URL you want to call
  const apiUrl = 'https://apis.openapi.sk.com/tmap/routes/prediction?version=1';

  // Replace 'YOUR_APP_KEY_HERE' with your actual app key
  const appKey = '3oBTY2lRKl35FpTvZ93WA8G6YUAoKtbxmdrz3PY0';

  fetchDataButton.addEventListener('click', function () {
    // Prepare the request payload
    const requestData = {
      routesInfo: {
        departure: {
          name: 'test1',
          lon: '126.97878313064615',
          lat: '37.56554502354465'
        },
        destination: {
          name: 'test2',
          lon: '126.99212121963542',
          lat: '37.56436121826486'
        },
        predictionType: 'arrival',
        predictionTime: '2022-09-10T09:00:22+0900'
      }
    };

    // Make the API request using the Fetch API
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'appKey': appKey
      },
      body: JSON.stringify(requestData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the webpage with the API data
        apiDataDiv.innerHTML = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });
});
