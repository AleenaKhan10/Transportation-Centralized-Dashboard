import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  PhoneCall, 
  Users, 
  Clock, 
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  Timer,
  Activity
} from 'lucide-react';
import { 
  CallAgent, 
  CallSession, 
  CallStats, 
  CallViewType,
  CallsFilter,
  CallbackRequest 
} from '../types';
import { callAgentService } from '../services/callAgentService';
import CallControlPanel from '../components/call-agents/CallControlPanel';
import ActiveCallView from '../components/call-agents/ActiveCallView';
import CallHistoryView from '../components/call-agents/CallHistoryView';
import CallAgentsView from '../components/call-agents/CallAgentsView';
import CallCallbacksView from '../components/call-agents/CallCallbacksView';
import CallAnalyticsView from '../components/call-agents/CallAnalyticsView';
import CallFilters from '../components/call-agents/CallFilters';
import VoiceDemo from '../components/call-agents/VoiceDemo';

const CallAgentsPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<CallViewType>('active');
  const [agents, setAgents] = useState<CallAgent[]>([]);
  const [activeCalls, setActiveCalls] = useState<CallSession[]>([]);
  const [callHistory, setCallHistory] = useState<CallSession[]>([]);
  const [stats, setStats] = useState<CallStats | null>(null);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CallsFilter>({});
  const [selectedCall, setSelectedCall] = useState<CallSession | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [agentsData, callsData, callbacksData] = await Promise.all([
        callAgentService.getAgents(),
        callAgentService.getCalls({ status: 'active' }),
        callAgentService.getCallbackRequests()
      ]);

      setAgents(agentsData);
      setActiveCalls(callsData.data);
      setStats(callsData.stats);
      setCallbacks(callbacksData);
    } catch (error) {
      console.error('Error loading call agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCallHistory = async (newFilters: CallsFilter = {}) => {
    try {
      const response = await callAgentService.getCalls({
        ...newFilters,
        status: 'completed'
      });
      setCallHistory(response.data);
    } catch (error) {
      console.error('Error loading call history:', error);
    }
  };

  const handleViewChange = (view: CallViewType) => {
    setCurrentView(view);
    if (view === 'history') {
      loadCallHistory(filters);
    }
  };

  const handleFilterChange = (newFilters: CallsFilter) => {
    setFilters(newFilters);
    if (currentView === 'history') {
      loadCallHistory(newFilters);
    }
  };

  const handleStartCall = async (callType: string, agentId: string) => {
    try {
      const newCall = await callAgentService.startCall(callType, agentId);
      setActiveCalls(prev => [newCall, ...prev]);
      setSelectedCall(newCall);
      setCurrentView('active');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleAnswerCall = async (callId: string) => {
    try {
      const updatedCall = await callAgentService.answerCall(callId);
      setActiveCalls(prev => prev.map(call => 
        call.id === callId ? updatedCall : call
      ));
      setSelectedCall(updatedCall);
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const handleEndCall = async (callId: string) => {
    try {
      const completedCall = await callAgentService.endCall(callId);
      setActiveCalls(prev => prev.filter(call => call.id !== callId));
      setCallHistory(prev => [completedCall, ...prev]);
      if (selectedCall?.id === callId) {
        setSelectedCall(null);
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const handleTransferCall = async (callId: string, toAgentId: string) => {
    try {
      const transferredCall = await callAgentService.transferCall(callId, toAgentId);
      setActiveCalls(prev => prev.map(call => 
        call.id === callId ? transferredCall : call
      ));
      if (selectedCall?.id === callId) {
        setSelectedCall(transferredCall);
      }
    } catch (error) {
      console.error('Error transferring call:', error);
    }
  };

  const viewTabs = [
    { id: 'active', label: 'Active Calls', icon: PhoneCall, count: activeCalls.length },
    { id: 'history', label: 'Call History', icon: Clock, count: callHistory.length },
    { id: 'agents', label: 'Agents', icon: Users, count: agents.length },
    { id: 'callbacks', label: 'Callbacks', icon: Calendar, count: callbacks.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 0 },
    { id: 'voice-demo', label: 'Voice Demo', icon: Activity, count: 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full mx-auto"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-16 h-16 border-4 border-secondary-400/30 rounded-full mx-auto"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-gradient">
              Loading Call Agents
            </h2>
            <p className="text-dark-400">Initializing voice AI system...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-glow">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-gradient">
                Call Agents
              </h1>
              <p className="text-dark-400">
                AI-powered voice system for inbound and outbound calls
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-dark-800 rounded-lg px-4 py-2 border border-dark-700">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">
                {agents.filter(a => a.status === 'available').length} Available
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-dark-800 rounded-lg px-4 py-2 border border-dark-700">
              <Timer className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white">
                {activeCalls.length} Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Call Control Panel */}
        <CallControlPanel 
          agents={agents}
          activeCalls={activeCalls}
          onStartCall={handleStartCall}
          onAnswerCall={handleAnswerCall}
          onEndCall={handleEndCall}
          onTransferCall={handleTransferCall}
        />

        {/* View Tabs */}
        <div className="flex space-x-1 bg-dark-800 rounded-lg p-1 border border-dark-700">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleViewChange(tab.id as CallViewType)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                currentView === tab.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <CallFilters
          filters={filters}
          agents={agents}
          onFiltersChange={handleFilterChange}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {currentView === 'active' && (
            <ActiveCallView
              calls={activeCalls}
              agents={agents}
              selectedCall={selectedCall}
              onSelectCall={setSelectedCall}
              onAnswerCall={handleAnswerCall}
              onEndCall={handleEndCall}
              onTransferCall={handleTransferCall}
            />
          )}
          
          {currentView === 'history' && (
            <CallHistoryView
              calls={callHistory}
              agents={agents}
              onSelectCall={setSelectedCall}
            />
          )}
          
          {currentView === 'agents' && (
            <CallAgentsView
              agents={agents}
              onAgentStatusChange={loadInitialData}
            />
          )}
          
          {currentView === 'callbacks' && (
            <CallCallbacksView
              callbacks={callbacks}
              onCallbackScheduled={loadInitialData}
            />
          )}
          
          {currentView === 'analytics' && stats && (
            <CallAnalyticsView stats={stats} />
          )}

          {currentView === 'voice-demo' && (
            <VoiceDemo />
          )}
        </div>
      </div>
    </div>
  );
};

export default CallAgentsPage; 