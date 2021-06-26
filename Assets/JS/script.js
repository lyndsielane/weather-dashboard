var apiKey = "2b99b21d7b96e0eb1368248ef3f011fd";
var cityId = "Atlanta";
var url = "http://api.openweathermap.org/data/2.5/weather?q=" + cityId + "&appid=" + apiKey;

function parseWeatherData(data) {
    var parseWeatherList = { days: []};

    data.list.forEach(weatherData => {
        var date = moment(weatherData.dt_txt, "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD");

        if (!parseWeatherList.days[date]) {
            parseWeatherList.days[date] = {
                temp: [],
                windSpeed: [],
                humidity: [],
                uvIndex: [],
                averages: {
                    temp: 0,
                    windSpeed: 0,
                    humidity: 0,
                    uvIndex: 0,
                }
            }; 
        }

    parseWeatherList.days[date].temps.push(weatherData.main.temp);
    parseWeatherList.days[date].windSpeed.push(weatherData.wind.speed);
    });

    return parseWeatherList;
    }

function calculateAvg(parseWeatherList) {
    //TODO: add calculations for averages

    return parseWeatherList
}

fetch(url)
    .then(response => response.json())
    .then(data => parseWeatherData(data))
    .then(parseWeatherList => calculateAvg(parseWeatherList))
    .then(calculatedWeather => console.log(calculatedWeather));
