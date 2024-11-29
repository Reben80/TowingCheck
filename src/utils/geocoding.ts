export const geocodeLocation = async (location: string): Promise<[number, number]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    );
    const data = await response.json();
    
    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error('Location not found');
  } catch (error) {
    throw new Error('Error geocoding location');
  }
};