// Tiedostoa on pääsääntöisesti työstänyt Tuomas Mellin. Miro Nissinen ja Timi Tienhaara on auttanut ongelmien korjauksessa ja jotain satuunaista tehnyt tiedostoon.
const locationOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com',
    'X-RapidAPI-Key': '74f0927946mshe7281fe540d5c51p1a2aa5jsnd6cc563ec47c'
  }
};
async function getLocation() {
  const contains = await fetch('https://ipwho.is/', locationOptions)
  const result = await contains.json();
  return result;
}

async function printLocation(){
  const location = await getLocation();
  const city = location.city;
  airportInfo = await getAirport(city);
  if (airportInfo.length === 0){
    const location = document.getElementById('currentAirport');
    const message = document.createElement('h1');
    message.innerHTML = "No airports found from your current location!";
    location.appendChild(message);
  } else {
    ICAO = airportInfo.items[0].icao;
    airportName = airportInfo.items[0].name;
    printArrDep();
  }
}

async function getICAO(city){
  if (city === undefined) {
    const location = await getLocation();
    city = location.city;
  }
  airportInfo = await getAirport(city);
  if (airportInfo.items.length === 0){
    console.log("No airport found!")
  } else {
    ICAO = airportInfo.items[0].icao;
    return ICAO;
  }
}