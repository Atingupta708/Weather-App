const apiKey = '1e3c0e8738566e37de62d07361c8affa'; 
const defaultCity = 'Delhi';

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value || defaultCity;
    fetchWeatherData(city);
});

function fetchWeatherData(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ]).then(([currentWeatherData, forecastData]) => {
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    }).catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    });
}

function displayCurrentWeather(data) {
    const weatherCondition = data.weather[0].description;
    const temperature = `${Math.round(data.main.temp)}°C`;
    const humidity = `Humidity: ${data.main.humidity}%`;
    const windSpeed = `Wind Speed: ${Math.round(data.wind.speed)} m/s`;
    const dateTime = `Date & Time: ${new Date(data.dt * 1000).toLocaleString()}`;

    document.getElementById('weatherCondition').textContent = `Weather Condition: ${weatherCondition}`;
    document.getElementById('temperature').textContent = `Temperature: ${temperature}`;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('windSpeed').textContent = windSpeed;
    document.getElementById('dateTime').textContent = dateTime;
}

function displayForecast(data) {
    const forecastTableBody = document.querySelector('#forecastTable tbody');
    forecastTableBody.innerHTML = ''; // Clear existing rows

    data.list.forEach(item => {
        if (item.dt_txt.includes('12:00:00')) {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            const condition = item.weather[0].description;
            const temperature = `${Math.round(item.main.temp)}°C`;
            const humidity = `${item.main.humidity}%`;
            const windSpeed = `${Math.round(item.wind.speed)} m/s`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${condition}</td>
                <td>${temperature}</td>
                <td>${humidity}</td>
                <td>${windSpeed}</td>
            `;
            forecastTableBody.appendChild(row);
        }
    });
}

// Fetch weather data for default city on load
fetchWeatherData(defaultCity);
