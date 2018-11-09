var $ = function(id) {
  return document.getElementById(id);
}

function toggleMenu() {
  if (navbar.className === "navbar") {
    navbar.className += " mobile";
  } else {
    navbar.className = "navbar";
  }
}

/*
Triggers the modal with a programmed message and displays it to the user.
*/
function displayModal(message) {
  modal.style.display = "block";
  $("message").innerHTML = message;
  $("close").onclick = function() {
      modal.style.display = "none";
  }
}

window.onload = function() {
  /*
  Disables the submission button for 3 seconds to prevent abuse.
  */
  var btn = $("city-entry-submit")
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
  $("city-entry-submit").onclick = getForecast;
  $("about").onclick = function() {
    displayModal("Assignment solution for CST4.1. Powered by openweathermap API");
  }
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
