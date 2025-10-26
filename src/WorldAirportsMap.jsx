import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const airportIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [20, 20],
});
const departureIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/14090/14090371.png ", // green plane or similar
  iconSize: [25, 25],
});

const arrivalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png", // red plane or similar
  iconSize: [25, 25],
});

function WorldAirportsMap({ onAirportClick, departure, arrival }) {
  const [airports, setAirports] = useState([]);

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

useEffect(() => {
  fetch("/airports.json")
    .then((res) => res.json())
    .then((data) => {
      const validAirports = data.filter(
        (a) =>
          a.iata &&
          a.iata.trim() !== "" &&
          a.lat &&
          a.lon &&
          !isNaN(parseFloat(a.lat)) &&
          !isNaN(parseFloat(a.lon))
      );

      const airportsByCountry = {};
      validAirports.forEach((airport) => {
        if (!airportsByCountry[airport.iso]) airportsByCountry[airport.iso] = [];
        airportsByCountry[airport.iso].push(airport);
      });

      const selectedAirports = [];

      Object.values(airportsByCountry).forEach((airports) => {
        const filtered = [];

        airports.forEach((airport) => {
          const lat = parseFloat(airport.lat);
          const lon = parseFloat(airport.lon);

          // Check if it's far enough from already selected airports
          const tooClose = filtered.some(
            (a) => getDistance(lat, lon, parseFloat(a.lat), parseFloat(a.lon)) < 50
          ); // 50 km threshold

          if (!tooClose) filtered.push(airport);
        });

        // Take at most 4 airports per country
        selectedAirports.push(...filtered.slice(0, 4));
      });

      setAirports(selectedAirports);
    })
    .catch((err) => console.error(err));
}, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {airports.map((i) => {
        let icon = airportIcon;
        if (departure?.iata === i.iata) icon = departureIcon;
        else if (arrival?.iata === i.iata) icon = arrivalIcon;

        return (
          <Marker
            key={i.id}
            position={[parseFloat(i.lat), parseFloat(i.lon)]}
            icon={icon}
            eventHandlers={{
              click: () => onAirportClick(i),
            }}
          >
            <Tooltip>
            ✈️ <b>{i.name}</b><br />
            Country: {i.iso}<br />
            Code: {i.iata}
          </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default WorldAirportsMap;
