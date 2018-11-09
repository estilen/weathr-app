var ApiUrl = function(city, amountOfDays, units) {
  this.city = city,
  this.amountOfDays = amountOfDays,
  this.units = units,
  this.baseUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?",
  this.apiKey = "***REMOVED***",
  this.build = function() {
    var params = {
      "q": this.city,
      "cnt": this.amountOfDays,
      "units": this.units,
      "appid": this.apiKey,
      "mode": "xml"
    };
    return encodeURI(this.baseUrl + this.attachParameters(params));
  }
}

ApiUrl.prototype.attachParameters = function(params) {
  var query = [];
  for (var p in params) {
    query.push(p + '=' + params[p]);
  }
  return query.join('&');
}

function convertDates(dates) {
  let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  let convertedDates = [];
  for (var i = 0; i < dates.length; i++) {
    let dateArr = dates[i].split("-")
    let date = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    convertedDates.push(week[date.getDay()]);
  }
  return convertedDates;
}

function displayForecast(forecast) {
  $("forecast-header").innerHTML = "Weather for " + forecast.city + ", " + forecast.country;
  let tempChart = $("temperature-chart").getContext("2d");
  let miscChart = $("misc-chart").getContext("2d");
  let minTemp = [];
  let maxTemp = [];
  let avgTemp = [];
  let precipitation = [];
  let humidity = [];
  let windSpeed = [];
  for (let arr in forecast.weather) {
    let min = forecast.weather[arr].minTemp;
    let max = forecast.weather[arr].maxTemp;
    let avg = (parseFloat(min) + parseFloat(max)) / 2;
    let rain = forecast.weather[arr].precipitation;
    let hum = forecast.weather[arr].humidity;
    let wind = forecast.weather[arr].windSpeed;
    minTemp.push(Math.round(min));
    maxTemp.push(Math.round(max));
    avgTemp.push(Math.round(avg));
    precipitation.push(Math.round(rain));
    humidity.push(Math.round(hum));
    windSpeed.push(wind)
  }
  let yAxisLabel = "degrees ";
  if (forecast.units === "metric") {
    yAxisLabel += "celsius"
  } else {
    yAxisLabel += "fahrenheit"
  }
  let xAxisLabel = convertDates(Object.keys(forecast.weather)).slice(2);
  let temperatureChart = new Chart(tempChart, {
    type: "bar",
    data: {
      labels: ["Today", "Tomorrow"].concat(xAxisLabel),
      datasets: [{
        label: "Average temperature",
        data: avgTemp,
        type: "line",
        borderColor: "#ff6384",
        backgroundColor: "#fff",
        fill: false
      }, {
          label: "Precipitation",
          data: precipitation,
          type: "line",
          borderColor: "#48ed4d",
          fill: false
      }, {
        label: "Max temperature",
        data: maxTemp,
        backgroundColor: "#f79e31"
      }, {
        label: "Min temperature",
        data: minTemp,
        backgroundColor: "#4bc0c0"
      }]
    },
    options: {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: yAxisLabel
          },
          ticks: {
            beginAtZero: true,
            stepSize: 1
          }
        }]
      }
    }
  });
  let chart = new Chart(miscChart, {
    type: "bar",
    data: {
      labels: ["Today", "Tomorrow"].concat(xAxisLabel),
      datasets: [{
        label: "Humidity",
        data: humidity,
        backgroundColor: "#6beefa"
      }, {
        label: "Wind Speed",
        data: windSpeed,
        backgroundColor: "#ffb3b3"
      }]
    },
    options: {
      scales: {
          ticks: {
            beginAtZero: true
          }
        }
      }
    });
}

function parseForecast(data, unitsValue) {
  var forecast = {};
  var city = data.getElementsByTagName("name")[0].firstChild.nodeValue;
  var country = data.getElementsByTagName("country")[0].firstChild.nodeValue;
  var lat = data.getElementsByTagName("location")[1].getAttribute("latitude");
  var lon = data.getElementsByTagName("location")[1].getAttribute("longitude");
  forecast.city = city;
  forecast.country = country;
  forecast.latitude = lat;
  forecast.longitude = lon;
  forecast.units = unitsValue;
  forecast.weather = {};
  var days = data.getElementsByTagName("time");
  for (var i = 0; i < days.length; i++) {
    var day = days[i]
    var date = day.getAttribute("day");
    var min = day.getElementsByTagName("temperature")[0].getAttribute("min");
    var max = day.getElementsByTagName("temperature")[0].getAttribute("max");
    var rain = day.getElementsByTagName("precipitation")[0].getAttribute("value");
    var hum = day.getElementsByTagName("humidity")[0].getAttribute("value");
    var windSpeed = day.getElementsByTagName("windSpeed")[0].getAttribute("mps");
    var rainChance = day.getElementsByTagName("symbol")[0].getAttribute("name");
    if (!rain) {
      rain = "0";
    }
    forecast.weather[date] = {
      minTemp: min,
      maxTemp: max,
      humidity: hum,
      precipitation: rain,
      windSpeed: windSpeed,
      rainChance: rainChance
    }
  };
  displayForecast(forecast);
}

function getXmlResponse(url, callback, unitsValue) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        callback(request.responseXML, unitsValue);
      } else if (request.status == 404) {
        displayModal("Cannot find the requested city.");
      } else if (request.status == 500) {
        displayModal("Cannot request the forecast at this time.");
      }
    }
  };
  request.open("GET", url, true);
  request.send();
}

function getForecast() {
  // var city = $("city");
  if (city.value === "") {
    displayModal("Please enter a city.");
  } else {
    if (units.checked) {
      var unitsValue = "imperial";
    } else {
      var unitsValue = "metric";
    }
    var url = new ApiUrl(city.value, 7, unitsValue);
    getXmlResponse(url.build(), parseForecast, unitsValue);
  }
}
