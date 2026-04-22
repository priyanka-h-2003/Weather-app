
// STEP 1: Your API Key
// Sign up free at https://openweathermap.org
// Then replace the string below with your key

const API_KEY = "812ab0ac9fb672f2ef85ec868dd99b3a";

// Base URL for the OpenWeatherMap API
// "units=metric" gives us Celsius instead of Fahrenheit
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


// STEP 2: Grab HTML elements by their IDs
// We'll use these to read input and update the page

const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const errorMsg    = document.getElementById("errorMsg");

const cityName    = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity    = document.getElementById("humidity");
const windSpeed   = document.getElementById("windSpeed");



// STEP 3: Listen for the Search button click
// When user clicks "Search", call getWeather()

searchBtn.addEventListener("click", function () {
  getWeather();
});

// Also allow pressing "Enter" key in the input box
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});



// STEP 4: Main function — fetch weather data
// This runs when user clicks Search

async function getWeather() {

  // Read whatever the user typed into the input box
  const city = cityInput.value.trim(); // .trim() removes extra spaces

  // If the input is empty, don't do anything
  if (city === "") return;

  // Hide previous results and errors while loading
  weatherCard.classList.add("hidden");
  errorMsg.classList.add("hidden");

  // Build the full API URL
  // Example: https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY&units=metric
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  // STEP 5: Call the API using fetch()
  // fetch() sends a request to the URL and waits for a response
  // "await" pauses here until we get the response

  try {
    const response = await fetch(url);

    // If city not found, the API returns status 404
    if (!response.ok) {
      showError(); // Show error message
      return;
    }

    // Convert the response to a JavaScript object (JSON)
    const data = await response.json();

    // Pass the data to our display function
    displayWeather(data);

  } catch (error) {
    // If something goes wrong (no internet, etc.)
    showError();
    console.error("Error fetching weather:", error);
  }
}



// STEP 6: Display the weather data on the page
// "data" is the JSON object we got from the API

function displayWeather(data) {

  // --- City name + Country code ---
  // data.name = "London", data.sys.country = "GB"
  cityName.textContent = `${data.name}, ${data.sys.country}`;

  // --- Temperature ---
  // data.main.temp gives temperature in Celsius (because of units=metric)
  // Math.round() removes decimals: 21.6 → 22
  temperature.textContent = `${Math.round(data.main.temp)}°C`;

  // --- Weather description ---
  // data.weather[0].description = "broken clouds"
  description.textContent = data.weather[0].description;

  // --- Weather icon ---
  // OpenWeatherMap gives us an icon code like "10d" (day rain)
  // We build the full icon URL from that code
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  // --- Humidity ---
  // data.main.humidity = 72 (means 72%)
  humidity.textContent = `${data.main.humidity}%`;

  // --- Wind Speed ---
  // data.wind.speed comes in meters/second
  // Multiply by 3.6 to convert to km/h, then round
  const windKmh = Math.round(data.wind.speed * 3.6);
  windSpeed.textContent = `${windKmh} km/h`;

  // Show the weather card (remove the "hidden" class)
  weatherCard.classList.remove("hidden");
}



// STEP 7: Show error message
// Called when city isn't found or request fails
function showError() {
  errorMsg.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}