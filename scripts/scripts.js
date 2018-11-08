var $ = function(id) {
  return document.getElementById(id);
}

function toggleMenu() {
  var menu = $("navbar");
  if (menu.className === "navbar") {
    menu.className += " mobile";
  } else {
    menu.className = "navbar";
  }
}

/*
Triggers the modal with a programmed message and displays it to the user.
*/
function displayModal(message) {
  var modal = $('modal');
  modal.style.display = "block";
  $("message").innerHTML = message;
  $("close").onclick = function() {
      modal.style.display = "none";
  }
}
