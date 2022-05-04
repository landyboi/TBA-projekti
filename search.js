const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    'X-RapidAPI-Key': '74f0927946mshe7281fe540d5c51p1a2aa5jsnd6cc563ec47c'
  }
};
const today = new Date();

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


async function getPicture(registeration){
  try {
    const contains = await fetch(
        'https://aerodatabox.p.rapidapi.com/aircrafts/reg/' + registeration +
        '/image/beta', options)
    let result = await contains.json();
    result = result.url;
    return result;
  } catch (error){
    return undefined;
  }
}

async function getArrDep(){
  const starttime = today.getFullYear()+'-'+ '0' + (today.getMonth()+1)+'-'+((today.getDate()<10?'0':'') + today.getDate())+'T' + ((today.getHours()<10?'0':'') + today.getHours()) + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes());
  const endtime = today.getFullYear()+'-'+ '0' + (today.getMonth()+1)+'-'+((today.getDate()<10?'0':'') + today.getDate())+'T' +  + (today.getHours()+1) + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes());
  const contains = await fetch('https://aerodatabox.p.rapidapi.com/flights/airports/icao/' + ICAO + '/' + starttime + '/' + endtime + '?withCodeshared=false', options)
  const result = await contains.json();
  return result;
}

async function getDelays(){
  const contains = await fetch('https://aerodatabox.p.rapidapi.com/airports/icao/' + ICAO + '/delays', options);
  const result = await contains.json();
  return result;
}

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