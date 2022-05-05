let ICAO = "";
let airportInfo = "";
let airportName = "";
let airportArray = [];

async function searchAirportInfo(city){
  airportInfo = await getAirport(city);
  console.log(airportInfo);
  const newDiv = document.createElement("div");
  newDiv.id = "Buttons";
  document.body.appendChild(newDiv);
  const div = document.getElementById("Buttons");
  for (let i = 0; i<airportInfo.items.length; i++){
    const button = document.createElement("button");
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));
    button.innerHTML = airportInfo.items[i].name;
    button.onclick = function() {chooseAirport(i);}
    button.className = "AirportButtons";
    div.appendChild(button);
  }
}

function chooseAirport(selection) {
  const div = document.getElementById("Buttons");
  div.innerHTML = "";
  ICAO = airportInfo.items[selection].icao;
  airportName = airportInfo.items[selection].name;
  printArrDep();
}
async function printArrDep(){
  const contains = await getArrDep();
  console.log(contains);
  const departures = document.getElementById('Departures');
  const arrivals = document.getElementById('Arrivals');
  resetText(1);
  for (let i = 0; i < 5; i++) {
    if (contains.departures[i] === undefined) {
      i++;
      break;
    }
      const departureTime = getTime(
          contains.departures[i].movement.scheduledTimeLocal);
      const departureInfo1 = document.createElement("p");
      departureInfo1.id = "Departures ID: " + i;
      const departureInfo2 = document.createElement("p");
      departureInfo1.innerHTML = departureTime + " | " +
          contains.departures[i].movement.airport.name;
      departureInfo2.innerHTML = "Airline: " +
          contains.departures[i].airline.name + "| Status: " +
          contains.departures[i].status;
      departures.appendChild(departureInfo1);
      departures.appendChild(departureInfo2);
      let text = document.getElementById("Departures ID: " + i);
      text.onclick = () => {
        printFlight(contains.departures[i].number);
      }
  }
  for (let i = 0; i < 5; i++) {
    if (contains.arrivals[i] === undefined){
      i++;
      break;
    }
    const arrivalTime = getTime(contains.arrivals[i].movement.scheduledTimeLocal);
      const arrivalInfo1 = document.createElement("p");
      arrivalInfo1.id = "Arrivals ID: " + i;
      const arrivalInfo2 = document.createElement("p");
      arrivalInfo1.innerHTML = arrivalTime + " | " +
          contains.arrivals[i].movement.airport.name;
      arrivalInfo2.innerHTML = "Airline: " + contains.arrivals[i].airline.name +
          " | Status: " + contains.arrivals[i].status;
      arrivals.appendChild(arrivalInfo1);
      arrivals.appendChild(arrivalInfo2);
      let text = document.getElementById("Arrivals ID: " + i);
      text.onclick = () => {
        printFlight(contains.arrivals[i].number);
      }
  }
  const location = document.getElementById('currentAirport');
  const locationInfo = document.createElement('h1');
  locationInfo.innerHTML = "Current airport: " + airportName;
  location.appendChild(locationInfo);
  printDelays();
}

async function printFlight(number) {
  const contents = await getFlight(number, 0);
  console.log(contents);
  const article = document.getElementById('Info');
  let departureTime = getTime(contents[0].departure.scheduledTimeLocal);
  let arrivalTime = getTime(contents[0].arrival.scheduledTimeLocal);
  resetText(2);
  const info1 = document.createElement('h1');
  const info2 = document.createElement('p');
  const info3 = document.createElement('p');
  const info4 = document.createElement('p');
  const info5 = document.createElement('p');
  info1.innerHTML = "Status: " + contents[0].status;
  info2.innerHTML = "Departure: " + departureTime + " | " + contents[0].departure.airport.name;
  info3.innerHTML = "Arrival: " +  arrivalTime + " | " + contents[0].arrival.airport.name;
  airportArray.push([departureTime + " | " +contents[0].arrival.airport.name + '<br>']);
  if (contents[0].aircraft === undefined) {
    info4.innerHTML = "Operator: " + contents[0].airline.name
  } else {
    info4.innerHTML = "Operator: " + contents[0].airline.name +
        " | Aircraft: " + contents[0].aircraft.model;
  }
  if (contents[0].arrival.baggageBelt === undefined) {
    info5.innerHTML = "Baggage belt: Unknown";
  } else {
    info5.innerHTML = "Baggage belt: " + contents[0].arrival.baggageBelt;
  }
  article.appendChild(info1);
  article.appendChild(info2);
  article.appendChild(info3);
  article.appendChild(info4);
  article.appendChild(info5);
  const reg = contents[0].aircraft.reg;
  const url = await getPicture(reg);
  if (url !== undefined){
    let image = document.createElement('img');
    image.style.maxWidth = "400px";
    image.style.marginRight = "15px";
    image.style.marginBottom = "10px";
    image.src = url;
    article.appendChild(image);
  }
}

async function printDelays(){
  const contents = await getDelays();
  const delays = document.getElementById('Delays');
  const info1 = document.createElement('p');
  const info2 = document.createElement('p');
  info1.innerHTML = "Delays in departures: " + (contents.departuresDelayInformation.delayIndex).toFixed(2);
  info2.innerHTML = "Delays in arrivals: " + (contents.arrivalsDelayInformation.delayIndex).toFixed(2);
  delays.appendChild(info1);
  delays.appendChild(info2);
}

function getTime(date){
  if (date != null) {
    let time = new Date(date)
    time = ((time.getHours() < 10 ? '0' : '') + time.getHours()) + ":" +
        ((time.getMinutes() < 10 ? '0' : '') + time.getMinutes());
    return time;
  }
}

function resetText(selection){
  if (selection === 1) {
    const departures = document.getElementById('Departures');
    const arrivals = document.getElementById('Arrivals');
    const delays = document.getElementById('Delays');
    const location = document.getElementById('currentAirport');
    location.innerHTML = "";
    departures.innerHTML = "";
    arrivals.innerHTML = "";
    delays.innerHTML = "";
    const text1 = document.createElement('h1');
    const text2 = document.createElement('h1');
    const text3 = document.createElement('h1');
    text1.innerHTML = "Departures <i class='fas fa-plane-departure'></i><br><br><br>";
    text2.innerHTML = "Arrivals <i class='fas fa-plane-arrival'></i><br><br><br>";
    text3.innerHTML = "Delays today <i class='fas fa-clock'></i><br><br><br>";
    departures.appendChild(text1);
    arrivals.appendChild(text2);
    delays.appendChild(text3);
  }else if (selection === 2){
    const article = document.getElementById('Info');
    article.innerHTML = "";
  }
}