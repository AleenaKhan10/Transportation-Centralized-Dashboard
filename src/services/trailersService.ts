// API URLs - try proxy first, fallback to Netlify Functions
const TRAILERS_API_URL = '/api/trailers';
const TRIP_DATA_API_URL = '/api/trip-data';
const TRAILERS_FUNCTION_URL = '/.netlify/functions/trailers';
const TRIP_DATA_FUNCTION_URL = '/.netlify/functions/trip-data';

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

// API call with fallback to Netlify Functions
async function callAPI(url: string, fallbackUrl?: string): Promise<any> {
  console.log(`🔄 Calling API: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API call successful, data type: ${typeof data}, isArray: ${Array.isArray(data)}`);
    return data;
  } catch (error) {
    console.warn(`⚠️ Primary API failed: ${error}, trying fallback...`);
    
    if (fallbackUrl) {
      console.log(`🔄 Calling fallback API: ${fallbackUrl}`);
      
      const fallbackResponse = await fetch(fallbackUrl, {
        method: 'GET',
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback HTTP error! status: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      console.log(`✅ Fallback API call successful, data type: ${typeof fallbackData}, isArray: ${Array.isArray(fallbackData)}`);
      return fallbackData;
    }
    
    throw error;
  }
}

export async function getTrailers(): Promise<Trailer[]> {
  console.log('🚛 Fetching trailers...');
  const data = await callAPI(TRAILERS_API_URL, TRAILERS_FUNCTION_URL);
  
  if (Array.isArray(data)) {
    console.log(`✅ Successfully fetched ${data.length} trailers`);
    return data as Trailer[];
  }
  
  throw new Error('Invalid data structure received from trailers API');
}

export async function getTripData(trailerId: string, tripId: string): Promise<TripData[]> {
  console.log(`🚛 Fetching trip data for trailer: ${trailerId}, trip: ${tripId}`);
  
  const url = `${TRIP_DATA_API_URL}?trailer_id=${trailerId}&trip_id=${tripId}`;
  const fallbackUrl = `${TRIP_DATA_FUNCTION_URL}?trailer_id=${trailerId}&trip_id=${tripId}`;
  const data = await callAPI(url, fallbackUrl);
  
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