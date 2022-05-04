let savedFlights = [];
const savedAirports = [];


function saveFlight() {
  const lentohakuteksti = document.getElementById("lentohakuteksti").value;

  printFlight(lentohakuteksti);
}

function saveAirport() {
  //const kenttahakuteksti = document.getElementById("kenttähakuteksti").value;
  savedAirports.push(["london"]);
  console.log(kenttahakuteksti);
  //searchAirportInfo(kenttahakuteksti);
  //const elements = document.getElementsByClassName("elements");
  /*for(let i = 0; i<elements.length; i++){
    elements[i].style.display = "block";
  }*/
}



