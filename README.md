## Weather Dashboard

* Upon opening the Weather Dashboard, the user is presented with a simple  header title and a side column to search for a city. 
* Upon entering a city name into the search bar and hitting the search button, the data connected to that city pulls from the Open Weather API in a convenient format for the user. 
* The top right displays gives current conditions for the selected city including the current condition, temperature, wind, humidity, and UVI.
* Beneath the current conditions display is a 5-day forecast displayed in separate cards to show the predicted condition, temperature, wind, and humidity.
* All past searched cities display beneath the search bar for convenience to pull the weather again at a later time. 
* The weather forecasts all have a corresponding icon representing the weather condition. 
* I used two separate API's from Open WEather to enable all of the features. The one call API gave me the data I needed, but required latitude and longitude search parameters. I was able to use a city based API for the search bar that gave the corresponding latitude and longitude, which I then pass into the one call API to pull the weather data. This allows the user to search by a city name. I also had to add in some features to my JS functions to ensure the city information was pulled and in place before my second API ran. I was able to use async and await to ensure the information pulls and passes through as needed and the site functions as required and quickly. 