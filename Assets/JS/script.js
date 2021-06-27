var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";

$("#search-form").on("submit", async function (e) {
    e.preventDefault();

    var city = $("#city-input").val();
    
    var cityData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())

    var weatherData = await fetch(`http://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lon=${cityData.coord.lon}&lat=${cityData.coord.lat}&units=imperial&exclude=minutely,alerts,hourly`)
        .then(response => response.json());

    console.log(weatherData);

    setCurrentDay(weatherData.current, cityData.name);
});

function setCurrentDay(currentDay, city) {

    $("#city").empty().append(city);
    $("#date").empty().append(moment.unix(currentDay.dt).format("YYYY-MM-DD"));
    $("#temp").empty().append(currentDay.temp);
    $("#wind").empty().append(currentDay.wind_speed);
    $("#humidity").empty().append(currentDay.humidity);
    $("#uvi").empty().append(currentDay.uvi);
        
}