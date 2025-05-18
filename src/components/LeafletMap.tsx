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
  routeStops: Location[];
  routeCoordinates: [number, number][];
}

const MapBounds: React.FC<MapBoundsProps> = ({ 
  locations, 
  routeStops,
  routeCoordinates 
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (routeStops.length > 0) {
      const bounds = L.latLngBounds(
        routeStops.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations, routeStops, routeCoordinates]);
  
  return null;
};

interface LeafletMapProps {
  locations: Location[];
  startLocation: Location | null;
  endLocation: Location | null;
  selectedRoute: number[] | null;
  onRouteUpdate: (routeInfo: any) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  locations,
  startLocation,
  endLocation,
  selectedRoute,
  onRouteUpdate
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [routeStops, setRouteStops] = useState<Location[]>([]);
  const depot = locations.find(loc => loc.type === 'Depot');

  useEffect(() => {
    async function fetchRoute() {
      if (selectedRoute && selectedRoute.length > 0 && depot) {
        const stops = [depot];
        for (const customerId of selectedRoute) {
          const customer = locations.find(loc => loc.id === `Customer ${customerId}`);
          if (customer) stops.push(customer);
        }
        stops.push(depot); // Add depot at the end

        setRouteStops(stops);
        
        // Create route segments between consecutive stops
        const coordinates: [number, number][] = [];
        for (let i = 0; i < stops.length - 1; i++) {
          const routeData = await getRouteDetails(stops[i], stops[i + 1]);
          if (routeData) {
            coordinates.push(...routeData.coordinates as [number, number][]);
          }
        }
        
        setRouteCoordinates(coordinates);
        // Calculate total duration and traffic info
        let totalDuration = 0;
        let totalDurationWithTraffic = 0;
        let worstTrafficLevel: 'low' | 'moderate' | 'heavy' = 'low';
        
        for (let i = 0; i < stops.length - 1; i++) {
          const routeData = await getRouteDetails(stops[i], stops[i + 1]);
          if (routeData) {
            totalDuration += routeData.duration;
            totalDurationWithTraffic += routeData.durationWithTraffic;
            if (routeData.trafficLevel === 'heavy' || 
               (routeData.trafficLevel === 'moderate' && worstTrafficLevel === 'low')) {
              worstTrafficLevel = routeData.trafficLevel;
            }
          }
        }
        
        onRouteUpdate({
          duration: totalDuration,
          durationWithTraffic: totalDurationWithTraffic,
          trafficLevel: worstTrafficLevel
        });
      } else if (startLocation && endLocation) {
        const routeData = await getRouteDetails(startLocation, endLocation);
        if (routeData) {
          setRouteCoordinates(routeData.coordinates as [number, number][]);
          setRouteStops([startLocation, endLocation]);
          onRouteUpdate({
            duration: routeData.duration,
            durationWithTraffic: routeData.durationWithTraffic,
            trafficLevel: routeData.trafficLevel
          });
        }
      } else {
        setRouteCoordinates([]);
        setRouteStops([]);
        onRouteUpdate(null);
      }
    }

    fetchRoute();
  }, [startLocation, endLocation, selectedRoute, locations, depot, onRouteUpdate]);

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
          routeStops={routeStops}
          routeCoordinates={routeCoordinates}
        />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;