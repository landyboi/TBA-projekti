// Tiedostoa on pääsääntöisesti työstänyt Tuomas Mellin. Miro Nissinen ja Timi Tienhaara on auttanut ongelmien korjauksessa ja jotain satuunaista tehnyt tiedostoon.
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    'X-RapidAPI-Key': 'b13df8318emshd4a781b663bb298p1adc90jsndd9aea88691f'
  }
};
const today = new Date();

//This function returns an array of airports that meets the requirements of the text given from the free text search. -Tuomas
async function getAirport(city) {
  let url;
  if (city === undefined){
    const kenttähakuteksti = document.getElementById("kenttähakuteksti").value;
    url = "https://aerodatabox.p.rapidapi.com/airports/search/term?q=" + kenttähakuteksti;
  } else{
    url = "https://aerodatabox.p.rapidapi.com/airports/search/term?q=" + city;
  }
  const contains = await fetch(url, options)
  const result = await contains.json();
  return result;
}

//This function returns an array containing a specific flight, searched by the user. -Tuomas
async function getFlight(number, callsign) {
  let url;
  if (number === undefined){
    const lentohakuteksti = document.getElementById("lentohakuteksti").value;
    url = "https://aerodatabox.p.rapidapi.com/flights/number/" + lentohakuteksti + "/";
  } else if (number !== undefined){
    if (callsign === 0) {
      url = "https://aerodatabox.p.rapidapi.com/flights/number/" + number + "/";
    } else {
      url = "https://aerodatabox.p.rapidapi.com/flights/callsign/" + number + "/";
    }
  }
  const contains = await fetch(url + today.getFullYear() + '-' + ((today.getMonth() < 10 ? '0' : '') + (today.getMonth() + 1)) + '-' + ((today.getDate()<10?'0':'') + today.getDate()), options);
  const result = await contains.json();
  return result;
}

//This function searches for the specific aircraft picture, by the registeration number which it gets as a parameter. -Tuomas
async function getPicture(registeration){
  if (registeration !== undefined) {
    try {
      const contains = await fetch(
          'https://aerodatabox.p.rapidapi.com/aircrafts/reg/' + registeration +
          '/image/beta', options)
      let result = await contains.json();
      result = result.url;
      return result;
    } catch (error) {
      console.log("No photo found!");
    }
  }
}

//This function returns an array containing all of the arriving and departing aircrafts from the specific airport in a timescale of this moment to and hour forwards. -Tuomas
async function getArrDep(){
  let endtime;
  const starttime = today.getFullYear()+'-'+ '0' + (today.getMonth()+1)+'-'+((today.getDate()<10?'0':'') + today.getDate())+'T' + ((today.getHours()<10?'0':'') + today.getHours()) + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes());
  if ((today.getHours()+1) === 24) {
    endtime = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) +
        '-' + ((today.getDate() < 10 ? '0' : '') + (today.getDate()+1)) + 'T' +
        + "0" + "0" + ":" +
        ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes());
  } else if ((today.getHours()+1) !== 24) {
    endtime = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) +
        '-' + ((today.getDate() < 10 ? '0' : '') + today.getDate()) + 'T' +
        +(today.getHours() + 1) + ":" +
        ((today.getMinutes() < 10 ? '0' : '') + today.getMinutes());
  }
  const contains = await fetch('https://aerodatabox.p.rapidapi.com/flights/airports/icao/' + ICAO + '/' + starttime + '/' + endtime + '?withCodeshared=false', options)
  const result = await contains.json();
  return result;
}

//This function returns and array containing info about the delays of the specific airport. -Tuomas
async function getDelays(){
  const contains = await fetch('https://aerodatabox.p.rapidapi.com/airports/icao/' + ICAO + '/delays', options);
  const result = await contains.json();
  return result;
}

//This function returns the live position, direction, altitude, flight ICAO and status, either from all of the departing or arriving flights from the specific airport. -Tuomas
async function getPositions(ICAO, direction) {
  if (direction === "Departures") {
    const contains = await fetch(
        'https://airlabs.co/api/v9/flights?dep_icao=' + ICAO +
        '&_view=array&_fields=lat,lng,dir,alt,flight_icao,status&api_key=b29ee1d8-b889-4115-9807-b65982aa7150');
    const departures = await contains.json();
    return departures;
  } else if (direction === "Arrivals") {
    const contains = await fetch(
        'https://airlabs.co/api/v9/flights?arr_icao=' + ICAO +
        '&_view=array&_fields=lat,lng,dir,alt,flight_icao,status&api_key=b29ee1d8-b889-4115-9807-b65982aa7150');
    const arrivals = await contains.json();
    return arrivals;
  }
}