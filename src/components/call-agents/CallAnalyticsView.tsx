import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Phone,
  PhoneCall,
  PhoneMissed,
  Users,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { CallStats } from '../../types';

interface CallAnalyticsViewProps {
  stats: CallStats;
}

const CallAnalyticsView: React.FC<CallAnalyticsViewProps> = ({ stats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const getSelectedStats = () => {
    switch (selectedPeriod) {
      case 'today':
        return {
          total: stats.calls_today,
          answered: Math.floor(stats.calls_today * 0.9),
          missed: Math.floor(stats.calls_today * 0.1),
          label: 'Today'
        };
      case 'week':
        return {
          total: stats.calls_this_week,
          answered: Math.floor(stats.calls_this_week * 0.91),
          missed: Math.floor(stats.calls_this_week * 0.09),
          label: 'This Week'
        };
      case 'month':
        return {
          total: stats.calls_this_month,
          answered: Math.floor(stats.calls_this_month * 0.91),
          missed: Math.floor(stats.calls_this_month * 0.09),
          label: 'This Month'
        };
      default:
        return {
          total: stats.calls_today,
          answered: Math.floor(stats.calls_today * 0.9),
          missed: Math.floor(stats.calls_today * 0.1),
          label: 'Today'
        };
    }
  };

  const periodStats = getSelectedStats();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const callTypeData = [
    { label: 'Breakdown', value: stats.breakdown_calls, color: 'bg-red-500' },
    { label: 'Job Applications', value: stats.job_application_calls, color: 'bg-blue-500' },
    { label: 'General', value: stats.general_calls, color: 'bg-green-500' }
  ];

  const maxCallType = Math.max(...callTypeData.map(item => item.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Call Analytics
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-dark-300 hover:text-white'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{periodStats.total}</h3>
              <p className="text-blue-400">Total Calls</p>
              <p className="text-xs text-dark-400">{periodStats.label}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{periodStats.answered}</h3>
              <p className="text-green-400">Answered</p>
              <p className="text-xs text-dark-400">
                {getPercentage(periodStats.answered, periodStats.total)}% success rate
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <PhoneMissed className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{periodStats.missed}</h3>
              <p className="text-red-400">Missed</p>
              <p className="text-xs text-dark-400">
                {getPercentage(periodStats.missed, periodStats.total)}% miss rate
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{formatDuration(stats.average_duration)}</h3>
              <p className="text-amber-400">Avg Duration</p>
              <p className="text-xs text-dark-400">Per call</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-400" />
            <span>Performance Overview</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Completion Rate</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{stats.completion_rate}%</span>
                <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.completion_rate}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Answer Rate</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">
                  {getPercentage(stats.answered_calls, stats.total_calls)}%
                </span>
                <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(stats.answered_calls, stats.total_calls)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Satisfaction Rating</span>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">{stats.satisfaction_rating}/5.0</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            <span>Call Types Distribution</span>
          </h3>
          
          <div className="space-y-4">
            {callTypeData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-dark-300">{item.label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(item.value / maxCallType) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8 text-right">{item.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            <span>Call Volume</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Today</span>
              <span className="text-white font-semibold">{stats.calls_today}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">This Week</span>
              <span className="text-white font-semibold">{stats.calls_this_week}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">This Month</span>
              <span className="text-white font-semibold">{stats.calls_this_month}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-dark-700 pt-3">
              <span className="text-dark-300">Total Calls</span>
              <span className="text-white font-bold">{stats.total_calls}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Success Metrics</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Answered</span>
              <span className="text-green-400 font-semibold">{stats.answered_calls}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Missed</span>
              <span className="text-red-400 font-semibold">{stats.missed_calls}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Completion Rate</span>
              <span className="text-white font-semibold">{stats.completion_rate}%</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-dark-700 pt-3">
              <span className="text-dark-300">Satisfaction</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold">{stats.satisfaction_rating}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Time Metrics</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Average Duration</span>
              <span className="text-white font-semibold">{formatDuration(stats.average_duration)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Longest Call</span>
              <span className="text-white font-semibold">{formatDuration(stats.average_duration * 2.5)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-dark-300">Shortest Call</span>
              <span className="text-white font-semibold">{formatDuration(stats.average_duration * 0.3)}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-dark-700 pt-3">
              <span className="text-dark-300">Total Talk Time</span>
              <span className="text-white font-bold">
                {formatDuration(stats.total_calls * stats.average_duration)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-lg border border-dark-700 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span>Performance Trends</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Call Volume</span>
            </div>
            <p className="text-green-400 text-sm">+12% from last week</p>
            <p className="text-dark-400 text-xs">Increasing demand</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Resolution Rate</span>
            </div>
            <p className="text-green-400 text-sm">+5% from last week</p>
            <p className="text-dark-400 text-xs">Improving efficiency</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-white font-semibold">Avg Duration</span>
            </div>
            <p className="text-red-400 text-sm">-8% from last week</p>
            <p className="text-dark-400 text-xs">More efficient calls</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallAnalyticsView; 