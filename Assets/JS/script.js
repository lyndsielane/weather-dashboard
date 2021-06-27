var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";
var localStorageName = "cityData";

//uses the search button click as the action to kick off the app functionality - waits for the remaining functions to run and prevents a default page reload.
$("#search-form").on("submit", async function (e) {
    e.preventDefault();
    //pulls the city entered in the search bar and runs the city weather API for that city. Also adds the city to local Storage.
    var city = $("#city-input").val();
    
    loadCityWeather(city);
});

$(document).on("click", ".city-history-button", function(event) {
    loadCityWeather(event.target.value);
});

async function loadCityWeather(city) {
    var cityData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json());

    saveCity(cityData.name);

    //The latitude and longitude from the previous API is  pushed into the one call weather API, that data is then pulled into a string to use.
    var weatherData = await fetch(`http://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lon=${cityData.coord.lon}&lat=${cityData.coord.lat}&units=imperial&exclude=minutely,alerts,hourly`)
        .then(response => response.json());

    //Two functions are set from here - currentDay which pulls the current day information and ForecastCards which is the data used for the 5-day forecast.
    setCurrentDay(weatherData.current, cityData.name,);
    buildForecastCards(weatherData.daily);
    //Once the data runs, the columns for the visibility for the weather data column is unhidden.
    $("#weather-column").removeClass("hidden");
}

function addCityHistory(city) {
    $("#city-history").append(`<button type="button" class="btn btn-info mt-3 city-history-button" value="${city}">${city}</button>`);
}

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