import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, MapPin, Clock, ThermometerSun, User, Package, TrendingUp, AlertTriangle, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Trailer, TripData } from '../services/trailersService';
import { trailersService } from '../services/trailersService';
import { Button } from '../components/ui/Button';
import TrailerChart from '../components/TrailerChart';

const ITEMS_PER_PAGE = 10;
const CHART_DATA_LIMIT = 100; // Limit chart data points for better performance

const TrailersPage: React.FC = () => {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [tripData, setTripData] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripLoading, setTripLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [tripPage, setTripPage] = useState(0);
  const [searchTripId, setSearchTripId] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchTrailers();
  }, []);

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await trailersService.getTrailersAndTrips();
      setTrailers(data);
    } catch (err) {
      setError('Failed to fetch trailers data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripData = useCallback(async (trailerId: string, tripId: string) => {
    try {
      setTripLoading(true);
      setError('');
      const data = await trailersService.getTripData(trailerId, tripId);
      setTripData(data);
    } catch (err) {
      setError('Failed to fetch trip data');
      console.error(err);
    } finally {
      setTripLoading(false);
    }
  }, []);

  const handleTrailerSelect = useCallback((trailer: Trailer) => {
    setSelectedTrailer(trailer);
    setSelectedTripId('');
    setTripData([]);
    setTripPage(0);
  }, []);

  const handleTripSelect = useCallback((tripId: string) => {
    if (selectedTrailer) {
      setSelectedTripId(tripId);
      fetchTripData(selectedTrailer.trailer_id, tripId);
    }
  }, [selectedTrailer, fetchTripData]);

  // Reverse lookup function to find trailer by trip ID
  const searchByTripId = useCallback(async (tripId: string) => {
    if (!tripId || !tripId.trim()) {
      setError('Please enter a trip ID to search');
      return;
    }

    try {
      setSearchLoading(true);
      setError('');
      
      // Ensure trailers data is available
      if (!trailers || trailers.length === 0) {
        setError('No trailers data available. Please refresh the page.');
        return;
      }
      
      // Find which trailer contains this trip ID
      const foundTrailer = trailers.find(trailer => 
        trailer && trailer.trip_ids && Array.isArray(trailer.trip_ids) &&
        trailer.trip_ids.some(id => 
          id && id.toLowerCase().includes(tripId.toLowerCase())
        )
      );

      if (!foundTrailer) {
        setError(`No trailer found containing trip ID: ${tripId}`);
        return;
      }

      // Find the exact trip ID match
      const exactTripId = foundTrailer.trip_ids.find(id => 
        id && id.toLowerCase().includes(tripId.toLowerCase())
      );

      if (!exactTripId) {
        setError(`Trip ID not found: ${tripId}`);
        return;
      }

      // Auto-select the trailer and trip
      setSelectedTrailer(foundTrailer);
      setSelectedTripId(exactTripId);
      
      // Fetch trip data safely
      if (foundTrailer.trailer_id && exactTripId) {
        await fetchTripData(foundTrailer.trailer_id, exactTripId);
      }
      
      // Clear search
      setSearchTripId('');
      
      console.log(`✅ Found trip ${exactTripId} in trailer ${foundTrailer.trailer_id}`);
      
    } catch (err) {
      setError('Failed to search for trip ID');
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  }, [trailers, fetchTripData]);

  // Memoized pagination calculations
  const paginatedTrailers = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return trailers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [trailers, currentPage]);

  // Sort trips by the ending numbers (-01, -02, etc.) and then paginate
  const sortedAndPaginatedTrips = useMemo(() => {
    if (!selectedTrailer) return [];
    
    // Sort trip IDs by the ending numbers
    const sortedTripIds = [...selectedTrailer.trip_ids].sort((a, b) => {
      // Extract the ending number from trip IDs (e.g., "TR-0000128288-01" -> "01")
      const getEndingNumber = (tripId: string) => {
        const match = tripId.match(/-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      };
      
      const aNumber = getEndingNumber(a);
      const bNumber = getEndingNumber(b);
      
      // First sort by the main trip ID (everything before the last dash)
      const aBase = a.substring(0, a.lastIndexOf('-'));
      const bBase = b.substring(0, b.lastIndexOf('-'));
      
      if (aBase !== bBase) {
        return aBase.localeCompare(bBase);
      }
      
      // Then sort by the ending number
      return aNumber - bNumber;
    });
    
    const startIndex = tripPage * ITEMS_PER_PAGE;
    return sortedTripIds.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [selectedTrailer, tripPage]);

  const totalPages = Math.ceil(trailers.length / ITEMS_PER_PAGE);
  const totalTripPages = selectedTrailer ? Math.ceil(selectedTrailer.trip_ids.length / ITEMS_PER_PAGE) : 0;

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-500';
      case 'enroutetodelivery':
        return 'text-blue-500';
      case 'unloading':
        return 'text-yellow-500';
      case 'loading':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'enroutetodelivery':
        return <Truck className="h-4 w-4" />;
      case 'unloading':
      case 'loading':
        return <Package className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority.toLowerCase()) {
      case 'veryhigh':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      case 'verylow':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  }, []);

  // Optimized chart data preparation with proper trip phase grouping
  const prepareChartData = useMemo(() => {
    if (!tripData || tripData.length === 0) return [];

    try {
      const allDataPoints: Array<{
        time: number;
        timestamp: string;
        actualTemp: number;
        requiredTemp: number;
        driverSetTemp: number;
        status: string;
        tripId: string;
      }> = [];

      // Group by status and get unique data points
      tripData.forEach((trip) => {
        if (trip && trip.aggregated_data && Array.isArray(trip.aggregated_data)) {
          trip.aggregated_data.forEach((point) => {
            if (point && typeof point.samsara_temp_time === 'number') {
              allDataPoints.push({
                time: point.samsara_temp_time,
                timestamp: formatDate(point.samsara_temp_time),
                actualTemp: point.samsara_temp || 0,
                requiredTemp: point.required_temp || 0,
                driverSetTemp: point.driver_set_temp || 0,
                status: trip.status || 'Unknown',
                tripId: `${trip.trip_id || 'Unknown'}-${trip.status || 'Unknown'}`,
              });
            }
          });
        }
      });

      // Remove duplicate timestamps and sort by time
      const uniqueDataPoints = allDataPoints
        .filter((point, index, arr) => 
          arr.findIndex(p => p.time === point.time) === index
        )
        .sort((a, b) => a.time - b.time);
      
      // If we have too many data points, sample them for better performance
      if (uniqueDataPoints.length > CHART_DATA_LIMIT) {
        const step = Math.ceil(uniqueDataPoints.length / CHART_DATA_LIMIT);
        return uniqueDataPoints.filter((_, index) => index % step === 0);
      }
      
      return uniqueDataPoints;
    } catch (error) {
      console.error('Error preparing chart data:', error);
      return [];
    }
  }, [tripData, formatDate]);

  // Group trip data by status for better display
  const groupedTripData = useMemo(() => {
    if (!tripData || tripData.length === 0) return [];
    
    try {
      const grouped = tripData.reduce((acc, trip) => {
        if (trip && trip.status_id !== undefined && trip.status) {
          const key = `${trip.status_id}-${trip.status}`;
          if (!acc[key]) {
            acc[key] = {
              ...trip,
              dataPoints: trip.aggregated_data ? trip.aggregated_data.length : 0,
              timeRange: {
                start: trip.sub_trip_start_time || trip.trip_start_time || 0,
                end: trip.sub_trip_end_time || trip.trip_end_time || 0,
              }
            };
          }
        }
        return acc;
      }, {} as Record<string, any>);
      
      return Object.values(grouped);
    } catch (error) {
      console.error('Error grouping trip data:', error);
      return [];
    }
  }, [tripData]);

  // Loading spinner component
  const LoadingSpinner = ({ size = "h-8 w-8" }: { size?: string }) => (
    <div className="flex items-center justify-center">
      <Loader2 className={`${size} animate-spin text-sky-500`} />
    </div>
  );

  // Pagination component
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    loading = false 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
    loading?: boolean;
  }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage + 1} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || loading}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-sky-500/20 border-t-sky-500 rounded-full mx-auto"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Loading Trailers Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch the latest information...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trailers & Trips
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor trailer locations and temperature data ({trailers.length} trailers)
          </p>
        </div>
        
        {/* Quick Trip Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick Trip Lookup
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter trip/shipment ID..."
                value={searchTripId}
                onChange={(e) => setSearchTripId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchByTripId(searchTripId)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent min-w-[200px]"
                disabled={searchLoading || loading}
              />
              <Button
                onClick={() => searchByTripId(searchTripId)}
                disabled={searchLoading || loading || !searchTripId.trim()}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700"
              >
                {searchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Package className="h-4 w-4" />
                )}
                Search
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={fetchTrailers} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={loading}
          >
            <TrendingUp className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trailers List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-sky-500" />
                Trailers ({trailers.length})
              </h2>
            </div>
            <div className="space-y-2 p-4 min-h-[400px]">
              <AnimatePresence mode="wait">
                {paginatedTrailers.map((trailer, index) => (
                  <motion.button
                    key={trailer.trailer_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTrailerSelect(trailer)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTrailer?.trailer_id === trailer.trailer_id
                        ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {trailer.trailer_id}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {trailer.trip_ids.length} trips
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {/* Trips List */}
        <div className="lg:col-span-2">
          {selectedTrailer ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-500" />
                      Trips for {selectedTrailer.trailer_id} ({selectedTrailer.trip_ids.length})
                    </h2>
                    {selectedTripId && (
                      <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Viewing: {selectedTripId}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 p-4 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {sortedAndPaginatedTrips.map((tripId: string, index: number) => (
                      <motion.button
                        key={tripId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleTripSelect(tripId)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedTripId === tripId
                            ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {tripId}
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                {totalTripPages > 1 && (
                  <Pagination
                    currentPage={tripPage}
                    totalPages={totalTripPages}
                    onPageChange={setTripPage}
                  />
                )}
              </div>

              {/* Trip Data Visualization */}
              <AnimatePresence>
                {selectedTripId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {tripLoading ? (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12">
                        <div className="text-center space-y-4">
                          <LoadingSpinner size="h-12 w-12" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Loading Trip Data
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Fetching temperature data and trip details...
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : tripData.length > 0 ? (
                      <>
                        {/* Trip Status Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupedTripData.map((trip, index) => (
                            <motion.div
                              key={`${trip.trip_id}-${trip.status_id}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 ${getStatusColor(trip.status)}`}>
                                  {getStatusIcon(trip.status)}
                                  <span className="font-medium text-sm">
                                    {trip.status.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(trip.priority)}`}>
                                  {trip.priority.replace('Very', '')}
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <User className="h-4 w-4" />
                                  <span className="truncate">Driver: {trip.driver_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <Truck className="h-4 w-4" />
                                  <span className="truncate">Truck: {trip.truck_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                  <ThermometerSun className="h-4 w-4" />
                                  <span>{trip.dataPoints} temp readings</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs">
                                  <Clock className="h-3 w-3" />
                                  <span className="truncate">{formatDate(trip.timeRange.start)}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Temperature Chart */}
                        {prepareChartData && prepareChartData.length > 0 && (
                          <TrailerChart
                            data={prepareChartData}
                            requiredTemp={tripData[0]?.aggregated_data?.[0]?.required_temp || 28}
                            formatDate={formatDate}
                            dataLimit={CHART_DATA_LIMIT}
                          />
                        )}
                      </>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a Trailer
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a trailer from the list to view its trips and temperature data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailersPage; 