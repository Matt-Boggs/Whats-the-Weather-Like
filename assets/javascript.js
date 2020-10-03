$(document).ready(function(){
    $("#searchBtn").on("click", function(){
       var city = $("input").val();
       var APIKey = "fcb576af35c3fbdedb5fb9ae90dcf378";
       var currWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
       var today = dayjs().format('MMMM D');

       $.ajax({
       url: currWeather,
       method: "GET"
       }).then(function(response) {
           console.log(response);
           $("h2").text(city + " " + today)
           var tempK = response.main.temp;
           var tempF = Math.floor(((tempK-273.15)*1.8)+32);
           var humidity = response.main.humidity
           var windSpeed = response.wind.speed
           $("#temperature").text("Temperature: " + tempF)
           $("#humidity").text("Humidity " + humidity)
           $("#windSpeed").text("Wind Speed: " + windSpeed)
           var lat = response.coord.lat
           var lon = response.coord.lon
           var UVIdx

           var UVData = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

           $.ajax({
           url: UVData,
           method: "GET"
           }).then(function(UVInfo) {
               UVIdx = UVInfo.value
               UVCard = $("#UVIdx")
               UVCard.text(UVIdx)
                
               if (UVIdx<2.5){
                //green
                UVCard.addClass("green");
               } else if (UVIdx>2.5 && UVIdx<5.5){
                //yellow
                UVCard.addClass("yellow");
               } else if (UVIdx>5.5 && UVIdx<7.5){
                //orange
                UVCard.addClass("orange");
               } else if (UVIdx>7.5 && UVIdx<10.5){
                //red
                UVCard.addClass("red");
               } else if (UVIdx>10.5){
                //purple
                UVCard.addClass("purple");
               }
               
           })
       });
   });
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
});
