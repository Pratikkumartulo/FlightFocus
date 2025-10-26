import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker"; // <-- Add this import
import { useEffect, useRef } from "react";

const departureIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/14090/14090371.png",
  iconSize: [25, 25],
});

const arrivalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
  iconSize: [25, 25],
});

const planeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/984/984233.png",
  iconSize: [32, 32],
});

function FitRoute({ depPos, arrPos }) {
  const map = useMap();
  const fittedRef = useRef(false);
  useEffect(() => {
    if (depPos && arrPos && !fittedRef.current) {
      const bounds = L.latLngBounds([depPos, arrPos]);
      map.fitBounds(bounds, { padding: [50, 50] });
      fittedRef.current = true;
    }
  }, [depPos, arrPos, map]);
  return null;
}

// Helper to interpolate position between two lat/lngs
function interpolatePosition(dep, arr, progress) {
  const lat = dep[0] + (arr[0] - dep[0]) * progress;
  const lon = dep[1] + (arr[1] - dep[1]) * progress;
  return [lat, lon];
}

// Helper to calculate bearing (angle in degrees) from dep to arr
function getBearing(from, to) {
  const lat1 = from[0] * Math.PI / 180;
  const lat2 = to[0] * Math.PI / 180;
  const dLon = (to[1] - from[1]) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360; // No +90
}

export default function PlaneRoute({ secondsLeft, totalSeconds }) {
  // Get latest booking from localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const booking = bookings.length ? bookings[bookings.length - 1] : {};
  const dep = booking.departure;
  const arr = booking.arrival;

  // If either is missing, show nothing
  if (!dep || !arr) return null;

  const depPos = [parseFloat(dep.lat), parseFloat(dep.lon)];
  const arrPos = [parseFloat(arr.lat), parseFloat(arr.lon)];

  // Calculate progress (0=start, 1=end)
  const progress = totalSeconds > 0 ? 1 - (secondsLeft / totalSeconds) : 0;
  const planePos = interpolatePosition(depPos, arrPos, progress);

  // Calculate dynamic rotation angle
  const rotationAngle = getBearing(planePos, arrPos);

  return (
    <MapContainer center={[(depPos[0] + arrPos[0]) / 2, (depPos[1] + arrPos[1]) / 2]} zoom={3} className="h-full w-full">
      <FitRoute depPos={depPos} arrPos={arrPos} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={depPos} icon={departureIcon}>
        <Tooltip>
          ✈️ <b>{dep.name}</b><br />
          Country: {dep.iso}<br />
          Code: {dep.iata}
        </Tooltip>
      </Marker>
      <Marker position={arrPos} icon={arrivalIcon}>
        <Tooltip>
          🛬 <b>{arr.name}</b><br />
          Country: {arr.iso}<br />
          Code: {arr.iata}
        </Tooltip>
      </Marker>
      <Polyline positions={[depPos, arrPos]} color="blue" />
      <Marker position={planePos} icon={planeIcon} rotationAngle={rotationAngle-40}>
        <Tooltip>
          <b>In Flight</b>
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}
