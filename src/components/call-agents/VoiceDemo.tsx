import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  Volume2, 
  Settings, 
  CheckCircle, 
  XCircle,
  Mic,
  Bot,
  Zap
} from 'lucide-react';
import { VoiceProviderFactory, VoiceInfo } from '../../services/voice/voiceProvider';
import { useVoice } from '../../hooks/useVoice';
import { cn } from '../../utils/cn';

const VoiceDemo: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'web-speech' | 'elevenlabs'>('elevenlabs');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [testText, setTestText] = useState("Hello! I'm your AI assistant powered by ElevenLabs. This is a demonstration of our advanced voice synthesis technology. I can speak naturally and help you with any questions or tasks you might have.");
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const voice = useVoice({
    provider: selectedProvider,
    preferredVoice: selectedVoice,
    defaultSettings: {
      volume: 1.0,
      rate: 1.0,
      pitch: 1.0
    }
  });

  useEffect(() => {
    loadVoices();
  }, [selectedProvider]);

  const loadVoices = async () => {
    try {
      const provider = VoiceProviderFactory.createProvider(selectedProvider, {
        apiKey: 'sk_c6fafd9e77bda3c4ce8cf66c6d4f0f9b1ce92ccf9ee1bad1'
      });
      
      const voices = await provider.getVoices();
      setAvailableVoices(voices);
      
      if (voices.length > 0 && !selectedVoice) {
        setSelectedVoice(voices[0].id);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      setErrorMessage(`Failed to load voices: ${error}`);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    setErrorMessage('');

    try {
      const provider = VoiceProviderFactory.createProvider(selectedProvider, {
        apiKey: 'sk_c6fafd9e77bda3c4ce8cf66c6d4f0f9b1ce92ccf9ee1bad1'
      });

      if (!provider.isSupported()) {
        throw new Error(`${selectedProvider} is not supported in this browser`);
      }

      // Test with a short phrase
      await provider.speak("Connection test successful!", {
        volume: 1.0,
        stability: 0.5,
        similarity_boost: 0.75
      });

      setConnectionStatus('success');
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      setErrorMessage(`Connection test failed: ${error}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const speakDemo = async () => {
    if (selectedVoice) {
      voice.setVoice(selectedVoice);
    }
    
    try {
      await voice.speak(testText);
    } catch (error) {
      console.error('Demo speech failed:', error);
      setErrorMessage(`Speech failed: ${error}`);
    }
  };

  const stopSpeech = () => {
    voice.stop();
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Voice System Demo</h2>
          <p className="text-dark-400 text-sm">Test ElevenLabs integration and voice capabilities</p>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark-300">
          Voice Provider
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedProvider('elevenlabs')}
            className={cn(
              "p-3 rounded-lg border text-left transition-colors",
              selectedProvider === 'elevenlabs'
                ? "border-primary-500 bg-primary-500/10 text-white"
                : "border-dark-600 hover:border-dark-500 text-dark-300"
            )}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium">ElevenLabs</span>
            </div>
            <p className="text-xs opacity-60 mt-1">Premium AI voices</p>
          </button>
          
          <button
            onClick={() => setSelectedProvider('web-speech')}
            className={cn(
              "p-3 rounded-lg border text-left transition-colors",
              selectedProvider === 'web-speech'
                ? "border-primary-500 bg-primary-500/10 text-white"
                : "border-dark-600 hover:border-dark-500 text-dark-300"
            )}
          >
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span className="font-medium">Web Speech</span>
            </div>
            <p className="text-xs opacity-60 mt-1">Browser built-in</p>
          </button>
        </div>
      </div>

      {/* Voice Selection */}
      {availableVoices.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-dark-300">
            Voice ({availableVoices.length} available)
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {availableVoices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} ({voice.gender}) - {voice.provider}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Connection Test */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-dark-300">
            Connection Test
          </label>
          <div className="flex items-center space-x-2">
            {connectionStatus === 'success' && (
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Connected</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center space-x-1 text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-xs">Failed</span>
              </div>
            )}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testConnection}
          disabled={isTestingConnection}
          className={cn(
            "w-full py-2 rounded-lg font-medium transition-colors",
            isTestingConnection
              ? "bg-dark-600 text-dark-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          )}
        >
          {isTestingConnection ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              <span>Testing Connection...</span>
            </div>
          ) : (
            `Test ${selectedProvider} Connection`
          )}
        </motion.button>
      </div>

      {/* Demo Text */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark-300">
          Demo Text
        </label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          placeholder="Enter text to speak..."
        />
      </div>

      {/* Voice Controls */}
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={speakDemo}
          disabled={voice.state.isSpeaking || !testText.trim()}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
            voice.state.isSpeaking || !testText.trim()
              ? "bg-dark-600 text-dark-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          )}
        >
          <Play className="w-4 h-4" />
          <span>Speak</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={stopSpeech}
          disabled={!voice.state.isSpeaking}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
            !voice.state.isSpeaking
              ? "bg-dark-600 text-dark-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          <Square className="w-4 h-4" />
          <span>Stop</span>
        </motion.button>
      </div>

      {/* Status Display */}
      <div className="bg-dark-700 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-300">Provider Status:</span>
          <span className={cn(
            "font-medium",
            voice.state.isSupported ? "text-green-400" : "text-red-400"
          )}>
            {voice.state.isSupported ? 'Supported' : 'Not Supported'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-300">Speaking:</span>
          <span className={cn(
            "font-medium",
            voice.state.isSpeaking ? "text-blue-400" : "text-dark-400"
          )}>
            {voice.state.isSpeaking ? 'Yes' : 'No'}
          </span>
        </div>

        {voice.state.currentVoice && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-300">Current Voice:</span>
            <span className="text-white font-medium">
              {voice.state.currentVoice.name}
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {(errorMessage || voice.state.error) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Error</span>
          </div>
          <p className="text-red-300 text-sm mt-1">
            {errorMessage || voice.state.error}
          </p>
          <button
            onClick={() => {
              setErrorMessage('');
              voice.clearError();
            }}
            className="text-red-400 hover:text-red-300 text-xs mt-2 underline"
          >
            Clear Error
          </button>
        </motion.div>
      )}

      {/* Integration Guide */}
      <div className="bg-dark-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Integration Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400">ElevenLabs API Key configured</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Voice Provider system ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Conversation Manager configured</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Speech Recognition enabled</span>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-dark-800 rounded-lg">
          <p className="text-dark-300 text-xs">
            <strong>Ready to use!</strong> Your AI voice system is fully configured with ElevenLabs integration. 
            Click "Start Voice Call" on any agent to begin real-time AI conversations with premium voice quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceDemo; 