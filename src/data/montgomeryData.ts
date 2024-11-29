import { HeatmapDataPoint } from '../types';
import csvData from './montgomery_county.csv?raw';
import Papa from 'papaparse';

export const montgomeryCountyData: HeatmapDataPoint[] = (() => {
  const { data } = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((row: any) => ({
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lon),
    intensity: 1 // Default intensity since it's not in the CSV
  }));
})();