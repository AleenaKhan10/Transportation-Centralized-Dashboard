import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  PhoneCall,
  Repeat,
  MessageSquare
} from 'lucide-react';
import { CallbackRequest } from '../../types';
import { cn } from '../../utils/cn';

interface CallCallbacksViewProps {
  callbacks: CallbackRequest[];
  onCallbackScheduled: () => void;
}

const CallCallbacksView: React.FC<CallCallbacksViewProps> = ({
  callbacks,
  onCallbackScheduled
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCallback, setNewCallback] = useState<Partial<CallbackRequest>>({
    priority: 'medium',
    status: 'pending',
    attempts: 0,
    max_attempts: 3
  });
  const [selectedCallback, setSelectedCallback] = useState<CallbackRequest | null>(null);

  const getPriorityColor = (priority: CallbackRequest['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const getStatusColor = (status: CallbackRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const getStatusIcon = (status: CallbackRequest['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'scheduled': return Calendar;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return AlertCircle;
    }
  };

  const handleAddCallback = () => {
    if (newCallback.caller_phone && newCallback.requested_time && newCallback.reason) {
      // In a real implementation, this would call an API
      console.log('Adding callback:', newCallback);
      setShowAddModal(false);
      setNewCallback({
        priority: 'medium',
        status: 'pending',
        attempts: 0,
        max_attempts: 3
      });
      onCallbackScheduled();
    }
  };

  const handleUpdateStatus = (callbackId: string, newStatus: CallbackRequest['status']) => {
    // In a real implementation, this would call an API
    console.log('Updating callback status:', callbackId, newStatus);
    onCallbackScheduled();
  };

  const handleRetryCallback = (callbackId: string) => {
    // In a real implementation, this would call an API
    console.log('Retrying callback:', callbackId);
    onCallbackScheduled();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (requestedTime: string) => {
    return new Date(requestedTime) < new Date();
  };

  const pendingCallbacks = callbacks.filter(cb => cb.status === 'pending');
  const scheduledCallbacks = callbacks.filter(cb => cb.status === 'scheduled');
  const completedCallbacks = callbacks.filter(cb => cb.status === 'completed');
  const overdueCallbacks = callbacks.filter(cb => 
    cb.status === 'pending' && isOverdue(cb.requested_time)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Callback Requests
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-amber-400">
              {pendingCallbacks.length} Pending
            </span>
            <span className="text-blue-400">
              {scheduledCallbacks.length} Scheduled
            </span>
            <span className="text-green-400">
              {completedCallbacks.length} Completed
            </span>
            {overdueCallbacks.length > 0 && (
              <span className="text-red-400">
                {overdueCallbacks.length} Overdue
              </span>
            )}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Callback</span>
        </motion.button>
      </div>

      {/* Overdue Alerts */}
      {overdueCallbacks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-400">
                {overdueCallbacks.length} Overdue Callback{overdueCallbacks.length > 1 ? 's' : ''}
              </h3>
              <p className="text-red-300 text-sm">
                These callbacks are past their requested time and need immediate attention.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Callbacks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {callbacks.map((callback) => {
          const StatusIcon = getStatusIcon(callback.status);
          const isCallbackOverdue = isOverdue(callback.requested_time) && callback.status === 'pending';
          
          return (
            <motion.div
              key={callback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-dark-800 rounded-lg border p-6 cursor-pointer transition-all duration-200",
                isCallbackOverdue 
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-dark-700 hover:border-dark-600",
                selectedCallback?.id === callback.id && "border-primary-500 bg-primary-500/10"
              )}
              onClick={() => setSelectedCallback(callback)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {callback.caller_name || callback.caller_phone}
                    </h3>
                    <p className="text-sm text-dark-400">{callback.caller_phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getPriorityColor(callback.priority)
                  )}>
                    {callback.priority}
                  </span>
                  
                  <StatusIcon className="w-4 h-4 text-dark-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-dark-400" />
                  <span className={cn(
                    "text-sm",
                    isCallbackOverdue ? "text-red-400" : "text-white"
                  )}>
                    {formatDateTime(callback.requested_time)}
                  </span>
                  {isCallbackOverdue && (
                    <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
                      Overdue
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-dark-400" />
                  <span className="text-sm text-dark-300 truncate">
                    {callback.reason}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(callback.status)
                  )}>
                    {callback.status}
                  </span>
                  
                  <div className="flex items-center space-x-2 text-xs text-dark-400">
                    <Repeat className="w-3 h-3" />
                    <span>{callback.attempts}/{callback.max_attempts}</span>
                  </div>
                </div>
                
                {callback.notes && (
                  <p className="text-sm text-dark-300 bg-dark-700 rounded p-2">
                    {callback.notes}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                {callback.status === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(callback.id, 'scheduled');
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center justify-center space-x-1 text-sm"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Schedule</span>
                  </motion.button>
                )}
                
                {callback.status === 'scheduled' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(callback.id, 'completed');
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center justify-center space-x-1 text-sm"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Made</span>
                  </motion.button>
                )}
                
                {callback.attempts < callback.max_attempts && callback.status !== 'completed' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetryCallback(callback.id);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg flex items-center justify-center space-x-1 text-sm"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Retry</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {callbacks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-dark-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Callback Requests
          </h3>
          <p className="text-dark-400 mb-4">
            No callbacks have been scheduled yet
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Schedule First Callback
          </motion.button>
        </div>
      )}

      {/* Add Callback Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-dark-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-lg border border-dark-700 p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Schedule Callback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Caller Phone
                </label>
                <input
                  type="tel"
                  value={newCallback.caller_phone || ''}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, caller_phone: e.target.value }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Caller Name (Optional)
                </label>
                <input
                  type="text"
                  value={newCallback.caller_name || ''}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, caller_name: e.target.value }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter caller name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Requested Time
                </label>
                <input
                  type="datetime-local"
                  value={newCallback.requested_time || ''}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, requested_time: e.target.value }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Priority
                </label>
                <select
                  value={newCallback.priority || 'medium'}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, priority: e.target.value as CallbackRequest['priority'] }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Reason
                </label>
                <textarea
                  value={newCallback.reason || ''}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter reason for callback"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={newCallback.notes || ''}
                  onChange={(e) => setNewCallback(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Additional notes"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddCallback}
                  disabled={!newCallback.caller_phone || !newCallback.requested_time || !newCallback.reason}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg transition-colors",
                    newCallback.caller_phone && newCallback.requested_time && newCallback.reason
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : "bg-dark-600 text-dark-400 cursor-not-allowed"
                  )}
                >
                  Schedule Callback
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowAddModal(false);
                    setNewCallback({
                      priority: 'medium',
                      status: 'pending',
                      attempts: 0,
                      max_attempts: 3
                    });
                  }}
                  className="flex-1 bg-dark-600 text-dark-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CallCallbacksView; 