const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    'X-RapidAPI-Key': '74f0927946mshe7281fe540d5c51p1a2aa5jsnd6cc563ec47c'
  }
};
let ICAO = "";
let airportInfo = "";

async function searchAirportInfo(){
  airportInfo = await searchAirport();
  console.log(airportInfo);
  const body = document.querySelector('body');
  for (let i = 0; i<airportInfo.items.length; i++){
    const buttons =
        `<body>
        <br>
        <br>
        <button onclick="chooseAirport(${[i]})">${airportInfo.items[i].name}</button>
        </body>`
    body.innerHTML += buttons;
  }
}

function chooseAirport(selection){
  console.log(selection);
  ICAO = airportInfo.items[selection].icao;
  console.log(ICAO);
  printArrDep();
}

async function printArrDep(){
  const contains = await getArrDep();
  console.log(contains);
  const departures = document.getElementById('Departures');
  const arrivals = document.getElementById('Arrivals');
  for (let i = 0; i < 5; i++) {
    let departureDate = contains.departures[i].movement.scheduledTimeLocal;
    let departureTime = new Date(departureDate);
    departureTime = ((departureTime.getHours()<10?'0':'') + departureTime.getHours()) + ":" + ((departureTime.getMinutes()<10?'0':'') + departureTime.getMinutes());
    const newDeparture =
        `<article>
        <p>${departureTime} | ${contains.departures[i].movement.airport.name} </p>
        <p>Airline: ${contains.departures[i].airline.name} | Status: ${contains.departures[i].status} </p>
      </article>`
    departures.innerHTML += newDeparture;
    let arrivalDate = contains.arrivals[i].movement.scheduledTimeLocal;
    let arrivalTime = new Date(arrivalDate);
    arrivalTime = arrivalTime.getHours() + ":" + arrivalTime.getMinutes()
    const newArrival =
        `<article>
        <p>${arrivalTime} | ${contains.arrivals[i].movement.airport.name} </p>
        <p>Airline: ${contains.arrivals[i].airline.name} | Status: ${contains.arrivals[i].status} </p>
      </article>`
    arrivals.innerHTML += newArrival;
  }
  printDelays();
}
async function searchAirport() {
  let result;
  const hakuteksti = document.getElementById("kenttähakuteksti").value;
  await fetch('https://aerodatabox.p.rapidapi.com/airports/search/term?q=' + hakuteksti, options)
  .then(response => response.json()).then((response => {
    result = response;
  }));
  return result;
}

async function searchFlight() {
  let result;
  let today = new Date();
  const hakuteksti = document.getElementById("lentohakuteksti").value;
  await fetch('https://aerodatabox.p.rapidapi.com/flights/number/' + hakuteksti + '/' + today.getFullYear() + '-' + ((today.getMonth()<10?'0':'') + (today.getMonth()+1)) + '-' + today.getDate(), options)
  .then(response => response.json()).then((response => {
    result = response;
  }));
  return result;
}

async function printFlight() {
  const contents = await searchFlight();
  console.log(contents);
  const article = document.getElementById('Info');
  let departureDate = contents[0].departure.scheduledTimeUtc;
  let departureTime = new Date(departureDate);
  departureTime = ((departureTime.getHours() < 10 ? '0' : '') +
          departureTime.getHours()) + ":" +
      ((departureTime.getMinutes() < 10 ? '0' : '') +
          departureTime.getMinutes());
  let arrivalDate = contents[0].arrival.scheduledTimeUtc;
  let arrivalTime = new Date(arrivalDate);
  arrivalTime = arrivalTime.getHours() + ":" + arrivalTime.getMinutes();
  let newArticle =
      `<article>
       <p>Departure: ${departureTime} | ${contents.departure.airport.name}</p>
       <p>Arrival: ${arrivalTime} | ${contents.arrival.airport.name}</p>
       <p>Operator: ${contents[0].airline.name}</p>
     </article>`
  article.innerHTML += newArticle;
  const url = await getPicture();
  console.log(url);
  /*if (url === "undefined") {
    console.log(url);
    newArticle =
        `<article>
      <img src="${url}">
    </article>`
    article.innerHTML += newArticle;
    }*/
}

async function getPicture(){
  let result;
  await fetch('https://aerodatabox.p.rapidapi.com/aircrafts/reg/--/image/beta', options)
  .then(response => response.json()).then((response => {
    result = response;
  }));
  result = result.url;
  return result;
}

async function getArrDep(){
  let result;
  let today = new Date();
  const starttime = today.getFullYear()+'-'+ '0' + (today.getMonth()+1)+'-'+today.getDate()+'T' + today.getHours() + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes());
  const endtime = today.getFullYear()+'-'+ '0' + (today.getMonth()+1)+'-'+today.getDate()+'T' + (today.getHours()+1) + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes());
  await fetch('https://aerodatabox.p.rapidapi.com/flights/airports/icao/' + ICAO + '/' + starttime + '/' + endtime, options)
  .then(response => response.json()).then((response => {
    result = response;
  }));
  return result;
}

async function getDelays(){
  let result;
  await fetch('https://aerodatabox.p.rapidapi.com/airports/icao/' + ICAO + '/delays', options)
  .then(response => response.json()).then((response => {
    result = response;
  }));
  return result;
}

async function printDelays(){
  const contents = await getDelays();
  console.log(contents);
  const delays = document.getElementById('Delays');
  const newArticle =
      `<article>
       <p>Delays in departures: ${contents.departuresDelayInformation.numTotal}</p>
       <p>Delays in arrivals: ${contents.arrivalsDelayInformation.numTotal}</p>
     </article>`
  delays.innerHTML += newArticle;
}