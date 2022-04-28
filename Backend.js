
function saveFlight() {
  const lentohakuteksti = document.getElementById("lentohakuteksti").value;
  let savedFlights = [lentohakuteksti];
  printFlight(lentohakuteksti);
}

function saveAirport() {
  const kenttähakuteksti = document.getElementById("kenttähakuteksti").value;
  let savedAirports = [kenttähakuteksti];
  searchAirportInfo(kenttähakuteksti);
  const elements = document.getElementsByClassName("elements");
  for(let i = 0; i<elements.length; i++){
    elements[i].style.display = "block";
  }
}


