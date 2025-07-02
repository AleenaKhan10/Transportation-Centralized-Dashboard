// Frontend database configuration - types only
// Actual database operations happen on the backend via API calls

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

// Database configuration - these would typically come from environment variables
const dbConfig: DatabaseConfig = {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_DB_PORT || '3306'),
  user: import.meta.env.VITE_DB_USER || 'root',
  password: import.meta.env.VITE_DB_PASSWORD || '',
  database: import.meta.env.VITE_DB_NAME || 'agy_logistics',
  connectionLimit: 10
};

// Note: In a frontend React app, database operations should happen through API calls
// The actual database connection and pool management happens on the backend (Netlify functions)

export default dbConfig; 