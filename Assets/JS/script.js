var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";

$("#search-form").on("submit", async function (e) {
    e.preventDefault();

    var city = $("#city-input").val();
    
    var cityData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())

    var weatherData = await fetch(`http://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lon=${cityData.coord.lon}&lat=${cityData.coord.lat}&units=imperial&exclude=minutely,alerts,hourly`)
        .then(response => response.json());

    console.log(weatherData);

    setCurrentDay(weatherData.current, cityData.name,);
    buildForecastCards(weatherData.daily);

    $("#weather-column").removeClass("hidden");
});

function setCurrentDay(currentDay, city) {

    $("#city").empty().append(city);
    $("#date").empty().append(moment.unix(currentDay.dt).format("M/DD/YYYY"));
    $("#icon").empty().append(`<img src="http://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png">`);
    $("#temp").empty().append(currentDay.temp);
    $("#wind").empty().append(currentDay.wind_speed);
    $("#humidity").empty().append(currentDay.humidity);
    $("#uvi").empty().append(currentDay.uvi);
        
};

function buildForecastCards(weatherData, ) {
    var cards = $("#cards");
    cards.empty();

    for (var i = 1; i < weatherData.length - 2; i++){
        foreDate = moment.unix(weatherData[i].dt).format("M/DD/YYYY");
        foreIcon = weatherData[i].weather[0].icon;
        foreTemp = weatherData[i].temp.max;
        foreWind = weatherData[i].wind_speed;
        foreHumidity = weatherData[i].humidity;


        cards.append(`
            <div class="forecast-card">
                <p class="foredate">${foreDate}</p>
                <p class="icon"><img src="http://openweathermap.org/img/wn/${foreIcon}@2x.png"></p>
                <p>Temp: ${foreTemp}</p>
                <p>Wind: ${foreWind}</p>
                <p>Humidity: ${foreHumidity}%</p>
            </div>
        `);
    }
}