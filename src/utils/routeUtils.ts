import { decode } from '@mapbox/polyline';
import { Location } from '../types/location';

interface RouteResponse {
  routes: {
    geometry: string;
    duration: number;
    distance: number;
    duration_in_traffic?: number;
  }[];
}

export async function getRouteDetails(start: Location, end: Location) {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&annotations=true`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch route');
    }

    const data: RouteResponse = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const coordinates = decode(route.geometry).map(([lat, lng]) => [lat, lng]);
    
    // Simulate traffic conditions based on time of day
    const hour = new Date().getHours();
    const trafficMultiplier = getTrafficMultiplier(hour);
    const durationWithTraffic = route.duration * trafficMultiplier;

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
      durationWithTraffic,
      trafficLevel: getTrafficLevel(trafficMultiplier)
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

function getTrafficMultiplier(hour: number): number {
  // Rush hours: 7-9 AM and 4-7 PM
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
    return 1.5 + Math.random() * 0.5; // 1.5x to 2x slower
  }
  // Mid-day: 10 AM - 3 PM
  if (hour >= 10 && hour <= 15) {
    return 1.2 + Math.random() * 0.3; // 1.2x to 1.5x slower
  }
  // Early morning or late evening
  return 1 + Math.random() * 0.2; // 1x to 1.2x slower
}

function getTrafficLevel(multiplier: number): 'low' | 'moderate' | 'heavy' {
  if (multiplier <= 1.2) return 'low';
  if (multiplier <= 1.5) return 'moderate';
  return 'heavy';
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minutes`;
}