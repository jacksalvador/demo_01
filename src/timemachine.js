document.addEventListener('DOMContentLoaded', function () {
  const fetchDataButton = document.getElementById('fetch-button');
  const apiDataDiv = document.getElementById('api-data');

  // Replace 'YOUR_API_URL_HERE' with the actual API URL you want to call
  const apiUrl = 'https://apis.openapi.sk.com/tmap/routes/prediction?version=1';

  // Replace 'YOUR_APP_KEY_HERE' with your actual app key
  const appKey = '3oBTY2lRKl35FpTvZ93WA8G6YUAoKtbxmdrz3PY0';

  // Variable to store the total time
  let totalTime = 0;

  // Function to get the current time in the required format
  function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timezoneOffset = now.getTimezoneOffset();
    const timezoneHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
    const timezoneMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
    const timezoneSign = timezoneOffset > 0 ? '-' : '+';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneSign}${timezoneHours}${timezoneMinutes}`;
  }

  // Add an event listener for the 'geocodingComplete' event
  document.addEventListener('geocodingComplete', function (event) {
    // Access the lat and lon values from the event.detail
    var lat = event.detail.lat;
    var lon = event.detail.lon;

    // Prepare the request payload with the current time
    const requestData = {
      routesInfo: {
        departure: {
          name: 'test1',
          lon: '126.896907',
          lat: '37.574989'
        },
        destination: {
          name: 'test2',
          lon: lon,
          lat: lat
        },
        predictionType: 'arrival',
        predictionTime: getCurrentTime() // Set to the current time
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
        // Extract the totalTime from this response
        const responseTotalTime = data.features[0].properties.totalTime;

        // Add the totalTime from this response to the accumulated totalTime
        totalTime += responseTotalTime;

        // Update the webpage with the accumulated totalTime
        apiDataDiv.innerHTML = `Total Time: ${totalTime} seconds`;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });

  fetchDataButton.addEventListener('click', function () {
    // Trigger the geocoding process here, which will eventually dispatch the 'geocodingComplete' event
    // Make sure the geocoding process sets the 'lat' and 'lon' values correctly
    // ...
  });
});
