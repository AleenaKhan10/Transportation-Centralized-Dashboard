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

  // Memoized pagination calculations
  const paginatedTrailers = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return trailers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [trailers, currentPage]);

  const paginatedTrips = useMemo(() => {
    if (!selectedTrailer) return [];
    const startIndex = tripPage * ITEMS_PER_PAGE;
    return selectedTrailer.trip_ids.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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
    if (tripData.length === 0) return [];

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
      trip.aggregated_data.forEach((point) => {
        allDataPoints.push({
          time: point.samsara_temp_time,
          timestamp: formatDate(point.samsara_temp_time),
          actualTemp: point.samsara_temp,
          requiredTemp: point.required_temp,
          driverSetTemp: point.driver_set_temp,
          status: trip.status,
          tripId: `${trip.trip_id}-${trip.status}`,
        });
      });
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
  }, [tripData, formatDate]);

  // Group trip data by status for better display
  const groupedTripData = useMemo(() => {
    const grouped = tripData.reduce((acc, trip) => {
      const key = `${trip.status_id}-${trip.status}`;
      if (!acc[key]) {
        acc[key] = {
          ...trip,
          dataPoints: trip.aggregated_data.length,
          timeRange: {
            start: trip.sub_trip_start_time,
            end: trip.sub_trip_end_time,
          }
        };
      }
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trailers & Trips
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor trailer locations and temperature data ({trailers.length} trailers)
          </p>
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-teal-500" />
                    Trips for {selectedTrailer.trailer_id} ({selectedTrailer.trip_ids.length})
                  </h2>
                </div>
                <div className="space-y-2 p-4 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {paginatedTrips.map((tripId, index) => (
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
                        <TrailerChart
                          data={prepareChartData}
                          requiredTemp={tripData[0]?.aggregated_data[0]?.required_temp || 28}
                          formatDate={formatDate}
                          dataLimit={CHART_DATA_LIMIT}
                        />
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