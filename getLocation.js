const locationOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com',
    'X-RapidAPI-Key': '74f0927946mshe7281fe540d5c51p1a2aa5jsnd6cc563ec47c'
  }
};

async function getLocation() {
  const contains = await fetch('https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/', locationOptions)
  const result = await contains.json();
  return result;
}

async function printLocation(){
  const location = await getLocation();
  console.log(location);
  const city = location.city;
  console.log(city);
  airportInfo = await getAirport(city);
  ICAO = airportInfo.items[0].icao;
  printArrDep();
}