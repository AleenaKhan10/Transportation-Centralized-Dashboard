import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Table, 
  LayoutGrid, 
  BarChart3, 
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { SlackTicket, SlackTicketsFilter, SlackTicketViewType } from '../types';
import { SlackTicketsService } from '../services/slackTicketsService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Import view components
import SlackTicketsChatView from '../components/slack-tickets/SlackTicketsChatView';
import SlackTicketsTableView from '../components/slack-tickets/SlackTicketsTableView';
import SlackTicketsCardView from '../components/slack-tickets/SlackTicketsCardView';
import SlackTicketsAnalyticsView from '../components/slack-tickets/SlackTicketsAnalyticsView';
import SlackTicketsTimelineView from '../components/slack-tickets/SlackTicketsTimelineView';
import SlackTicketsFilters from '../components/slack-tickets/SlackTicketsFilters';

const SlackTicketsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<SlackTicketViewType>('chat');
  const [tickets, setTickets] = useState<SlackTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<SlackTicketsFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  const viewOptions = [
    { type: 'chat' as SlackTicketViewType, icon: MessageSquare, label: 'Chat Interface', description: 'Natural conversation flow' },
    { type: 'table' as SlackTicketViewType, icon: Table, label: 'Table/Grid', description: 'High data density' },
    { type: 'card' as SlackTicketViewType, icon: LayoutGrid, label: 'Card Layout', description: 'Modern visually appealing' },
    { type: 'analytics' as SlackTicketViewType, icon: BarChart3, label: 'Analytics Dashboard', description: 'Business insights' },
    { type: 'timeline' as SlackTicketViewType, icon: Clock, label: 'Timeline', description: 'Real-time feel' }
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500),
    []
  );

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery.trim()) {
        response = await SlackTicketsService.searchTickets(
          searchQuery, 
          pagination.page, 
          pagination.limit
        );
      } else {
        response = await SlackTicketsService.getSlackTickets(
          filters, 
          pagination.page, 
          pagination.limit
        );
      }
      
      setTickets(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Show error toast or notification here
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearch = (query: string) => {
    setSearchInput(query);
    debouncedSearch(query);
  };

  const handleFilterChange = (newFilters: SlackTicketsFilter) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExport = async () => {
    try {
      const blob = await SlackTicketsService.exportToCSV(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slack-tickets-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting tickets:', error);
    }
  };

  const renderCurrentView = () => {
    const commonProps = {
      tickets,
      loading,
      pagination,
      onPageChange: (page: number) => setPagination(prev => ({ ...prev, page })),
      onRefresh: fetchTickets
    };

    const tableProps = {
      tickets,
      loading,
      onRefresh: fetchTickets
    };

    switch (currentView) {
      case 'chat':
        return <SlackTicketsChatView {...commonProps} />;
      case 'table':
        return <SlackTicketsTableView {...tableProps} />;
      case 'card':
        return <SlackTicketsCardView {...commonProps} />;
      case 'analytics':
        return <SlackTicketsAnalyticsView {...commonProps} />;
      case 'timeline':
        return <SlackTicketsTimelineView {...commonProps} />;
      default:
        return <SlackTicketsChatView {...commonProps} />;
    }
  };

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gradient mb-1">
            Slack Tickets & Suggestions
          </h1>
          <p className="text-dark-400 text-sm">
            Monitor and analyze AI interactions from Slack channels
            {searchQuery && (
              <span className="ml-2 text-primary-400 font-medium">
                • Searching for "{searchQuery}"
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm px-3 py-2"
          >
            <Filter className="w-3 h-3" />
            Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2 text-sm px-3 py-2"
          >
            <Download className="w-3 h-3" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={fetchTickets}
            disabled={loading}
            className="flex items-center gap-2 text-sm px-3 py-2"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 transition-colors ${
          searchQuery ? 'text-primary-400' : 'text-dark-400'
        }`} />
        <Input
          type="text"
          placeholder="Search tickets..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className={`pl-8 py-2 text-sm transition-all ${
            searchQuery ? 'ring-1 ring-primary-500/50 border-primary-500/50' : ''
          }`}
        />
        {searchQuery && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SlackTicketsFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Selector */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 p-3">
        <h3 className="text-md font-semibold text-white mb-3">View Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {viewOptions.map((option) => (
            <motion.button
              key={option.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView(option.type)}
              className={`p-2 rounded-lg border-2 transition-all duration-200 text-left ${
                currentView === option.type
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-dark-600 bg-dark-700/50 text-dark-300 hover:border-dark-500 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <option.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{option.label}</span>
              </div>
              <p className="text-xs opacity-70">{option.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Current View */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SlackTicketsPage; 