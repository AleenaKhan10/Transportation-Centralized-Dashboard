const DriversPage: React.FC = () => {

    return(
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
)
}

export default DriversPage