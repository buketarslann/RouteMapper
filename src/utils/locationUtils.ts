import { Location } from '../types/location';

// Calculate distance between two locations using Haversine formula
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(loc2.latitude - loc1.latitude);
  const dLon = deg2rad(loc2.longitude - loc1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(loc1.latitude)) * Math.cos(deg2rad(loc2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
}

// Convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(2)} km`;
}

// Parse coordinates from a string format (e.g., "41,01234") to a number
export function parseCoordinate(coord: string): number {
  return parseFloat(coord.replace(',', '.'));
}

// Get all customer locations
export function getCustomerLocations(locations: Location[]): Location[] {
  return locations.filter(loc => loc.type === 'Customer');
}

// Get the depot location
export function getDepotLocation(locations: Location[]): Location | undefined {
  return locations.find(loc => loc.type === 'Depot');
}