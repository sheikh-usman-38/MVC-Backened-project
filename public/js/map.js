
  
//     // Initialize the map
//     const map = L.map('map').setView([51.505, -0.09], 13); // Default location (london)
// // Islamabad coordinates :33.6844, 73.0479  [longitute,latitude]
//     // Add OpenStreetMap tiles (No API key required)
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors',
//       maxZoom: 19
//     }).addTo(map);

//     // Get user's location
//     navigator.geolocation.getCurrentPosition((position) => {
//       const userLocation = [position.coords.latitude, position.coords.longitude];
//       map.setView(userLocation, 13); // Center map on user's location

//       // Add a marker for the user's location
//       L.marker(userLocation).addTo(map).bindPopup('You are here!').openPopup();
//     }, () => {
//       alert('Unable to retrieve your location.');
//     });
   

const map = L.map('map').setView([30.2864 , 71.9320], 13); // Default location: london

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

// Function to handle user-entered location
function setLocation() {
  const location = document.getElementById('locationInput').value;

  if (!location) {
    alert('Please enter a location.');
    return;
  }

  // Fetch coordinates using Nominatim API
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        alert('Location not found. Please try again.');
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      // Update map view
      map.setView([lat, lon], 13);
      L.marker([lat, lon]).addTo(map).bindPopup(`Location: ${location}`).openPopup();
    })
    .catch(error => {
      console.error('Error fetching location:', error);
      alert('Unable to fetch location. Please try again later.');
    });
}
module.exports = { updateMap };
