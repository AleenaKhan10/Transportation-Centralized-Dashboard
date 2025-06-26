import React, { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ThermometerSun } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  time: number;
  timestamp: string;
  actualTemp: number;
  requiredTemp: number;
  driverSetTemp: number;
  status: string;
  tripId: string;
}

interface TrailerChartProps {
  data: ChartDataPoint[];
  requiredTemp: number;
  formatDate: (timestamp: number) => string;
  dataLimit: number;
}

const TrailerChart: React.FC<TrailerChartProps> = memo(({ 
  data, 
  requiredTemp, 
  formatDate, 
  dataLimit 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <ThermometerSun className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No temperature data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ThermometerSun className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Temperature Timeline
          </h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {data.length} data points
          {data.length >= dataLimit && ' (sampled)'}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              className="text-xs"
            />
            <YAxis 
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <Tooltip 
              labelFormatter={(value) => formatDate(Number(value))}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}°C`,
                name === 'actualTemp' ? 'Actual' : 
                name === 'requiredTemp' ? 'Required' : 'Driver Set'
              ]}
            />
            <ReferenceLine 
              y={requiredTemp} 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              label="Required Temp"
            />
            <Line 
              type="monotone" 
              dataKey="actualTemp" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              dot={false}
              name="actualTemp"
            />
            <Line 
              type="monotone" 
              dataKey="driverSetTemp" 
              stroke="#2dd4bf" 
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              name="driverSetTemp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

TrailerChart.displayName = 'TrailerChart';

export default TrailerChart; 