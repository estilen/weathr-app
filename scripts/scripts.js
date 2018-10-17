var $ = function(id) {
  return document.getElementById(id);
}

function getForecast() {
  alert("TODO: grab forecast from API")
}

window.onload = function() {
  $("location").onfocus = function() {
    $("location").setAttribute("style", "border-color: green;")
    $("location-entry-submit").setAttribute("style", "border-color: green;")
  };

  $("location").onblur = function() {
    $("location").setAttribute("style", "border-color: #81a6e2;")
    $("location-entry-submit").setAttribute("style", "border-color: #81a6e2;")
  };
}
