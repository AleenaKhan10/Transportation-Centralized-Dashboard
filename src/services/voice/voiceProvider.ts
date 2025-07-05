export interface VoiceProvider {
  speak(text: string, options?: VoiceOptions): Promise<void>;
  stop(): void;
  isSupported(): boolean;
  getVoices(): Promise<VoiceInfo[]>;
  setVoice(voiceId: string): void;
}

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
}

export interface VoiceInfo {
  id: string;
  name: string;
  language: string;
  gender?: 'male' | 'female' | 'neutral';
  provider: string;
  category?: string;
  accent?: string;
  description?: string;
  preview_url?: string;
}

// Web Speech API Implementation (Free)
export class WebSpeechProvider implements VoiceProvider {
  private synth: SpeechSynthesis;
  private currentVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  async getVoices(): Promise<VoiceInfo[]> {
    return new Promise((resolve) => {
      const getVoiceList = () => {
        const voices = this.synth.getVoices();
        const voiceInfos: VoiceInfo[] = voices.map(voice => ({
          id: voice.voiceURI,
          name: voice.name,
          language: voice.lang,
          gender: this.inferGender(voice.name),
          provider: 'web-speech'
        }));
        resolve(voiceInfos);
      };

      if (this.synth.getVoices().length > 0) {
        getVoiceList();
      } else {
        this.synth.onvoiceschanged = getVoiceList;
      }
    });
  }

  setVoice(voiceId: string): void {
    const voices = this.synth.getVoices();
    this.currentVoice = voices.find(voice => voice.voiceURI === voiceId) || null;
  }

  async speak(text: string, options: VoiceOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Set voice options
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      utterance.lang = options.language || 'en-US';

      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
      }

      // Handle events
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synth.speak(utterance);
    });
  }

  stop(): void {
    this.synth.cancel();
    this.currentUtterance = null;
  }

  private inferGender(voiceName: string): 'male' | 'female' | 'neutral' {
    const name = voiceName.toLowerCase();
    const maleIndicators = ['male', 'man', 'david', 'daniel', 'fred', 'albert', 'bruce', 'alex', 'tom'];
    const femaleIndicators = ['female', 'woman', 'victoria', 'karen', 'moira', 'tessa', 'samantha', 'allison', 'susan'];
    
    if (maleIndicators.some(indicator => name.includes(indicator))) return 'male';
    if (femaleIndicators.some(indicator => name.includes(indicator))) return 'female';
    return 'neutral';
  }
}

