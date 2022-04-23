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
  airportInfo = await search();
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
  arrivalsDepartures();
}

async function arrivalsDepartures(){
  const contains = await search2();
    console.log(contains);
    const departures = document.getElementById('Departures');
    const arrivals = document.getElementById('Arrivals');
    for (let i = 0; i < 5; i++) {
      let departureDate = contains.departures[i].movement.scheduledTimeLocal;
      let departureTime = new Date(departureDate);
      departureTime = departureTime.getHours() + ":" +
          departureTime.getMinutes()
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
}
async function search() {
  let result;
  const hakuteksti = document.getElementById("hakuteksti").value;
  await fetch('https://aerodatabox.p.rapidapi.com/airports/search/term?q=' + hakuteksti, options)
  .then(response => response.json()).then((response => {
    result = response;
  }));
  return result;
}

async function search2(){
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