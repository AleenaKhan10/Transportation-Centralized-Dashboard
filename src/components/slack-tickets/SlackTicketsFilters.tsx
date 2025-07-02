import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Brain, Tag } from 'lucide-react';
import { SlackTicketsFilter } from '../../types';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SlackTicketsFiltersProps {
  filters: SlackTicketsFilter;
  onFiltersChange: (filters: SlackTicketsFilter) => void;
}

const SlackTicketsFilters: React.FC<SlackTicketsFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [localFilters, setLocalFilters] = useState<SlackTicketsFilter>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SlackTicketsFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-lg border border-dark-700 p-3"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold text-white flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-xs px-2 py-1 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Mention Type Filter */}
        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Type
          </label>
          <select
            value={localFilters.is_mention?.toString() || ''}
            onChange={(e) => handleFilterChange('is_mention', e.target.value ? e.target.value === 'true' : undefined)}
            className="w-full bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="true">Mentions Only</option>
            <option value="false">Messages Only</option>
          </select>
        </div>

        {/* Confidence Score Filter */}
        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1 flex items-center gap-1">
            <Brain className="w-3 h-3" />
            Min Confidence
          </label>
          <select
            value={localFilters.confidence_score_min?.toString() || ''}
            onChange={(e) => handleFilterChange('confidence_score_min', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="">Any Confidence</option>
            <option value="0.8">80% and above</option>
            <option value="0.6">60% and above</option>
            <option value="0.4">40% and above</option>
            <option value="0.2">20% and above</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Date From
          </label>
          <Input
            type="date"
            value={localFilters.date_from || ''}
            onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
            className="w-full text-xs py-1"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-2 border-t border-dark-600">
          <div className="flex flex-wrap gap-1">
            {Object.entries(localFilters).map(([key, value]) => {
              if (value === undefined || value === '' || value === null) return null;
              
              let displayValue = value;
              if (key === 'is_mention') {
                displayValue = value ? 'Mentions' : 'Messages';
              } else if (key === 'confidence_score_min') {
                displayValue = `Min ${Math.round(value * 100)}%`;
              } else if (key === 'date_from') {
                displayValue = `From ${new Date(value).toLocaleDateString()}`;
              }

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full"
                >
                  {displayValue}
                  <button
                    onClick={() => handleFilterChange(key as keyof SlackTicketsFilter, undefined)}
                    className="hover:text-primary-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SlackTicketsFilters; 