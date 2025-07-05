import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceProvider, VoiceProviderFactory, VoiceInfo } from '../services/voice/voiceProvider';

export interface VoiceState {
  isInitialized: boolean;
  isSupported: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentVoice: VoiceInfo | null;
  availableVoices: VoiceInfo[];
  volume: number;
  rate: number;
  pitch: number;
  error: string | null;
}

export interface UseVoiceOptions {
  provider?: 'web-speech' | 'elevenlabs';
  autoStart?: boolean;
  language?: string;
  preferredVoice?: string;
  defaultSettings?: {
    volume?: number;
    rate?: number;
    pitch?: number;
  };
}

export interface UseVoiceReturn {
  state: VoiceState;
  speak: (text: string) => Promise<void>;
  stop: () => void;
  setVoice: (voiceId: string) => void;
  setVolume: (volume: number) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  startListening: () => void;
  stopListening: () => void;
  onUserSpeech: (callback: (text: string) => void) => void;
  clearError: () => void;
}

export const useVoice = (options: UseVoiceOptions = {}): UseVoiceReturn => {
  const [state, setState] = useState<VoiceState>({
    isInitialized: false,
    isSupported: false,
    isSpeaking: false,
    isListening: false,
    currentVoice: null,
    availableVoices: [],
    volume: options.defaultSettings?.volume || 1.0,
    rate: options.defaultSettings?.rate || 1.0,
    pitch: options.defaultSettings?.pitch || 1.0,
    error: null,
  });

  const voiceProviderRef = useRef<VoiceProvider | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const userSpeechCallbackRef = useRef<((text: string) => void) | null>(null);

  // Initialize voice provider
  useEffect(() => {
    const initializeVoice = async () => {
      try {
        const provider = VoiceProviderFactory.createProvider(
          options.provider || 'web-speech',
          options
        );

        if (!provider.isSupported()) {
          setState(prev => ({
            ...prev,
            error: 'Voice synthesis is not supported in this browser',
            isSupported: false,
            isInitialized: true,
          }));
          return;
        }

        voiceProviderRef.current = provider;

        // Get available voices
        const voices = await provider.getVoices();
        
        // Select preferred voice or default to first available
        let selectedVoice = voices[0];
        if (options.preferredVoice) {
          const preferred = voices.find(v => 
            v.id === options.preferredVoice || 
            v.name.toLowerCase().includes(options.preferredVoice!.toLowerCase())
          );
          if (preferred) selectedVoice = preferred;
        }

        if (selectedVoice) {
          provider.setVoice(selectedVoice.id);
        }

        setState(prev => ({
          ...prev,
          isInitialized: true,
          isSupported: true,
          availableVoices: voices,
          currentVoice: selectedVoice,
        }));

      } catch (error) {
        setState(prev => ({
          ...prev,
          error: `Failed to initialize voice: ${error}`,
          isInitialized: true,
          isSupported: false,
        }));
      }
    };

    initializeVoice();
  }, [options.provider, options.preferredVoice]);

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = options.language || 'en-US';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          userSpeechCallbackRef.current?.(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setState(prev => ({ 
          ...prev, 
          error: `Speech recognition error: ${event.error}`,
          isListening: false 
        }));
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      recognitionRef.current = recognition;
    };

    initializeSpeechRecognition();
  }, [options.language]);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!voiceProviderRef.current || !state.isSupported) {
      throw new Error('Voice provider not available');
    }

    try {
      setState(prev => ({ ...prev, isSpeaking: true, error: null }));

      await voiceProviderRef.current.speak(text, {
        volume: state.volume,
        rate: state.rate,
        pitch: state.pitch,
        language: options.language,
      });

      setState(prev => ({ ...prev, isSpeaking: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSpeaking: false,
        error: `Speech error: ${error}` 
      }));
      throw error;
    }
  }, [state.volume, state.rate, state.pitch, state.isSupported, options.language]);

  const stop = useCallback(() => {
    if (voiceProviderRef.current) {
      voiceProviderRef.current.stop();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    if (voiceProviderRef.current) {
      voiceProviderRef.current.setVoice(voiceId);
      const selectedVoice = state.availableVoices.find(v => v.id === voiceId);
      setState(prev => ({ ...prev, currentVoice: selectedVoice || null }));
    }
  }, [state.availableVoices]);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate: Math.max(0.1, Math.min(10, rate)) }));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setState(prev => ({ ...prev, pitch: Math.max(0, Math.min(2, pitch)) }));
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: `Failed to start listening: ${error}` 
        }));
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const onUserSpeech = useCallback((callback: (text: string) => void) => {
    userSpeechCallbackRef.current = callback;
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    state,
    speak,
    stop,
    setVoice,
    setVolume,
    setRate,
    setPitch,
    startListening,
    stopListening,
    onUserSpeech,
    clearError,
  };
};

// Helper hook for managing conversation state
export interface ConversationState {
  isActive: boolean;
  messages: Array<{
    id: string;
    speaker: 'agent' | 'user';
    text: string;
    timestamp: Date;
  }>;
  currentAgent: string;
  collectedData: Record<string, any>;
}

export const useConversation = () => {
  const [state, setState] = useState<ConversationState>({
    isActive: false,
    messages: [],
    currentAgent: 'primary',
    collectedData: {},
  });

  const addMessage = useCallback((speaker: 'agent' | 'user', text: string) => {
    const message = {
      id: Date.now().toString(),
      speaker,
      text,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const updateCollectedData = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      collectedData: {
        ...prev.collectedData,
        [key]: value,
      },
    }));
  }, []);

  const switchAgent = useCallback((agentType: string) => {
    setState(prev => ({
      ...prev,
      currentAgent: agentType,
    }));
  }, []);

  const startConversation = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const endConversation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      messages: [],
      collectedData: {},
      currentAgent: 'primary',
    }));
  }, []);

  return {
    state,
    addMessage,
    updateCollectedData,
    switchAgent,
    startConversation,
    endConversation,
  };
}; 