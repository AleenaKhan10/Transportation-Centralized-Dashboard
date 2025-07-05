import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  ArrowRightLeft,
  Zap,
  Activity,
  Circle,
  Settings,
  MessageSquare,
  User,
  Bot
} from 'lucide-react';
import { VoiceProviderFactory, VOICE_CONFIGS } from '../../services/voice/voiceProvider';
import { ConversationManager, ConversationState, ConversationMessage } from '../../services/conversation/conversationManager';
import { CallAgent, CallSession } from '../../types';
import { cn } from '../../utils/cn';

interface VoiceCallInterfaceProps {
  agent: CallAgent;
  session: CallSession;
  onTransfer: (toAgentType: string) => void;
  onEndCall: () => void;
  onUpdateSession: (session: CallSession) => void;
}

interface VoiceSettings {
  provider: 'web-speech' | 'elevenlabs';
  volume: number;
  stability: number;
  similarity_boost: number;
  autoListen: boolean;
}

const VoiceCallInterface: React.FC<VoiceCallInterfaceProps> = ({
  agent,
  session,
  onTransfer,
  onEndCall,
  onUpdateSession
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [settings, setSettings] = useState<VoiceSettings>({
    provider: 'elevenlabs',
    volume: 1.0,
    stability: 0.5,
    similarity_boost: 0.75,
    autoListen: true
  });
  const [error, setError] = useState<string | null>(null);

  const conversationManagerRef = useRef<ConversationManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ElevenLabs API Key
  const ELEVENLABS_API_KEY = 'sk_c6fafd9e77bda3c4ce8cf66c6d4f0f9b1ce92ccf9ee1bad1';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create voice provider
      const voiceProvider = VoiceProviderFactory.createProvider(settings.provider, {
        apiKey: ELEVENLABS_API_KEY
      });

      // Set up voice configuration for agent type
      const agentType = agent.type as keyof typeof VOICE_CONFIGS;
      const voiceConfig = VOICE_CONFIGS[agentType];
      
      if (settings.provider === 'elevenlabs' && voiceConfig.elevenlabs) {
        voiceProvider.setVoice(voiceConfig.elevenlabs.voiceId);
      }

      // Create conversation manager
      conversationManagerRef.current = new ConversationManager(
        voiceProvider,
        session.id,
        agent.id,
        agent.type
      );

      // Set up callbacks
      conversationManagerRef.current.setCallbacks({
        onStateUpdate: (state) => {
          setConversationState(state);
          setIsListening(state.isListening);
          
          // Update session with collected data
          if (state.collectedData) {
            const updatedSession = {
              ...session,
              caller_info: {
                ...session.caller_info,
                form_data: state.collectedData
              }
            };
            onUpdateSession(updatedSession);
          }
        },
        onMessageUpdate: (message) => {
          setMessages(prev => [...prev, message]);
          setIsSpeaking(message.speaker === 'agent');
        },
        onTransferRequest: (toAgentType) => {
          onTransfer(toAgentType);
        }
      });

      // Start conversation
      await conversationManagerRef.current.startConversation();
      setIsConnected(true);
      
    } catch (error) {
      console.error('Error initializing conversation:', error);
      setError(`Failed to initialize voice conversation: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      if (conversationManagerRef.current) {
        await conversationManagerRef.current.endConversation();
      }
      setIsConnected(false);
      setMessages([]);
      setConversationState(null);
      onEndCall();
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  const toggleListening = () => {
    if (conversationManagerRef.current) {
      if (isListening) {
        conversationManagerRef.current.stopListening();
      } else {
        conversationManagerRef.current.startListening();
      }
    }
  };

  const handleSettingsChange = (key: keyof VoiceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAgentStatusColor = (agentType: string) => {
    switch (agentType) {
      case 'primary': return 'from-primary-500 to-secondary-500';
      case 'breakdown': return 'from-red-500 to-orange-500';
      case 'job-application': return 'from-green-500 to-blue-500';
      case 'general': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            `bg-gradient-to-br ${getAgentStatusColor(agent.type)}`,
            "shadow-glow"
          )}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
            <p className="text-dark-400 text-sm">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="text-dark-400 text-sm">
            {isConnected ? formatDuration(session.duration) : '0:00'}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <Circle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Error</span>
          </div>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-700 rounded-lg p-4 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Voice Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Provider
                </label>
                <select
                  value={settings.provider}
                  onChange={(e) => handleSettingsChange('provider', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="elevenlabs">ElevenLabs (Premium)</option>
                  <option value="web-speech">Web Speech API (Free)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Volume: {settings.volume.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleSettingsChange('volume', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {settings.provider === 'elevenlabs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Stability: {settings.stability.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.stability}
                      onChange={(e) => handleSettingsChange('stability', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Similarity Boost: {settings.similarity_boost.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.similarity_boost}
                      onChange={(e) => handleSettingsChange('similarity_boost', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isConnected ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializeConversation}
            disabled={isLoading}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors",
              isLoading
                ? "bg-dark-600 text-dark-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-glow"
            )}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                <span>Start Voice Call</span>
              </>
            )}
          </motion.button>
        ) : (
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              className={cn(
                "p-3 rounded-full transition-colors",
                isListening
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-dark-700 hover:bg-dark-600 text-dark-300"
              )}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={endConversation}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      {isConnected && (
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isSpeaking ? "bg-blue-400" : "bg-dark-600"
            )} />
            <span className="text-dark-400">AI Speaking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isListening ? "bg-green-400" : "bg-dark-600"
            )} />
            <span className="text-dark-400">Listening</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary-400" />
            <span className="text-dark-400">
              {conversationState?.currentStep || 'Ready'}
            </span>
          </div>
        </div>
      )}

      {/* Conversation Messages */}
      {messages.length > 0 && (
        <div className="bg-dark-700 rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Live Conversation</span>
          </h3>
          <div className="space-y-2">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start space-x-3",
                  message.speaker === 'agent' ? 'justify-start' : 'justify-end'
                )}
              >
                <div className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.speaker === 'agent'
                    ? "bg-primary-500/20 text-primary-100"
                    : "bg-secondary-500/20 text-secondary-100"
                )}>
                  <div className="flex items-center space-x-2 mb-1">
                    {message.speaker === 'agent' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="font-medium text-xs">
                      {message.speaker === 'agent' ? agent.name : 'You'}
                    </span>
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Collected Data Display */}
      {conversationState?.collectedData && Object.keys(conversationState.collectedData).length > 0 && (
        <div className="bg-dark-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Collected Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(conversationState.collectedData).map(([key, value]) => (
              <div key={key} className="bg-dark-800 rounded-lg p-3">
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                <p className="text-white text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCallInterface; 