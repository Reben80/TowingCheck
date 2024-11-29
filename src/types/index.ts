export interface HeatmapDataPoint {
  lat: number;
  lng: number;
  intensity?: number;
}

export interface SearchBarProps {
  onSearch: (location: string) => void;
}