
let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KCZTrF8TTlBLo55Yy2H8',{
  tileSize: 512,
  zoomOffset: -1,
  minZoom: 1,
  crossOrigin: true
}).addTo(map);


function addToMap (lat, lon, direction, altitude, operator, flightNumber, departure, arrival, status) {
  let marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup('<strong>' + flightNumber + '</strong></br>'+ '<strong>' + "Operator: " + '</strong>' + operator + '</br>' + '<strong>' + "Direction: " + '</strong>' + direction + '</br><strong>' + "Altitude: " + '</strong>' + altitude + '</br><strong>' + "Departure: " + '</strong>' + departure + '</br><strong>' + "Arrival: " + '</strong>' + arrival + '</br><strong>' + "Status: " + '</strong>' + status);
}

async function getFlightInfo(){
  let icao = await getICAO();
  console.log(icao);
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
    if (arrivals[i][4] !== null) {
      let result = await getFlight(arrivals[i][4], 1);
      if (result.length !== 0) {
        operator = result[0].airline.name;
        flightNumber = result[0].number;
      }
    }
    addToMap(latitude, longitude, direction, altitude, operator, flightNumber);
  }
}