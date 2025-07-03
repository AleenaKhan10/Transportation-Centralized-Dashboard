import React from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Line, Pie } from 'recharts'
import { ResponsiveContainer, LineChart, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const DashboardOverview: React.FC = () => {
  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 65000, shipments: 120 },
    { month: 'Feb', revenue: 71000, shipments: 135 },
    { month: 'Mar', revenue: 78000, shipments: 148 },
    { month: 'Apr', revenue: 82000, shipments: 155 },
    { month: 'May', revenue: 89000, shipments: 168 },
    { month: 'Jun', revenue: 94000, shipments: 180 },
  ]

  const fleetStatusData = [
    { name: 'Active', value: 45, color: '#10b981' },
    { name: 'Maintenance', value: 8, color: '#f59e0b' },
    { name: 'Idle', value: 12, color: '#6b7280' },
    { name: 'Out of Service', value: 3, color: '#ef4444' },
  ]

  const stats = [
    {
      name: 'Total Shipments',
      stat: '1,247',
      previousStat: '1,156',
      change: '+7.9%',
      changeType: 'positive',
      icon: Package,
    },
    {
      name: 'Active Vehicles',
      stat: '45',
      previousStat: '42',
      change: '+7.1%',
      changeType: 'positive',
      icon: Truck,
    },
    {
      name: 'Drivers Available',
      stat: '38',
      previousStat: '41',
      change: '-7.3%',
      changeType: 'negative',
      icon: Users,
    },
    {
      name: 'Monthly Revenue',
      stat: '94k',
      previousStat: '89k',
      change: '+5.6%',
      changeType: 'positive',
      icon: DollarSign,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'shipment',
      title: 'New shipment created',
      description: 'Shipment #SH-2024-001 from New York to Los Angeles',
      time: '2 minutes ago',
      icon: Package,
      color: 'text-blue-400',
    },
    {
      id: 2,
      type: 'driver',
      title: 'Driver checked in',
      description: 'John Smith started his route to Chicago',
      time: '15 minutes ago',
      icon: Users,
      color: 'text-green-400',
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Vehicle maintenance scheduled',
      description: 'Truck ABC-123 scheduled for maintenance on Friday',
      time: '1 hour ago',
      icon: AlertTriangle,
      color: 'text-yellow-400',
    },
    {
      id: 4,
      type: 'delivery',
      title: 'Delivery completed',
      description: 'Package delivered successfully to customer in Miami',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-400',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
              Welcome back, John!
            </h1>
            <p className="text-dark-400 text-lg">
              Here's what's happening with your logistics operations today.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">15</div>
              <div className="text-xs text-dark-400">Active Routes</div>
            </div>
            <div className="w-px h-12 bg-dark-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">98.5%</div>
              <div className="text-xs text-dark-400">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <motion.div
            key={item.name}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="card-glow group cursor-pointer"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-200">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-white">{item.stat}</p>
                  <p className={`ml-2 flex items-baseline text-sm font-medium ${
                    item.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {item.change}
                  </p>
                </div>
                <p className="text-sm text-dark-400">{item.name}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Revenue Overview</h3>
            <p className="text-dark-400 text-sm">Monthly revenue and shipment trends</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#f9fafb'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fleet Status Chart */}
        <motion.div variants={itemVariants} className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Fleet Status</h3>
            <p className="text-dark-400 text-sm">Current vehicle distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fleetStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {fleetStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#f9fafb'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
            <p className="text-dark-400 text-sm">Latest updates from your operations</p>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ x: 5 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dark-700/50 transition-colors cursor-pointer"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-dark-400 mt-1">{activity.description}</p>
                  <p className="text-xs text-dark-500 mt-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="card">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
            <p className="text-dark-400 text-sm">Common tasks and shortcuts</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Create New Shipment', icon: Package, color: 'from-blue-500 to-blue-600' },
              { label: 'Add New Driver', icon: Users, color: 'from-green-500 to-green-600' },
              { label: 'Schedule Maintenance', icon: AlertTriangle, color: 'from-yellow-500 to-yellow-600' },
              { label: 'View All Routes', icon: MapPin, color: 'from-purple-500 to-purple-600' },
                         ].map((action) => (
               <motion.button
                 key={action.label}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="w-full flex items-center space-x-3 p-3 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors group"
               >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:shadow-lg transition-all`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DashboardOverview 