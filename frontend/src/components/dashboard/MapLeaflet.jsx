import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default Leaflet marker icon paths
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapLeaflet = ({ lat, lng }) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (!latitude || !longitude) return null;

  return (
    <div className="w-full h-72 rounded-xl overflow-hidden border border-white/10">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>Complaint Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;
