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

function displayForecast(forecast) {
  $("forecast-header").innerHTML = "Weather for " + forecast.city + ", " + forecast.country;
  let chart = $("temperature-chart").getContext("2d");
  let minTemp = [];
  let maxTemp = [];
  let avgTemp = [];
  for (let arr in forecast.weather) {
    let min = forecast.weather[arr].minTemp;
    let max = forecast.weather[arr].maxTemp;
    let avg = (parseFloat(min) + parseFloat(max)) / 2;
    minTemp.push(Math.round(min));
    maxTemp.push(Math.round(max));
    avgTemp.push(Math.round(avg));
  }
  let temperatureChart = new Chart(chart, {
    type: "bar",
    data: {
      labels: Object.keys(forecast.weather),
      datasets: [{
        label: "Average temperature",
        data: avgTemp,
        type: "line",
        borderColor: "#ff6384",
        backgroundColor: "#fff",
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
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "degrees celsius"
          },
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function parseForecast(data) {
  var forecast = {};
  var city = data.getElementsByTagName("name")[0].firstChild.nodeValue;
  var country = data.getElementsByTagName("country")[0].firstChild.nodeValue;
  var lat = data.getElementsByTagName("location")[1].getAttribute("latitude");
  var lon = data.getElementsByTagName("location")[1].getAttribute("longitude");
  forecast.city = city;
  forecast.country = country;
  forecast.latitude = lat;
  forecast.longitude = lon;
  forecast.weather = {};
  var days = data.getElementsByTagName("time");
  for (var i = 0; i < days.length; i++) {
    var day = days[i]
    var date = day.getAttribute("day");
    var min = day.getElementsByTagName("temperature")[0].getAttribute("min");
    var max = day.getElementsByTagName("temperature")[0].getAttribute("max");
    var rain = day.getElementsByTagName("precipitation")[0].getAttribute("value");
    var hum = day.getElementsByTagName("humidity")[0].getAttribute("value");
    if (!rain) {
      rain = "0";
    }
    forecast.weather[date] = {
      minTemp: min,
      maxTemp: max,
      humidity: hum,
      precipitation: rain
    }
  };
  displayForecast(forecast);
}

function getXmlResponse(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        callback(request.responseXML);
      } else if (request.status == 404) {
        displayModal("Cannot find the requested city.");
      }
    }
  };
  request.open("GET", url, true);
  request.send();
}

function getForecast() {
  var location = $("location");
  if (location.value === "") {
    displayModal("Please enter a city.");
  } else {
    var url = new ApiUrl(location.value, 7, $("units").value);
    var xml = getXmlResponse(url.build(), parseForecast);
  }
}

window.onload = function() {
  /*
  Disables the submission button for 3 seconds to prevent abuse.
  */
  var btn = $("location-entry-submit")
  btn.addEventListener("click", function() {
    btn.disabled = true;
    setTimeout(function() {
      btn.disabled = false;
    }, 3000);
  });

  /*
  Binds onclick events of clickable elements to their respective behaviours.
  */
  $("toggle").onclick = toggleMenu;
  $("location-entry-submit").onclick = getForecast;
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
