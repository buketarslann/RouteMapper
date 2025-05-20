import React from 'react';
import { Location, ClusterRoute } from '../types/location';
import { timeOptimizedRoutes, distanceOptimizedRoutes } from '../data/clusterRoutes';

interface RouteSelectorProps {
  locations: Location[];
  startLocation: Location | null;
  endLocation: Location | null;
  onStartChange: (location: Location) => void;
  onEndChange: (location: Location) => void;
  onClusterRouteSelect: (route: ClusterRoute | null) => void;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({
  locations,
  startLocation,
  endLocation,
  onStartChange,
  onEndChange,
  onClusterRouteSelect
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="time-route" className="block text-sm font-medium text-gray-700 mb-1">
            Select Route for Time
          </label>
          <select
            id="time-route"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => {
              const routeId = parseInt(e.target.value);
              const selectedRoute = timeOptimizedRoutes.find(route => route.id === routeId);
              onClusterRouteSelect(selectedRoute || null);
            }}
          >
            <option value="">Custom Route</option>
            {timeOptimizedRoutes.map((route) => (
              <option key={`time-${route.id}`} value={route.id}>
                Route {route.id + 1} ({route.duration.toFixed(2)} min, {route.customers.length} stops)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="distance-route" className="block text-sm font-medium text-gray-700 mb-1">
            Select Route for Distance
          </label>
          <select
            id="distance-route"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => {
              const routeId = parseInt(e.target.value);
              const selectedRoute = distanceOptimizedRoutes.find(route => route.id === routeId);
              onClusterRouteSelect(selectedRoute || null);
            }}
          >
            <option value="">Custom Route</option>
            {distanceOptimizedRoutes.map((route) => (
              <option key={`distance-${route.id}`} value={route.id}>
                Route {route.id + 1} ({route.customers.length} stops)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-location" className="block text-sm font-medium text-gray-700 mb-1">
              Starting Point
            </label>
            <select
              id="start-location"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={startLocation?.id || ''}
              onChange={(e) => {
                const selected = locations.find(loc => loc.id === e.target.value);
                if (selected) onStartChange(selected);
              }}
            >
              <option value="">Select starting point</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.id} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="end-location" className="block text-sm font-medium text-gray-700 mb-1">
              Destination Point
            </label>
            <select
              id="end-location"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={endLocation?.id || ''}
              onChange={(e) => {
                const selected = locations.find(loc => loc.id === e.target.value);
                if (selected) onEndChange(selected);
              }}
            >
              <option value="">Select destination</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.id} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {startLocation && endLocation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">Route Details</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p><span className="font-medium">From:</span> {startLocation.id} ({startLocation.latitude.toFixed(6)}, {startLocation.longitude.toFixed(6)})</p>
              <p><span className="font-medium">To:</span> {endLocation.id} ({endLocation.latitude.toFixed(6)}, {endLocation.longitude.toFixed(6)})</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteSelector;