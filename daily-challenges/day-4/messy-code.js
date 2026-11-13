
document.getElementById("searchBtn").addEventListener("click", function() {
    let city = document.getElementById("cityInput").value;

    if (city == "") {
        alert("Enter a city");
    } else {
        fetch("YOUR_WEATHER_API_ENDPOINT?city=" + city)
        .then(response => response.json())
        .then(data => {
            document.getElementById("weather").innerHTML =
                "Temperature: " + data.temperature;

            document.getElementById("description").innerHTML =
                "Weather: " + data.description;
        })
        .catch(error => console.log(error));
    }
});
