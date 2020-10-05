// TURN CITY INTO AN OBJECT?
// city = {
//     temp: "temp",
//     humid: "humid",
//     wind: "wind",
//     UV: "UV"
// }
//##### Unit 06 Homework Summary and Tips #########
// My tips:
//   a. Make sure you can retrieve data via the API for a city, both for the current day and a multi-day forecast (these may need to be two separate API calls)
//   b. Determine how you'll manage the list of cities to the left. When a user enters a city name, after the response is received from OpenWeather, the city name should be added to the list. Be sure to prevent duplicates. You'll need to store the city list in local storage as well, so get that process figured out.
//   c. When the user clicks on a city name, the API query should run again, just as if the user had typed the city in at the top. So maybe the city-typing and the city-clicking should both go to the same function for API lookup... ? 
//   d. Each block if the 5-day forecast is the same thing, just with different data. So think about that.
// 3. Each of the sections above can be broken up into smaller sections as you see fit for work. Break things down as much as you need to. PSEUDOCODE!
// 4. You can always create your functions in advance and build your logic flow before you have the functionality finished. Use comments to help remind you what each function is supposed to do.
// 5. Console.logs are a great way to make sure you're working with the correct data at any point.

$(document).ready(function(){

    $("#searchBtn").on("click", function(){
        // NEED TO CLEAR 5 DAY FORECAST CARD UP HERE FOR THIS TO BE REPEATABLE
       var city = $("input").val();
       var APIKey = "fcb576af35c3fbdedb5fb9ae90dcf378";
       var currWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
       var today = dayjs().format('MMMM D');
       var forecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey
       // This populates the established datafields with information grabbed based on search. It also contains the logic for UV index
       $.ajax({
       url: currWeather,
       method: "GET"
       }).then(function(response) {
           console.log(response.weather[0].icon)
           var myIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + "02d" + ".png")
           console.log(myIcon)
           $("h2").text(city + " " + today).append(myIcon)
           
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

           //this populates the UV index field, and colors the background according to severity of UV exposure
           $.ajax({
           url: UVData,
           method: "GET"
           }).then(function(UVInfo) {
               UVIdx = UVInfo.value
               UVCard = $("#UVIdx")
               UVCard.text("UV index:" +  UVIdx)
               UVCard.removeClass("green yellow orange red purple")// This makes the function repeatable
                
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

       //5 day forecast code goes here
       $.ajax({
        url: forecast,
        method: "GET"
        }).then(function(fiveDay) {
            for (i=0;i<40;i+=8){
                console.log(fiveDay.list[i].dt_txt);
                var longForm = fiveDay.list[i].dt_txt;
                var shortForm = longForm.slice(8,10);
                tempF =  Math.floor((((fiveDay.list[i].main.temp)-273.15)*1.8)+32);

                var oneDay = $("<div>");
                oneDay.addClass("card col-2");
                var date = $("<p>").text(shortForm);
                var temp = $("<p>").text("Temp: " + tempF);
                var humid = $("<p>").text("Humidity: " + fiveDay.list[i].main.humidity);
                oneDay.append(date).append(temp).append(humid);
                $("#forecast").append(oneDay);
            }
        })

        var previousSearch = $("<button>");
        previousSearch.addClass("card-body");
        previousSearch.text(city);
        $("#history").append(previousSearch);
        previousSearch.on("click", function(){
            console.log("click")
            // Where should storage stuff be set?
            // Grab local storage stuff?

            // THIS MIGHT BE EASIER IF I TURN THE CITY INTO AN OBJECT WITH KEYS FOR TEMP/HUMID ETC
            
        })
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
