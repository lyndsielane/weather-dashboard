var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";
var weatherData;
var cityData;

function parseWeatherData(data) {
    var parseWeatherList = {
        lon: data.city.coord.lon,
        lat: data.city.coord.lat,
        days: []
    };

    var todaysDate = moment().format("YYYY-MM-DD");

    data.list.forEach(weatherData => {
        var date = moment(weatherData.dt_txt, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD");

        if (date === todaysDate) {
            return;
        }

        if (!parseWeatherList.days[date]) {
            parseWeatherList.days[date] = {
                temps: [],
                windSpeeds: [],
                humidities: [],
                uvIndex: [],
            }; 
        };

        parseWeatherList.days[date].temps.push(weatherData.main.temp);
        parseWeatherList.days[date].windSpeeds.push(weatherData.wind.speed);
        parseWeatherList.days[date].humidities.push(weatherData.main.humidity);
    });

    return parseWeatherList;
}

$("#search-form").on("submit", async function (e) {
    e.preventDefault();

   var city = $("#city-input").val();
    
    cityData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        //.then(data => parseWeatherData(data))
        //.then(parseWeatherList => calculateAvg(parseWeatherList));

    weatherData = await fetch(`http://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lon=${cityData.coord.lon}&lat=${cityData.coord.lat}&units=imperial&exclude=minutely,alerts,hourly`)
        .then(response => response.json());

    console.log(weatherData);
});