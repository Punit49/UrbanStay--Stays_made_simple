const [lat, lon] = listing.geometry.cordinates;

let map = L.map('map', {scrollWheelZoom: false}).setView([lon, lat], 13);

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

L.tileLayer(
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
{
    maxZoom: 19, 
}).addTo(map);

L.tileLayer(
'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
{
    subdomains: 'abcd',
    maxZoom: 20,
}).addTo(map);

const urbanStayIcon = L.divIcon({
  className: 'urbanstay-marker',
  html: `<div class="marker-pin"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const marker = L.marker([lon, lat], { icon: urbanStayIcon }).addTo(map);
marker.bindPopup(`
        <h6>${listing.location}</h6>
        <p>Exact Location Will Be Provided After Booking</p>
    `).openPopup();

marker.on("mouseover", function(){
    this.openPopup();
}); 

marker.on("mouseout", function(){
    this.closePopup();
}); 