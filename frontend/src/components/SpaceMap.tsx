"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SpaceMapProps {
  latitude?: number | null;
  longitude?: number | null;
  title: string;
  address?: string;
  className?: string;
}

// Component to handle map center updates
function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [map, lat, lng]);
  
  return null;
}

export default function SpaceMap({ 
  latitude, 
  longitude, 
  title, 
  address,
  className = "" 
}: SpaceMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState warning
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Don't render on server
  if (!isMounted) {
    return (
      <div className={`bg-muted animate-pulse rounded-xl ${className}`} style={{ minHeight: "300px" }} />
    );
  }

  // Show placeholder if no coordinates
  if (!latitude || !longitude || latitude === null || longitude === null) {
    return (
      <div 
        className={`bg-muted/50 rounded-xl flex items-center justify-center ${className}`} 
        style={{ minHeight: "300px", width: "100%" }}
      >
        <div className="text-center text-muted-foreground">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium">Ubicación aproximada</p>
          <p className="text-xs mt-1">{address || "Madrid, España"}</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className={`rounded-xl z-0 ${className}`}
      style={{ height: "100%", minHeight: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div className="text-sm">
            <strong>{title}</strong>
            {address && <p className="text-muted-foreground mt-1">{address}</p>}
          </div>
        </Popup>
      </Marker>
      <MapCenter lat={latitude} lng={longitude} />
    </MapContainer>
  );
}
