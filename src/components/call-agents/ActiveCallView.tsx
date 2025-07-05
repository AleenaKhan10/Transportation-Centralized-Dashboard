import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  PhoneIncoming,
  ArrowRightLeft,
  User,
  Clock,
  MapPin,
  Truck,
  AlertCircle,
  FileText,
  MessageSquare,
  Mic,
  Volume2,
  Circle,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';
import { CallAgent, CallSession, CallerInfo } from '../../types';
import { cn } from '../../utils/cn';

interface ActiveCallViewProps {
  calls: CallSession[];
  agents: CallAgent[];
  selectedCall: CallSession | null;
  onSelectCall: (call: CallSession) => void;
  onAnswerCall: (callId: string) => void;
  onEndCall: (callId: string) => void;
  onTransferCall: (callId: string, toAgentId: string) => void;
}

const ActiveCallView: React.FC<ActiveCallViewProps> = ({
  calls,
  agents,
  selectedCall,
  onSelectCall,
  onAnswerCall,
  onEndCall,
  onTransferCall
}) => {
  const [callerInfo, setCallerInfo] = useState<Partial<CallerInfo>>({});
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferToAgent, setTransferToAgent] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleUpdateCallerInfo = (field: keyof CallerInfo, value: any) => {
    setCallerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleTransferCall = () => {
    if (selectedCall && transferToAgent) {
      onTransferCall(selectedCall.id, transferToAgent);
      setShowTransferModal(false);
      setTransferToAgent('');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: CallSession['status']) => {
    switch (status) {
      case 'incoming': return 'text-amber-400 bg-amber-500/20';
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'hold': return 'text-orange-400 bg-orange-500/20';
      case 'transferred': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const getUrgencyColor = (urgency: CallerInfo['urgency']) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calls List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Phone className="w-5 h-5 text-primary-400" />
          <span>Active Calls ({calls.length})</span>
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {calls.length === 0 ? (
            <div className="text-center py-8 text-dark-400">
              <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active calls</p>
            </div>
          ) : (
            calls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "bg-dark-800 rounded-lg p-4 border cursor-pointer transition-all duration-200",
                  selectedCall?.id === call.id
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-dark-700 hover:border-dark-600"
                )}
                onClick={() => onSelectCall(call)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {call.caller_name || call.caller_phone}
                      </p>
                      <p className="text-sm text-dark-400">
                        {call.caller_type && (
                          <span className="capitalize">{call.caller_type}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(call.status)
                    )}>
                      {call.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-dark-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(call.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      getUrgencyColor(call.caller_info.urgency)
                    )}>
                      {call.caller_info.urgency}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center space-x-2">
                  {call.status === 'incoming' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnswerCall(call.id);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm"
                    >
                      <PhoneIncoming className="w-3 h-3" />
                      <span>Answer</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEndCall(call.id);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm"
                  >
                    <PhoneOff className="w-3 h-3" />
                    <span>End</span>
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Call Details */}
      <div className="lg:col-span-2">
        {selectedCall ? (
          <div className="space-y-6">
            {/* Call Header */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      AI Voice Call Session
                    </h2>
                    <p className="text-dark-400">
                      Current Agent: {selectedCall.agent_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatDuration(selectedCall.duration)}
                    </p>
                    <p className="text-sm text-dark-400">Call Duration</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTransferModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>Transfer</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEndCall(selectedCall.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>End Call</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Call Status */}
              <div className="flex items-center space-x-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getStatusColor(selectedCall.status)
                )}>
                  {selectedCall.status}
                </span>
                
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getUrgencyColor(selectedCall.caller_info.urgency)
                )}>
                  {selectedCall.caller_info.urgency} priority
                </span>
                
                <div className="flex items-center space-x-2 text-sm text-dark-400">
                  <Circle className="w-4 h-4 text-red-400" />
                  <span>Recording</span>
                </div>
              </div>

              {/* Call Flow Status */}
              {agents.find(a => a.id === selectedCall.agent_id)?.type === 'primary' && (
                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-400">Call Routing in Progress</h4>
                      <p className="text-blue-300 text-sm">
                        The Primary Agent is identifying your needs to transfer you to the right specialist.
                      </p>
                    </div>
                  </div>
                  
                  {/* Quick Transfer Actions */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const breakdownAgent = agents.find(a => a.type === 'breakdown');
                        if (breakdownAgent) onTransferCall(selectedCall.id, breakdownAgent.id);
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      🚛 Breakdown
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const jobAgent = agents.find(a => a.type === 'job-application');
                        if (jobAgent) onTransferCall(selectedCall.id, jobAgent.id);
                      }}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      💼 Job Application
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const generalAgent = agents.find(a => a.type === 'general');
                        if (generalAgent) onTransferCall(selectedCall.id, generalAgent.id);
                      }}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      ❓ General
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Information Collection Status */}
            {agents.find(a => a.id === selectedCall.agent_id)?.type !== 'primary' && (
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-400">Information Collection</h3>
                    <p className="text-green-300 text-sm">
                      The {agents.find(a => a.id === selectedCall.agent_id)?.name} is gathering your information.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Caller Information Form */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary-400" />
                <span>Caller Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={callerInfo.name || selectedCall.caller_info.name || ''}
                    onChange={(e) => handleUpdateCallerInfo('name', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter caller name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={callerInfo.email || selectedCall.caller_info.email || ''}
                    onChange={(e) => handleUpdateCallerInfo('email', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={callerInfo.company || selectedCall.caller_info.company || ''}
                    onChange={(e) => handleUpdateCallerInfo('company', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Issue Type
                  </label>
                  <select
                    value={callerInfo.issue_type || selectedCall.caller_info.issue_type || ''}
                    onChange={(e) => handleUpdateCallerInfo('issue_type', e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select issue type</option>
                    <option value="breakdown">Breakdown</option>
                    <option value="accident">Accident</option>
                    <option value="delivery">Delivery</option>
                    <option value="paperwork">Paperwork</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {selectedCall.caller_info.issue_type === 'breakdown' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1">
                        Truck ID
                      </label>
                      <input
                        type="text"
                        value={callerInfo.truck_id || selectedCall.caller_info.truck_id || ''}
                        onChange={(e) => handleUpdateCallerInfo('truck_id', e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter truck ID"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={callerInfo.location || selectedCall.caller_info.location || ''}
                        onChange={(e) => handleUpdateCallerInfo('location', e.target.value)}
                        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter current location"
                      />
                    </div>
                  </>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={callerInfo.notes || selectedCall.caller_info.notes || ''}
                    onChange={(e) => handleUpdateCallerInfo('notes', e.target.value)}
                    rows={3}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add notes about the call"
                  />
                </div>
              </div>
            </div>

            {/* Call Transcript */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                <span>Live Transcript</span>
              </h3>
              
              <div className="bg-dark-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                {selectedCall.transcript.length === 0 ? (
                  <p className="text-dark-400 text-center py-4">
                    Transcript will appear here during the call...
                  </p>
                ) : (
                  <div className="space-y-3">
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
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-12 text-center">
            <Phone className="w-16 h-16 mx-auto mb-4 text-dark-600" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Call Selected
            </h3>
            <p className="text-dark-400">
              Select an active call from the list to view details
            </p>
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
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
            <h3 className="text-lg font-semibold text-white mb-4">Transfer Call</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Transfer to Agent
                </label>
                <select
                  value={transferToAgent}
                  onChange={(e) => setTransferToAgent(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose agent...</option>
                  {agents.filter(agent => agent.status === 'available').map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTransferCall}
                  disabled={!transferToAgent}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-lg transition-colors",
                    transferToAgent
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : "bg-dark-600 text-dark-400 cursor-not-allowed"
                  )}
                >
                  Transfer
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferToAgent('');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-dark-600 text-dark-300 hover:text-white transition-colors"
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

export default ActiveCallView; 