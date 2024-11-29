import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Rectangle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { HeatmapDataPoint } from '../types';
import { MONTGOMERY_COUNTY } from '../constants';

// Fix Leaflet default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: { [key: number]: string };
    }
  ): L.Layer;
}

interface MapProps {
  data: HeatmapDataPoint[];
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  
  useEffect(() => {
    map.setView(center, zoom);
    
    if (markerRef.current) {
      markerRef.current.remove();
    }
    
    markerRef.current = L.marker(center)
      .bindPopup('Selected Location')
      .addTo(map)
      .openPopup();
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, center, zoom]);
  
  return null;
};

const HeatmapComponent: React.FC<{ data: HeatmapDataPoint[] }> = ({ data }) => {
  const map = useMap();
  const heatmapLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current);
    }

    const points: Array<[number, number, number]> = data.map(point => [
      point.lat,
      point.lng,
      1 // Using constant intensity for all points
    ]);

    if (points.length > 0) {
      heatmapLayerRef.current = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 18,
        gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
      }).addTo(map);
    }

    return () => {
      if (heatmapLayerRef.current) {
        map.removeLayer(heatmapLayerRef.current);
      }
    };
  }, [map, data]);

  return null;
};

const CountyBoundary: React.FC = () => {
  const bounds: L.LatLngBoundsExpression = [
    [MONTGOMERY_COUNTY.bounds.north, MONTGOMERY_COUNTY.bounds.west],
    [MONTGOMERY_COUNTY.bounds.south, MONTGOMERY_COUNTY.bounds.east]
  ];

  return (
    <Rectangle
      bounds={bounds}
      pathOptions={{
        color: '#4A5568',
        weight: 2,
        fillOpacity: 0,
        dashArray: '5, 5'
      }}
    />
  );
};

const Map: React.FC<MapProps> = ({ data, center, zoom }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-screen"
      style={{ background: '#f8fafc' }}
      maxZoom={18}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CountyBoundary />
      <HeatmapComponent data={data} />
      <MapController center={center} zoom={zoom} />
    </MapContainer>
  );
};

export default Map;