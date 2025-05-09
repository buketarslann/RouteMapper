import React from 'react';
import { MapPin } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Route Mapper</h1>
        </div>
        <div className="text-sm">
          <p>Visualize and plan optimal routes</p>
        </div>
      </div>
    </header>
  );
};

export default Header;