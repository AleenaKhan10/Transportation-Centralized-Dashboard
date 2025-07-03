exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const API_KEY = '0bcf49a90e765ca3d7ea8ba1ae25373142e374c556919aa3e5c41adf8b2ff220';
    const BASE_URL = 'https://get-trip-data-181509438418.us-central1.run.app';
    
    // Get query parameters from the request
    const queryParams = event.queryStringParameters || {};
    const urlParams = new URLSearchParams(queryParams);
    const apiUrl = `${BASE_URL}?${urlParams.toString()}`;

    console.log('🔄 Fetching trip data from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ API response not ok:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched trip data:', Array.isArray(data) ? data.length : 'unknown length');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('❌ Error in trip-data function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch trip data',
        message: error.message 
      }),
    };
  }
}; 