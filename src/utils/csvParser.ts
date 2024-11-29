import Papa from 'papaparse';
import { HeatmapDataPoint } from '../types';

export const parseCSV = (file: File): Promise<HeatmapDataPoint[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const data: HeatmapDataPoint[] = results.data
            .filter((row: any) => {
              const lat = row.lat || row.LAT;
              const lng = row.lon || row.LON || row.lng;
              return lat && lng;
            })
            .map((row: any) => {
              const lat = parseFloat(row.lat || row.LAT);
              const lng = parseFloat(row.lon || row.LON || row.lng);

              return {
                lat,
                lng,
                intensity: 1 // Default intensity
              };
            })
            .filter(point => (
              point.lat >= 38.9196 && 
              point.lat <= 39.3519 && 
              point.lng >= -77.4903 && 
              point.lng <= -76.8791
            ));

          resolve(data);
        } catch (error) {
          reject(new Error('Error parsing CSV data'));
        }
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        reject(error);
      }
    });
  });
};