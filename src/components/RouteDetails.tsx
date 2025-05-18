import React from 'react';
import { MapPin, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { Location } from '../types/location';
import { calculateDistance, formatDistance } from '../utils/locationUtils';
import { formatDuration } from '../utils/routeUtils';

interface RouteDetailsProps {
  startLocation: Location | null;
  endLocation: Location | null;
  routeInfo?: {
    duration: number;
    durationWithTraffic: number;
    trafficLevel: 'low' | 'moderate' | 'heavy';
  } | null;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ 
  startLocation, 
  endLocation,
  routeInfo 
}) => {
  if (!startLocation || !endLocation) {
    return null;
  }

  const distance = calculateDistance(startLocation, endLocation);
  const formattedDistance = formatDistance(distance);

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'heavy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-2">Route Information</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Starting Point</p>
            <p className="text-sm text-gray-600">{startLocation.id}</p>
            <p className="text-xs text-gray-500">
              Coordinates: {startLocation.latitude.toFixed(6)}, {startLocation.longitude.toFixed(6)}
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Navigation className="h-5 w-5 text-red-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Destination</p>
            <p className="text-sm text-gray-600">{endLocation.id}</p>
            <p className="text-xs text-gray-500">
              Coordinates: {endLocation.latitude.toFixed(6)}, {endLocation.longitude.toFixed(6)}
            </p>
          </div>
        </div>
        
        {routeInfo && (
          <div className="pt-2 border-t space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm font-medium text-gray-700">Estimated Time:</p>
              </div>
              <p className="text-sm font-bold text-blue-700">
                {formatDuration(routeInfo.duration)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm font-medium text-gray-700">With Traffic:</p>
              </div>
              <p className={`text-sm font-bold ${getTrafficColor(routeInfo.trafficLevel)}`}>
                {formatDuration(routeInfo.durationWithTraffic)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Traffic Level:</p>
              <p className={`text-sm font-bold capitalize ${getTrafficColor(routeInfo.trafficLevel)}`}>
                {routeInfo.trafficLevel}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Distance:</p>
              <p className="text-sm font-bold text-blue-700">{formattedDistance}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDetails;