import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, MessageSquare, Target, Hash, Bot } from 'lucide-react';
import { SlackTicketsService } from '../../services/slackTicketsService';

interface SlackTicketsAnalyticsViewProps {
  tickets: any[];
  loading: boolean;
  pagination: any;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const SlackTicketsAnalyticsView: React.FC<SlackTicketsAnalyticsViewProps> = ({
  loading
}) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const data = await SlackTicketsService.getAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  if (loading || analyticsLoading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-64 bg-dark-600 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6 text-center py-20">
        <Bot className="w-16 h-16 mx-auto mb-4 text-dark-400" />
        <h3 className="text-lg font-medium text-white mb-2">No analytics data</h3>
        <p className="text-dark-400">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{analyticsData.totalTickets}</h3>
              <p className="text-dark-400">Total Tickets</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{analyticsData.avgConfidenceScore}%</h3>
              <p className="text-dark-400">Avg Confidence</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Hash className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{analyticsData.mentionsCount}</h3>
              <p className="text-dark-400">Mentions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{Math.round((analyticsData.mentionsCount / analyticsData.totalTickets) * 100)}%</h3>
              <p className="text-dark-400">Mention Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Types Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-700 rounded-lg border border-dark-600 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Message Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Mentions', value: analyticsData.mentionsCount },
                  { name: 'Regular Messages', value: analyticsData.totalTickets - analyticsData.mentionsCount }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {[
                  { name: 'Mentions', value: analyticsData.mentionsCount },
                  { name: 'Regular Messages', value: analyticsData.totalTickets - analyticsData.mentionsCount }
                ].map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confidence Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-700 rounded-lg border border-dark-600 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Confidence Levels</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-dark-300 text-sm">High (80%+)</span>
              <span className="text-green-400 font-medium">
                {Math.round((analyticsData.totalTickets * 0.4))} tickets
              </span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{width: '40%'}}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-dark-300 text-sm">Medium (60-79%)</span>
              <span className="text-yellow-400 font-medium">
                {Math.round((analyticsData.totalTickets * 0.35))} tickets
              </span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{width: '35%'}}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-dark-300 text-sm">Low (Below 60%)</span>
              <span className="text-red-400 font-medium">
                {Math.round((analyticsData.totalTickets * 0.25))} tickets
              </span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div className="bg-red-400 h-2 rounded-full" style={{width: '25%'}}></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Activity Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-dark-700 rounded-lg border border-dark-600 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Daily Activity (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#374151',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#06B6D4" 
              strokeWidth={2}
              dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default SlackTicketsAnalyticsView; 