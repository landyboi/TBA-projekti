
let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=KCZTrF8TTlBLo55Yy2H8',{
  tileSize: 512,
  zoomOffset: -1,
  minZoom: 1,
  attribution: "<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>",
  crossOrigin: true
}).addTo(map);


addToMap(51.1, 0.11);

function addToMap (lat, lon) {
  let marker = L.marker([lat, lon]).addTo(map)
}