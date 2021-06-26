var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";

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
                averages: {
                    temp: 0,
                    windSpeed: 0,
                    humidity: 0,
                    uvIndex: 0,
                }
            }; 
        }

        parseWeatherList.days[date].temps.push(weatherData.main.temp);
        parseWeatherList.days[date].windSpeeds.push(weatherData.wind.speed);
        parseWeatherList.days[date].humidities.push(weatherData.main.humidity);
    });

    return parseWeatherList;
}

function calculateAvg(parseWeatherList) {
    //TODO: add calculations for averages

    return parseWeatherList
}

$("#search-form").on("submit", async function (e) {
    e.preventDefault();

    var city = $("#city-input").val();
    
    var fiveDayForecast = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => parseWeatherData(data))
        .then(parseWeatherList => calculateAvg(parseWeatherList));

    var currentDateData = await fetch(`http://api.openweathermap.org/data/2.5/onecall?&appid=${apiKey}&lon=${fiveDayForecast.lon}&lat=${fiveDayForecast.lat}&units=imperial&exclude=daily,minutely,alerts,hourly`)
        .then(response => response.json());

    console.log(fiveDayForecast.days);
    console.log(currentDateData.current);
});


