import React, { useState, useCallback } from 'react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import { geocodeLocation } from './utils/geocoding';
import { HeatmapDataPoint } from './types';
import { MONTGOMERY_COUNTY } from './constants';
import { montgomeryCountyData } from './data/montgomeryData';

function App() {
  const [center, setCenter] = useState<[number, number]>([MONTGOMERY_COUNTY.center[0], MONTGOMERY_COUNTY.center[1]]);
  const [zoom, setZoom] = useState(MONTGOMERY_COUNTY.zoom);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (location: string) => {
    try {
      const searchQuery = `${location}, Montgomery County, Maryland`;
      const coordinates = await geocodeLocation(searchQuery);
      
      if (
        coordinates[0] >= MONTGOMERY_COUNTY.bounds.south &&
        coordinates[0] <= MONTGOMERY_COUNTY.bounds.north &&
        coordinates[1] >= MONTGOMERY_COUNTY.bounds.west &&
        coordinates[1] <= MONTGOMERY_COUNTY.bounds.east
      ) {
        setCenter(coordinates);
        setZoom(16); // Increased zoom level for better detail
        setError(null);
      } else {
        setError('Location not found within Montgomery County.');
      }
    } catch (err) {
      setError('Location not found. Please try a different search term.');
    }
  }, []);

  return (
    <div className="relative">
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-xs">
        <h2 className="text-lg font-semibold mb-2">Montgomery County Heatmap</h2>
        <p className="text-sm text-gray-600">
          Search for any location in Montgomery County to zoom to that area. The heatmap shows population density across the county.
        </p>
      </div>

      <Map data={montgomeryCountyData} center={center} zoom={zoom} />
    </div>
  );
}

export default App;