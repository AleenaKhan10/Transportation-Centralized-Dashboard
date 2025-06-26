const API_KEY = '0bcf49a90e765ca3d7ea8ba1ae25373142e374c556919aa3e5c41adf8b2ff220';
const TRAILERS_API_URL = '/api/trailers';
const TRIP_DATA_API_URL = '/api/trip-data';

export interface Trailer {
  trailer_id: string;
  trip_ids: string[];
}

export interface TripAggregatedData {
  reefer_mode_id: number;
  reefer_mode: string;
  required_temp: number;
  driver_set_temp: number;
  samsara_temp: number;
  samsara_temp_time: number;
}

export interface TripData {
  trailer_id: string;
  trip_id: string;
  driver_id: string;
  truck_id: string;
  status_id: number;
  status: string;
  priority: string;
  aggregated_data: TripAggregatedData[];
  trip_start_time: number;
  trip_end_time: number;
  sub_trip_start_time: number;
  sub_trip_end_time: number;
}

// Simple API call through Vite proxy (no CORS issues)
async function callAPI(url: string): Promise<any> {
  console.log(`🔄 Calling API: ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`✅ API call successful, data type: ${typeof data}, isArray: ${Array.isArray(data)}`);
  return data;
}

export async function getTrailers(): Promise<Trailer[]> {
  console.log('🚛 Fetching trailers...');
  const data = await callAPI(TRAILERS_API_URL);
  
  if (Array.isArray(data)) {
    console.log(`✅ Successfully fetched ${data.length} trailers`);
    return data as Trailer[];
  }
  
  throw new Error('Invalid data structure received from trailers API');
}

export async function getTripData(trailerId: string, tripId: string): Promise<TripData[]> {
  console.log(`🚛 Fetching trip data for trailer: ${trailerId}, trip: ${tripId}`);
  
  const url = `${TRIP_DATA_API_URL}?trailer_id=${trailerId}&trip_id=${tripId}`;
  const data = await callAPI(url);
  
  if (Array.isArray(data)) {
    console.log(`✅ Successfully fetched ${data.length} trip data records`);
    return data as TripData[];
  }
  
  throw new Error('Invalid data structure received from trip data API');
}

export const trailersService = {
  getTrailersAndTrips: getTrailers,
  getTripData,
}; 