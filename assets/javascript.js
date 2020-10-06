$(document).ready(function(){
    var x=0;
    var searches = [];

    function grabThatCast(){
        // NEED TO CLEAR 5 DAY FORECAST CARD UP HERE FOR THIS TO BE REPEATABLE, use empty()?
       var city = $("input").val();
       var APIKey = "fcb576af35c3fbdedb5fb9ae90dcf378";
       var currWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
       var today = dayjs().format('MMMM D');
       var forecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
       // This populates the established datafields with information grabbed based on search. It also contains the logic for UV index
       $.ajax({
       url: currWeather,
       method: "GET"
       }).then(function(response) {

            
            // SET THIS UP SO IT FEEDS INTO A CITY OBJECT, WHICH IS THEN PUSHED TO THE SEARCH ARRAY
           var myIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
           $("h2").text(city + " " + today).append(myIcon);
           
           var tempK = response.main.temp;
           var tempF = Math.floor(((tempK-273.15)*1.8)+32);
           var humidity = response.main.humidity;
           var windSpeed = response.wind.speed;
           $("#temperature").text("Temperature: " + tempF);
           $("#humidity").text("Humidity: " + humidity);
           $("#windSpeed").text("Wind Speed: " + windSpeed);
           var lat = response.coord.lat;
           var lon = response.coord.lon;
           var UVIdx;

           var UVData = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

           // This populates the UV index field, and colors the background according to severity of UV exposure
           $.ajax({
           url: UVData,
           method: "GET"
           }).then(function(UVInfo) {
               UVIdx = UVInfo.value;
               UVCard = $("#UVIdx");
               UVCard.text("UV index:" +  UVIdx);
               UVCard.removeClass("green yellow orange red purple");// This makes the function repeatable
                
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
           });
           var search = {
            num: x,
            name: city,
            temp: tempF,
            humid: humidity,
            wind: windSpeed,
            UV: UVIdx,
            };
            searches.push(search);
            console.log(search);
            console.log(searches);
       });

       // 5 day forecast code goes here
       $.ajax({
        url: forecast,
        method: "GET"
        }).then(function(fiveDay) {
            var cityCast = $("<div>");
            cityCast.addClass("col-1 card");
            cityCast.text((city).toUpperCase());
            $("#forecast").append(cityCast);
            for (i=0;i<40;i+=8){
                var foreIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + fiveDay.list[i].weather[0].icon + ".png");
                
                var longForm = fiveDay.list[i].dt_txt;
                var shortForm = longForm.slice(8,10);
                tempF =  Math.floor((((fiveDay.list[i].main.temp)-273.15)*1.8)+32);

                var oneDay = $("<div>");
                oneDay.addClass("card col-2");
                var date = $("<p>").text(shortForm).append(foreIcon);
                var temp = $("<p>").text("Temp: " + tempF);
                var humid = $("<p>").text("Humidity: " + fiveDay.list[i].main.humidity);
                oneDay.append(date).append(temp).append(humid);
                $("#forecast").append(oneDay);
            };
        });
       


        x++;
        
        var previousSearch = $("<button>");
        previousSearch.addClass("card-body prevSearch");
        previousSearch.text(city);
        $("#history").append(previousSearch);
    };
    $("#searchBtn").on("click", grabThatCast);
    var prevSearch = $(".prevSearch");
    prevSearch.on("click", function(){
        savedID = $(this).text();
        console.log(savedID);

    });
});