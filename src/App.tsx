import React, { useState, useEffect } from 'react';
import LeafletMap from './components/LeafletMap';
import RouteSelector from './components/RouteSelector';
import Header from './components/Header';
import RouteDetails from './components/RouteDetails';
import { Location } from './types/location';
import { allLocations } from './data/fullLocations';

const MAX_LOCATIONS = 570;

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      setTimeout(() => {
        const limitedLocations = allLocations.slice(0, MAX_LOCATIONS);
        setLocations(limitedLocations);
        setIsLoading(false);
      }, 500);
    };

    loadLocations();
  }, []);

  const handleStartChange = (location: Location) => {
    setStartLocation(location);
  };

  const handleEndChange = (location: Location) => {
    setEndLocation(location);
  };

  const handleRouteUpdate = (info: any) => {
    setRouteInfo(info);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Route Planner</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <RouteSelector
                  locations={locations}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  onStartChange={handleStartChange}
                  onEndChange={handleEndChange}
                />
                
                {startLocation && endLocation && (
                  <RouteDetails 
                    startLocation={startLocation} 
                    endLocation={endLocation}
                    routeInfo={routeInfo}
                  />
                )}
              </div>
              
              <div className="lg:col-span-2">
                <LeafletMap
                  locations={locations}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  onRouteUpdate={handleRouteUpdate}
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Route Mapper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;