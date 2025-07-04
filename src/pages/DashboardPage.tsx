import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import TrailersPage from './TrailersPage'
import DriverSearchBar from '@/components/driver/DriverSearchBar'
import DriverTable from '@/components/driver/DriverTable'

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        
        {/* Trailers and trips route */}
        <Route path="trailers" element={<TrailersPage />} />
        
        {/* Placeholder routes for future features */}
        <Route 
          path="shipments" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center py-20">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-4">
                  Shipments Management
                </h2>
                <p className="text-dark-400 text-lg">
                  Coming Soon - Comprehensive shipment tracking and management
                </p>
              </div>
            </motion.div>
          } 
        />
        
        <Route 
          path="fleet" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center py-20">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-4">
                  Fleet Management
                </h2>
                <p className="text-dark-400 text-lg">
                  Coming Soon - Real-time vehicle tracking and maintenance
                </p>
              </div>
            </motion.div>
          } 
        />
        
        <Route 
          path="drivers" 
          element={
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
            >
              <div className="text-center py-20 flex flex-col items-center">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-4">
                  Driver Management
                </h2>
                <p className="text-dark-400 text-lg">
                  Coming Soon - Driver schedules, performance, and compliance
                </p>
                <DriverSearchBar/>
                <DriverTable/>
              </div> 
            </motion.div>
          } 
        />
        
        <Route 
          path="analytics" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center py-20">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-4">
                  Analytics & Reports
                </h2>
                <p className="text-dark-400 text-lg">
                  Coming Soon - Business intelligence and performance metrics
                </p>
              </div>
            </motion.div>
          } 
        />
        
        <Route 
          path="settings" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center py-20">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-4">
                  Settings
                </h2>
                <p className="text-dark-400 text-lg">
                  Coming Soon - System configuration and preferences
                </p>
              </div>
            </motion.div>
          } 
        />
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardPage 