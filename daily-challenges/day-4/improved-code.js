
// Select HTML elements
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchBtn");
const weatherDisplay = document.getElementById("weather");
const descriptionDisplay = document.getElementById("description");
const errorDisplay = document.getElementById("error");

// Replace this with your actual weather API endpoint
const WEATHER_API_URL = "YOUR_WEATHER_API_ENDPOINT";

// Validate the user's input
function validateCity(city) {
    if (!city || city.trim() === "") {
        throw new Error("Please enter a city name.");
    }

    return city.trim();
}

// Fetch weather information
async function fetchWeather(city) {
    const url = `${WEATHER_API_URL}?city=${encodeURIComponent(city)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
    }

    const weatherData = await response.json();

    if (
        weatherData.temperature === undefined ||
        !weatherData.description
    ) {
        throw new Error("Weather information is incomplete.");
    }

    return weatherData;
}

// Display weather information
function displayWeather(weatherData) {
    weatherDisplay.textContent =
        `Temperature: ${weatherData.temperature}`;

    descriptionDisplay.textContent =
        `Weather: ${weatherData.description}`;
}

// Display errors
function displayError(message) {
    errorDisplay.textContent = message;
}

// Handle the search process
async function handleWeatherSearch() {
    errorDisplay.textContent = "";

    try {
        const city = validateCity(cityInput.value);

        const weatherData = await fetchWeather(city);

        displayWeather(weatherData);

    } catch (error) {
        displayError(error.message);
        console.error("Weather search failed:", error);
    }
}

// Listen for button clicks
searchButton.addEventListener("click", handleWeatherSearch);
