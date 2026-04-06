import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction des icônes par défaut
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Coordinates {
  lng: number;
  lat: number;
}

const DESTINATION = { lng: 11.5161, lat: 3.848 };

export function OpenFreeMapLeaflet() {
  const [userPos, setUserPos] = useState<Coordinates | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const start = [pos.coords.longitude, pos.coords.latitude];
        const end = [DESTINATION.lng, DESTINATION.lat];
        setUserPos({ lng: start[0], lat: start[1] });

        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`,
          );
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            // OSRM [lng, lat] -> Leaflet [lat, lng]
            const flipCoords = data.routes[0].geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]],
            );
            setRouteCoords(flipCoords);
          }
        } catch (e) {
          console.error("Erreur routage", e);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <MapContainer
        center={[3.848, 11.5161]} // Yaoundé par défaut
        zoom={15}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Tuiles Satellite Esri */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
        />

        {/* Optionnel : Ajout des noms de rues par-dessus le satellite pour plus de clarté */}
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.png"
          opacity={0.5}
        />

        <ZoomControl position="topright" />

        {/* Destination */}
        <Marker position={[DESTINATION.lat, DESTINATION.lng]} />

        {/* Utilisateur */}
        {userPos && <Marker position={[userPos.lat, userPos.lng]} />}

        {/* Itinéraire (en rouge pour bien trancher sur le satellite) */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#4878e0", weight: 6, opacity: 0.8 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
