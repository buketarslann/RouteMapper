export interface Location {
  id: string;
  type: 'Depot' | 'Customer';
  latitude: number;
  longitude: number;
}

export interface Route {
  startLocation: Location | null;
  endLocation: Location | null;
}

export interface ClusterRoute {
  id: number;
  customers: number[];
  duration: number;
}