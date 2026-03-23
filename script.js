const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('error-message');

async function getCoordinates(city) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
        return data.results[0];
    }
    throw new Error('City not found');
}

async function getWeather(latitude, longitude) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto`
    );
    return await response.json();
}

const loading = document.getElementById('loading');

async function searchWeather() {
    try {
        const city = cityInput.value.trim();
        if (!city) return alert('Please enter a city name');

        errorMessage.style.display = 'none';
        weatherDisplay.innerHTML = '';
        loading.style.display = 'block';

        const location = await getCoordinates(city);
        const weather = await getWeather(location.latitude, location.longitude);

        loading.style.display = 'none';
        weatherDisplay.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>
            <p>Temperature: ${weather.current.temperature_2m}°C</p>
            <p>Humidity: ${weather.current.relative_humidity_2m}%</p>
            <p>Weather Code: ${weather.current.weather_code}</p>
        `;
    } catch (error) {
        loading.style.display = 'none';
        weatherDisplay.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        errorMessage.style.display = 'block';
        errorMessage.textContent = `${error.message}. Please try again.`;
    }
}

searchBtn?.addEventListener('click', searchWeather);
cityInput?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') searchWeather();
});