import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneOff,
  ArrowRightLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Circle,
  Pause,
  Play,
  AlertCircle,
  Bot,
  Zap,
  Settings,
  User
} from 'lucide-react';
import { CallAgent, CallSession } from '../../types';
import { cn } from '../../utils/cn';
import VoiceCallInterface from './VoiceCallInterface';

interface CallControlPanelProps {
  agents: CallAgent[];
  activeCalls: CallSession[];
  onStartCall: (callType: string, agentId: string) => void;
  onAnswerCall: (callId: string) => void;
  onEndCall: (callId: string) => void;
  onTransferCall: (callId: string, toAgentId: string) => void;
}

const CallControlPanel: React.FC<CallControlPanelProps> = ({
  agents,
  activeCalls,
  onStartCall,
  onAnswerCall,
  onEndCall,
  onTransferCall
}) => {
  const [callStates, setCallStates] = useState<Record<string, {
    muted: boolean;
    recording: boolean;
    paused: boolean;
  }>>({});
  const [showTransferModal, setShowTransferModal] = useState<string | null>(null);
  const [transferToAgent, setTransferToAgent] = useState('');
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CallAgent | null>(null);
  const [activeVoiceCall, setActiveVoiceCall] = useState<CallSession | null>(null);

  const handleCallStateChange = (callId: string, state: Partial<typeof callStates[string]>) => {
    setCallStates(prev => ({
      ...prev,
      [callId]: { ...prev[callId], ...state }
    }));
  };

  const handleStartVoiceCall = (agent: CallAgent) => {
    const newCall: CallSession = {
      id: Date.now().toString(),
      call_id: `voice_call_${Date.now()}`,
      caller_phone: '+1234567890',
      caller_name: 'Voice Call User',
      caller_type: 'customer',
      agent_id: agent.id,
      agent_name: agent.name,
      status: 'active',
      call_type: 'outbound',
      duration: 0,
      start_time: new Date().toISOString(),
      recording_url: '',
      transcript: [],
      call_logs: [],
      caller_info: {
        name: 'Voice Call User',
        phone: '+1234567890',
        urgency: 'medium',
        notes: '',
        previous_calls: 0,
        form_data: {}
      },
      follow_up_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSelectedAgent(agent);
    setActiveVoiceCall(newCall);
    setShowVoiceInterface(true);
    onStartCall('voice-call', agent.id);
  };

  const handleEndVoiceCall = () => {
    setShowVoiceInterface(false);
    setSelectedAgent(null);
    if (activeVoiceCall) {
      onEndCall(activeVoiceCall.id);
      setActiveVoiceCall(null);
    }
  };

  const handleTransferVoiceCall = (toAgentType: string) => {
    const targetAgent = agents.find(a => a.type === toAgentType);
    if (targetAgent && activeVoiceCall) {
      setSelectedAgent(targetAgent);
      const updatedCall = {
        ...activeVoiceCall,
        agent_id: targetAgent.id,
        agent_name: targetAgent.name
      };
      setActiveVoiceCall(updatedCall);
      onTransferCall(activeVoiceCall.id, targetAgent.id);
    }
  };

  const handleUpdateVoiceSession = (session: CallSession) => {
    setActiveVoiceCall(session);
  };

  const handleTransferCall = (callId: string) => {
    if (transferToAgent) {
      onTransferCall(callId, transferToAgent);
      setShowTransferModal(null);
      setTransferToAgent('');
    }
  };

  const availableAgents = agents.filter(agent => agent.status === 'available');
  const incomingCalls = activeCalls.filter(call => call.status === 'incoming');
  const ongoingCalls = activeCalls.filter(call => call.status === 'active');

  return (
    <div className="space-y-6">
      {/* Voice Call Interface */}
      <AnimatePresence>
        {showVoiceInterface && selectedAgent && activeVoiceCall && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-900 rounded-xl border border-dark-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Voice AI Call</h2>
                <button
                  onClick={handleEndVoiceCall}
                  className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
              
              <VoiceCallInterface
                agent={selectedAgent}
                session={activeVoiceCall}
                onTransfer={handleTransferVoiceCall}
                onEndCall={handleEndVoiceCall}
                onUpdateSession={handleUpdateVoiceSession}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-6"
      >
        {/* Incoming Calls Alert */}
        {incomingCalls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <PhoneIncoming className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-amber-400">
                  Incoming Calls ({incomingCalls.length})
                </h3>
                <p className="text-amber-300 text-sm">
                  {incomingCalls.length === 1 ? 'Call' : 'Calls'} waiting to be answered
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {incomingCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between bg-dark-700 rounded-lg p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {call.caller_name || call.caller_phone}
                      </p>
                      <p className="text-sm text-dark-400">
                        {call.caller_phone} • {call.agent_name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAnswerCall(call.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <PhoneIncoming className="w-4 h-4" />
                    <span>Answer</span>
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Voice Agents */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary-400" />
            <span>AI Voice Agents</span>
            <div className="flex items-center space-x-1 ml-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">ElevenLabs Powered</span>
            </div>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-700 rounded-lg p-4 border border-dark-600 hover:border-primary-500/50 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    agent.type === 'primary' && 'bg-gradient-to-br from-primary-500 to-secondary-500',
                    agent.type === 'breakdown' && 'bg-gradient-to-br from-red-500 to-orange-500',
                    agent.type === 'job-application' && 'bg-gradient-to-br from-green-500 to-blue-500',
                    agent.type === 'general' && 'bg-gradient-to-br from-purple-500 to-pink-500'
                  )}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{agent.name}</h4>
                    <p className="text-sm text-dark-400 capitalize">{agent.type}</p>
                  </div>
                </div>
                <p className="text-dark-300 text-sm mb-4">
                  {agent.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      agent.status === 'available' ? 'bg-green-400' : 'bg-red-400'
                    )} />
                    <span className="text-xs text-dark-400 capitalize">
                      {agent.status}
                    </span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartVoiceCall(agent)}
                    disabled={agent.status !== 'available' || showVoiceInterface}
                    className={cn(
                      "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium text-sm",
                      agent.status === 'available' && !showVoiceInterface
                        ? "bg-primary-500 hover:bg-primary-600 text-white shadow-glow"
                        : "bg-dark-600 text-dark-400 cursor-not-allowed"
                    )}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Start Voice Call</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Calls Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Phone className="w-5 h-5 text-secondary-400" />
            <span>Active Calls ({ongoingCalls.length})</span>
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {ongoingCalls.length === 0 ? (
              <div className="text-center py-8 text-dark-400">
                <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No active calls</p>
              </div>
            ) : (
              ongoingCalls.map((call) => {
                const callState = callStates[call.id] || { muted: false, recording: false, paused: false };
                return (
                  <div
                    key={call.id}
                    className="bg-dark-700 rounded-lg p-3 border border-dark-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Phone className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {call.caller_name || call.caller_phone}
                          </p>
                          <p className="text-sm text-dark-400">
                            {call.agent_name} • {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCallStateChange(call.id, { muted: !callState.muted })}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            callState.muted 
                              ? "bg-red-500 hover:bg-red-600 text-white" 
                              : "bg-dark-600 hover:bg-dark-500 text-dark-300"
                          )}
                        >
                          {callState.muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowTransferModal(call.id)}
                          className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-dark-300 transition-colors"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEndCall(call.id)}
                          className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                          <PhoneOff className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-dark-800 rounded-lg border border-dark-700 p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Transfer Call</h3>
              <div className="space-y-3 mb-4">
                {availableAgents.map((agent) => (
                  <motion.button
                    key={agent.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTransferToAgent(agent.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-colors",
                      transferToAgent === agent.id
                        ? "border-primary-500 bg-primary-500/10 text-white"
                        : "border-dark-600 hover:border-dark-500 text-dark-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        agent.type === 'primary' && 'bg-gradient-to-br from-primary-500 to-secondary-500',
                        agent.type === 'breakdown' && 'bg-gradient-to-br from-red-500 to-orange-500',
                        agent.type === 'job-application' && 'bg-gradient-to-br from-green-500 to-blue-500',
                        agent.type === 'general' && 'bg-gradient-to-br from-purple-500 to-pink-500'
                      )}>
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm opacity-60">{agent.type}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTransferCall(showTransferModal)}
                  disabled={!transferToAgent}
                  className={cn(
                    "flex-1 py-2 rounded-lg font-medium transition-colors",
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
                    setShowTransferModal(null);
                    setTransferToAgent('');
                  }}
                  className="flex-1 py-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-dark-300 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CallControlPanel; 