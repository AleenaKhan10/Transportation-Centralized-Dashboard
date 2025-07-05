import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { CallsFilter, CallAgent } from '../../types';
import { cn } from '../../utils/cn';

interface CallFiltersProps {
  filters: CallsFilter;
  agents: CallAgent[];
  onFiltersChange: (filters: CallsFilter) => void;
}

const CallFilters: React.FC<CallFiltersProps> = ({
  filters,
  agents,
  onFiltersChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<CallsFilter>(filters);

  const handleFilterChange = (key: keyof CallsFilter, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleApplyFilters = () => {
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(tempFilters).filter(([_, value]) => value !== '' && value !== undefined)
    );
    onFiltersChange(cleanFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    onFiltersChange({});
    setShowFilters(false);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof CallsFilter]).length;
  };

  const formatDateForInput = (date: string) => {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors",
            showFilters
              ? "bg-primary-500 text-white"
              : "bg-dark-700 text-dark-300 hover:text-white"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
              {getActiveFilterCount()}
            </span>
          )}
        </motion.button>

        {getActiveFilterCount() > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearFilters}
            className="px-3 py-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            let displayValue = value;
            let displayKey = key;
            
            // Format display values
            switch (key) {
              case 'agent_id':
                displayKey = 'Agent';
                displayValue = agents.find(a => a.id === value)?.name || value;
                break;
              case 'call_type':
                displayKey = 'Call Type';
                displayValue = value === 'inbound' ? 'Inbound' : 'Outbound';
                break;
              case 'caller_type':
                displayKey = 'Caller Type';
                displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                break;
              case 'urgency':
                displayKey = 'Urgency';
                displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                break;
              case 'status':
                displayKey = 'Status';
                displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                break;
              case 'date_from':
                displayKey = 'From';
                displayValue = new Date(value).toLocaleDateString();
                break;
              case 'date_to':
                displayKey = 'To';
                displayValue = new Date(value).toLocaleDateString();
                break;
              case 'duration_min':
                displayKey = 'Min Duration';
                displayValue = `${value}s`;
                break;
              case 'duration_max':
                displayKey = 'Max Duration';
                displayValue = `${value}s`;
                break;
            }
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-500/20 border border-primary-500/30 rounded-lg px-3 py-1 flex items-center space-x-2"
              >
                <span className="text-sm text-primary-300">
                  {displayKey}: {displayValue}
                </span>
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters[key as keyof CallsFilter];
                    onFiltersChange(newFilters);
                  }}
                  className="text-primary-300 hover:text-primary-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-800 rounded-lg border border-dark-700 p-6 z-50 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filter Calls</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-dark-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Agent Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Agent
              </label>
              <select
                value={tempFilters.agent_id || ''}
                onChange={(e) => handleFilterChange('agent_id', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Agents</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Call Type Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Call Type
              </label>
              <select
                value={tempFilters.call_type || ''}
                onChange={(e) => handleFilterChange('call_type', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Status
              </label>
              <select
                value={tempFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="incoming">Incoming</option>
                <option value="active">Active</option>
                <option value="hold">Hold</option>
                <option value="transferred">Transferred</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>

            {/* Caller Type Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Caller Type
              </label>
              <select
                value={tempFilters.caller_type || ''}
                onChange={(e) => handleFilterChange('caller_type', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Caller Types</option>
                <option value="driver">Driver</option>
                <option value="job-applicant">Job Applicant</option>
                <option value="customer">Customer</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {/* Urgency Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Urgency
              </label>
              <select
                value={tempFilters.urgency || ''}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Urgencies</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date From
              </label>
              <input
                type="date"
                value={formatDateForInput(tempFilters.date_from || '')}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date To
              </label>
              <input
                type="date"
                value={formatDateForInput(tempFilters.date_to || '')}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Duration Range */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Min Duration (seconds)
              </label>
              <input
                type="number"
                value={tempFilters.duration_min || ''}
                onChange={(e) => handleFilterChange('duration_min', parseInt(e.target.value) || undefined)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Max Duration (seconds)
              </label>
              <input
                type="number"
                value={tempFilters.duration_max || ''}
                onChange={(e) => handleFilterChange('duration_max', parseInt(e.target.value) || undefined)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="3600"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-dark-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTempFilters({});
              }}
              className="px-4 py-2 rounded-lg bg-dark-600 text-dark-300 hover:text-white transition-colors"
            >
              Clear All
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setTempFilters(filters);
                setShowFilters(false);
              }}
              className="px-4 py-2 rounded-lg bg-dark-600 text-dark-300 hover:text-white transition-colors"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyFilters}
              className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Apply Filters
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CallFilters; 