// ElevenLabs Provider (Premium Quality)
export class ElevenLabsProvider implements VoiceProvider {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private currentVoiceId: string;
  private currentAudio: HTMLAudioElement | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.currentVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Default to Bella voice
  }

  isSupported(): boolean {
    return !!this.apiKey && 'Audio' in window;
  }

  async getVoices(): Promise<VoiceInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        language: 'en-US',
        gender: this.inferGender(voice.name),
        provider: 'elevenlabs',
        category: voice.category || 'generated',
        accent: voice.labels?.accent || 'american',
        description: voice.description || '',
        preview_url: voice.preview_url
      }));
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      // Return default voices if API fails
      return [
        {
          id: 'EXAVITQu4vr4xnSDxMaL',
          name: 'Bella',
          language: 'en-US',
          gender: 'female',
          provider: 'elevenlabs',
          category: 'premade',
          accent: 'american',
          description: 'Young, soft and pleasant'
        },
        {
          id: 'ErXwobaYiN019PkySvjV',
          name: 'Antoni',
          language: 'en-US',
          gender: 'male',
          provider: 'elevenlabs',
          category: 'premade',
          accent: 'american',
          description: 'Well-rounded and versatile'
        },
        {
          id: 'VR6AewLTigWG4xSOukaG',
          name: 'Arnold',
          language: 'en-US',
          gender: 'male',
          provider: 'elevenlabs',
          category: 'premade',
          accent: 'american',
          description: 'Crisp and authoritative'
        },
        {
          id: 'pNInz6obpgDQGcFmaJgB',
          name: 'Adam',
          language: 'en-US',
          gender: 'male',
          provider: 'elevenlabs',
          category: 'premade',
          accent: 'american',
          description: 'Deep and resonant'
        }
      ];
    }
  }

  setVoice(voiceId: string): void {
    this.currentVoiceId = voiceId;
  }

  async speak(text: string, options: VoiceOptions = {}): Promise<void> {
    try {
      // Stop any current audio
      this.stop();

      const requestBody = {
        text: text,
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarity_boost || 0.75,
          style: options.style || 0.0
        }
      };

      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.currentVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise((resolve, reject) => {
        this.currentAudio = new Audio(audioUrl);
        this.currentAudio.volume = options.volume || 1.0;
        
        this.currentAudio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve();
        };

        this.currentAudio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(new Error(`Audio playback error: ${error}`));
        };

        this.currentAudio.play().catch(reject);
      });

    } catch (error) {
      console.error('ElevenLabs speech error:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  private inferGender(voiceName: string): 'male' | 'female' | 'neutral' {
    const name = voiceName.toLowerCase();
    const maleNames = ['antoni', 'arnold', 'adam', 'sam', 'josh', 'daniel', 'bill', 'charlie', 'thomas', 'michael'];
    const femaleNames = ['bella', 'rachel', 'domi', 'elli', 'freya', 'grace', 'isabella', 'matilda', 'nicole', 'dorothy'];
    
    if (maleNames.some(n => name.includes(n))) return 'male';
    if (femaleNames.some(n => name.includes(n))) return 'female';
    return 'neutral';
  }

  // Additional ElevenLabs features
  async getVoiceSettings(voiceId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}/settings`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch voice settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voice settings:', error);
      return null;
    }
  }

  async streamText(text: string, options: VoiceOptions = {}): Promise<ReadableStream> {
    const requestBody = {
      text: text,
      voice_settings: {
        stability: options.stability || 0.5,
        similarity_boost: options.similarity_boost || 0.75,
        style: options.style || 0.0
      }
    };

    const response = await fetch(`${this.baseUrl}/text-to-speech/${this.currentVoiceId}/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs streaming error: ${response.status}`);
    }

    return response.body!;
  }
}

// Voice Provider Factory
export class VoiceProviderFactory {
  static createProvider(type: 'web-speech' | 'elevenlabs', config?: any): VoiceProvider {
    switch (type) {
      case 'web-speech':
        return new WebSpeechProvider();
      case 'elevenlabs':
        if (!config?.apiKey) {
          throw new Error('ElevenLabs API key is required');
        }
        return new ElevenLabsProvider(config.apiKey);
      default:
        throw new Error(`Unsupported voice provider: ${type}`);
    }
  }
}

// Voice configuration for different agent types
export const VOICE_CONFIGS = {
  primary: {
    elevenlabs: {
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - friendly and professional
      settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0
      }
    },
    webSpeech: {
      preferredVoice: 'samantha',
      rate: 1.0,
      pitch: 1.0
    }
  },
  breakdown: {
    elevenlabs: {
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - calm and authoritative
      settings: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.1
      }
    },
    webSpeech: {
      preferredVoice: 'alex',
      rate: 0.9,
      pitch: 0.9
    }
  },
  'job-application': {
    elevenlabs: {
      voiceId: 'ErXwobaYiN019PkySvjV', // Antoni - warm and engaging
      settings: {
        stability: 0.6,
        similarity_boost: 0.75,
        style: 0.2
      }
    },
    webSpeech: {
      preferredVoice: 'daniel',
      rate: 1.0,
      pitch: 1.1
    }
  },
  general: {
    elevenlabs: {
      voiceId: 'VR6AewLTigWG4xSOukaG', // Arnold - professional and helpful
      settings: {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.0
      }
    },
    webSpeech: {
      preferredVoice: 'fred',
      rate: 1.0,
      pitch: 1.0
    }
  }
}; 