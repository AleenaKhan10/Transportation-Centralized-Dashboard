import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  Phone, 
  Calendar,
  Download,
  Eye,
  MessageSquare,
  FileText,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CallAgent, CallSession } from '../../types';
import { cn } from '../../utils/cn';

interface CallHistoryViewProps {
  calls: CallSession[];
  agents: CallAgent[];
  onSelectCall: (call: CallSession) => void;
}

const CallHistoryView: React.FC<CallHistoryViewProps> = ({
  calls,
  agents,
  onSelectCall
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedCall, setSelectedCall] = useState<CallSession | null>(null);

  const filteredCalls = calls.filter(call => {
    const searchLower = searchTerm.toLowerCase();
    return (
      call.caller_name?.toLowerCase().includes(searchLower) ||
      call.caller_phone.includes(searchLower) ||
      call.agent_name.toLowerCase().includes(searchLower) ||
      call.caller_info.notes?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredCalls.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentCalls = filteredCalls.slice(startIndex, startIndex + pageSize);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: CallSession['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'missed': return 'text-red-400 bg-red-500/20';
      case 'transferred': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const handleViewCall = (call: CallSession) => {
    setSelectedCall(call);
    onSelectCall(call);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Call History
          </h2>
          <span className="text-dark-400">
            {filteredCalls.length} calls
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700 border-b border-dark-600">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Caller</th>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Agent</th>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Status</th>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Date</th>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Priority</th>
                <th className="text-left p-4 text-sm font-medium text-dark-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {currentCalls.map((call) => (
                <motion.tr
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-dark-750 transition-colors cursor-pointer"
                  onClick={() => handleViewCall(call)}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {call.caller_name || call.caller_phone}
                        </p>
                        <p className="text-sm text-dark-400">
                          {call.caller_phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">{call.agent_name}</p>
                      <p className="text-sm text-dark-400 capitalize">
                        {agents.find(a => a.id === call.agent_id)?.type}
                      </p>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(call.status)
                    )}>
                      {call.status}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-dark-400" />
                      <span className="text-white">{formatDuration(call.duration)}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-dark-400" />
                      <span className="text-white">{formatDate(call.start_time)}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getUrgencyColor(call.caller_info.urgency)
                    )}>
                      {call.caller_info.urgency}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCall(call);
                        }}
                        className="p-1 text-dark-400 hover:text-white transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      
                      {call.transcript.length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-dark-400 hover:text-white transition-colors"
                          title="View transcript"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      {call.recording_url && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-dark-400 hover:text-white transition-colors"
                          title="Download recording"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {currentCalls.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto mb-4 text-dark-600" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No calls found
            </h3>
            <p className="text-dark-400">
              {searchTerm ? 'Try adjusting your search terms' : 'No call history available'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-dark-400">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredCalls.length)} of {filteredCalls.length} calls
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors",
                currentPage === 1
                  ? "bg-dark-700 text-dark-400 cursor-not-allowed"
                  : "bg-dark-700 text-white hover:bg-dark-600"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </motion.button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "px-3 py-2 rounded-lg transition-colors",
                    currentPage === page
                      ? "bg-primary-500 text-white"
                      : "bg-dark-700 text-white hover:bg-dark-600"
                  )}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors",
                currentPage === totalPages
                  ? "bg-dark-700 text-dark-400 cursor-not-allowed"
                  : "bg-dark-700 text-white hover:bg-dark-600"
              )}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}

      {/* Call Details Modal */}
      {selectedCall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-dark-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-lg border border-dark-700 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Call Details</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCall(null)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                ×
              </motion.button>
            </div>
            
            <div className="space-y-6">
              {/* Call Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Caller Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-dark-300">
                      <span className="font-medium">Name:</span> {selectedCall.caller_name || 'N/A'}
                    </p>
                    <p className="text-dark-300">
                      <span className="font-medium">Phone:</span> {selectedCall.caller_phone}
                    </p>
                    <p className="text-dark-300">
                      <span className="font-medium">Type:</span> {selectedCall.caller_type || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-dark-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Call Information</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-dark-300">
                      <span className="font-medium">Agent:</span> {selectedCall.agent_name}
                    </p>
                    <p className="text-dark-300">
                      <span className="font-medium">Duration:</span> {formatDuration(selectedCall.duration)}
                    </p>
                    <p className="text-dark-300">
                      <span className="font-medium">Status:</span> {selectedCall.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Caller Notes */}
              {selectedCall.caller_info.notes && (
                <div className="bg-dark-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Notes</h4>
                  <p className="text-dark-300">{selectedCall.caller_info.notes}</p>
                </div>
              )}

              {/* Transcript */}
              {selectedCall.transcript.length > 0 && (
                <div className="bg-dark-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Transcript</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedCall.transcript.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          entry.speaker === 'caller' 
                            ? "bg-blue-500/20 text-blue-400" 
                            : "bg-green-500/20 text-green-400"
                        )}>
                          {entry.speaker === 'caller' ? 'C' : 'A'}
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{entry.text}</p>
                          <p className="text-xs text-dark-400 mt-1">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call Logs */}
              {selectedCall.call_logs.length > 0 && (
                <div className="bg-dark-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Call Logs</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedCall.call_logs.map((log) => (
                      <div key={log.id} className="flex items-center space-x-3 text-sm">
                        <span className="text-dark-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-white">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CallHistoryView; 