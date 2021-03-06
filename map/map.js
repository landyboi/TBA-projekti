//Tiedostoa on hallinnoinut Miro Nissinen ja Tuomas Mellin
let map = L.map('map').setView([55.22, 21.01], 4);
let markerGroup = L.layerGroup().addTo(map);

//This adds the map data to the map base -Miro
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KCZTrF8TTlBLo55Yy2H8',{
  tileSize: 512,
  zoomOffset: -1,
  minZoom: 1,
  crossOrigin: true
}).addTo(map);

//This function draws the markers to the map. -Miro
function addToMap (lat, lon, direction, altitude, operator, flightNumber, departure, arrival, status) {
  let marker = L.marker([lat, lon]).addTo(markerGroup);
  marker.bindPopup('<strong>' + flightNumber + '</strong></br>'+ '<strong>' + "Operator: " + '</strong>' + operator + '</br>' + '<strong>' + "Direction: " + '</strong>' + direction + '</br><strong>' + "Altitude: " + '</strong>' + altitude + '</br><strong>' + "Departure: " + '</strong>' + departure + '</br><strong>' + "Arrival: " + '</strong>' + arrival + '</br><strong>' + "Status: " + '</strong>' + status);
}

//This function prints out the active flights from the API to the livemap. -Tuomas
async function getFlightInfo(icao){
  if (icao === undefined) {
    icao = await getICAO();
  }
  const departures = await getPositions(icao, "Departures");
  const arrivals = await getPositions(icao, "Arrivals");
  console.log(departures);
  console.log(arrivals);
  let operator = "Unknown";
  let flightNumber = "Unknown";
  let departure = "Unknown";
  let arrival = "Unknown";
  for (let i = 0; i<departures.length; i++){
    const latitude = departures[i][0];
    const longitude = departures[i][1];
    const direction = departures[i][2];
    const altitude = departures[i][3];
    const status = departures[i][5];
    if (departures[i][4] !== null) {
      let result = await getFlight(departures[i][4], 1);
      if (result.length !== 0) {
        operator = result[0].airline.name;
        flightNumber = result[0].number;
        departure = result[0].departure.airport.name;
        arrival = result[0].arrival.airport.name;
      }
    }
    addToMap(latitude, longitude, direction, altitude, operator, flightNumber, departure, arrival, status);
  }
  for (let i = 0; i<arrivals.length; i++){
    const latitude = arrivals[i][0];
    const longitude = arrivals[i][1];
    const direction = arrivals[i][2];
    const altitude = arrivals[i][3];
    const status = arrivals[i][5];
    if (arrivals[i][4] !== null) {
      let result = await getFlight(arrivals[i][4], 1);
      if (result.length !== 0) {
        operator = result[0].airline.name;
        flightNumber = result[0].number;
        departure = result[0].departure.airport.name;
        arrival = result[0].arrival.airport.name;
      }
    }
    addToMap(latitude, longitude, direction, altitude, operator, flightNumber, departure, arrival, status);
  }
}

//This function is called, when the user searched for a city/airport from the free text search. It clears the map from the markers and then gets the new city's airports ICAO code. -Tuomas
async function changeCity(){
  const hakuteksti = document.getElementById("hakuteksti").value;
  const icao = await getICAO(hakuteksti);
  markerGroup.clearLayers();
  getFlightInfo(icao);
}