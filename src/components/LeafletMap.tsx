import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types/location';
import { getRouteDetails } from '../utils/routeUtils';

// Fix Leaflet marker icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const depotIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const customerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapBoundsProps {
  locations: Location[];
  startLocation: Location | null;
  endLocation: Location | null;
  routeCoordinates: [number, number][];
}

const MapBounds: React.FC<MapBoundsProps> = ({ 
  locations, 
  startLocation, 
  endLocation,
  routeCoordinates 
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (startLocation && endLocation) {
      const bounds = L.latLngBounds(
        [startLocation.latitude, startLocation.longitude],
        [endLocation.latitude, endLocation.longitude]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations, startLocation, endLocation, routeCoordinates]);
  
  return null;
};

interface LeafletMapProps {
  locations: Location[];
  startLocation: Location | null;
  endLocation: Location | null;
  onRouteUpdate: (routeInfo: any) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  locations,
  startLocation,
  endLocation,
  onRouteUpdate
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    async function fetchRoute() {
      if (startLocation && endLocation) {
        const routeData = await getRouteDetails(startLocation, endLocation);
        if (routeData) {
          setRouteCoordinates(routeData.coordinates as [number, number][]);
          onRouteUpdate({
            duration: routeData.duration,
            durationWithTraffic: routeData.durationWithTraffic,
            trafficLevel: routeData.trafficLevel
          });
        }
      } else {
        setRouteCoordinates([]);
        onRouteUpdate(null);
      }
    }

    fetchRoute();
  }, [startLocation, endLocation, onRouteUpdate]);

  const center = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude] 
    : [41.015, 28.820];

  return (
    <div className="h-[600px] w-full rounded-lg shadow-md overflow-hidden">
      <MapContainer 
        center={[center[0], center[1]] as [number, number]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={location.type === 'Depot' ? depotIcon : customerIcon}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{location.id}</h3>
                <p className="text-sm">Latitude: {location.latitude.toFixed(6)}</p>
                <p className="text-sm">Longitude: {location.longitude.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates}
            color="#3388ff"
            weight={4}
            opacity={0.7}
          />
        )}
        
        <MapBounds 
          locations={locations} 
          startLocation={startLocation} 
          endLocation={endLocation}
          routeCoordinates={routeCoordinates}
        />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;