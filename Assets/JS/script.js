var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";
var localStorageName = "cityData";

//calling the search button to start the app functionality. async and await used to ensure each function loads before the next to ensure full application functionality as some of the data is dependent upon others.
$("#search-form").on("submit", async function (e) {
    e.preventDefault();
    //pulls the city entered in the search bar and runs the city weather API for that city.
    var city = $("#city-input").val();
    
    loadCityWeather(city);
});
//functionality for the buttons in the search history to reload the current weather when clicked.
$(document).on("click", ".city-history-button", function(event) {
    loadCityWeather(event.target.value);
});
//this API allows us to learn the latitude and longitude of the searched city
async function loadCityWeather(city) {
    var cityData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json());

    saveCity(cityData.name);

    //The latitude and longitude from the previous API is pushed into the one call weather API, that data is then pulled into a string to use for the forecasts.
    var weatherData = await fetch(`http://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lon=${cityData.coord.lon}&lat=${cityData.coord.lat}&units=imperial&exclude=minutely,alerts,hourly`)
        .then(response => response.json());

    //Two functions are set from here - currentDay which pulls the current day information and ForecastCards which is the data used for the 5-day forecast.
    setCurrentDay(weatherData.current, cityData.name,);
    buildForecastCards(weatherData.daily);
    //Once the data runs, the columns for the visibility for the weather data column is unhidden.
    $("#weather-column").removeClass("hidden");
}
//setting functionality for the searched city history.
function addCityHistory(city) {
    $("#city-history").append(`<button type="button" class="btn btn-secondary mt-3 city-history-button" value="${city}">${city}</button>`);
}
//using the local storage to save the cities as a string and ensuring each city is only saved once, even if it was searched multiple times
function saveCity(city) {
    var savedCities = JSON.parse(localStorage.getItem(localStorageName) || "{}");

    if (!savedCities.cities) {
        savedCities["cities"] = [];
    }

    if (!savedCities.cities.includes(city)) {
        savedCities.cities.push(city);
        addCityHistory(city);
    }

    localStorage.setItem(localStorageName, JSON.stringify(savedCities));
}
//pulling the city history from local storage, still ensuring nothing is duplicated
function loadSavedCities() {
    var savedCities = JSON.parse(localStorage.getItem(localStorageName) || "{}");

    if (!savedCities.cities) {
        return;
    }

    savedCities.cities.forEach(function(city) {
        addCityHistory(city);
    }); 
}

//Pulling the current forecast data and appending it to box in place to hold it.
function setCurrentDay(currentDay, city) {
    $("#city").empty().append(city);
    $("#date").empty().append(moment.unix(currentDay.dt).format("M/DD/YYYY"));
    $("#icon").empty().append(`<img src="http://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png">`);
    $("#temp").empty().append(currentDay.temp);
    $("#wind").empty().append(currentDay.wind_speed);
    $("#humidity").empty().append(currentDay.humidity);
    $("#uvi").empty().append(currentDay.uvi);
    //adding in the uv indicator functionality so the background of the number reflects the uv scale
    var uviColor = "green";

    if (currentDay.uvi >= 3 && currentDay.uvi < 6) {
        uviColor = "yellow";
    } else if (currentDay.uvi >= 6 && currentDay.uvi < 8) {
        uviColor = "orange";
    } else if (currentDay.uvi >= 8 && currentDay.uvi < 11) {
        uviColor = "red";
    } else if (currentDay.uvi >= 11) {
        uviColor = "purple";
    }

    $("#uvi").removeClass().addClass(uviColor);
};
//Cycling through the API array and pulling the 5-day forecast data and building the forecast cards.
function buildForecastCards(weatherData, ) {
    var cards = $("#cards");
    cards.empty();

    for (var i = 1; i < weatherData.length - 2; i++) {
        cards.append(`
            <div class="forecast-card">
                <p class="foredate">${moment.unix(weatherData[i].dt).format("M/DD/YYYY")}</p>
                <p class="foreicon"><img src="http://openweathermap.org/img/wn/${weatherData[i].weather[0].icon}@2x.png"></p>
                <p>Temp: ${weatherData[i].temp.max} &deg;F</p>
                <p>Wind: ${weatherData[i].wind_speed} MPH</p>
                <p>Humidity: ${weatherData[i].humidity} %</p>
            </div>
        `);
    }
}

loadSavedCities();