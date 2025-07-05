import { VoiceProvider } from '../voice/voiceProvider';
import { callAgentService } from '../callAgentService';
import { CallAgent, CallSession, CallTranscript, CallLog } from '../../types';
import { conversationTemplates, getRandomResponse } from '../../constants/conversation';

export interface ConversationState {
  sessionId: string;
  agentType: string;
  agentId: string;
  currentStep: string;
  collectedData: Record<string, any>;
  isListening: boolean;
  isTransferring: boolean;
  transcript: CallTranscript[];
  logs: CallLog[];
}

export interface ConversationMessage {
  speaker: 'agent' | 'user';
  text: string;
  timestamp: Date;
  confidence?: number;
  intent?: string;
}

export class ConversationManager {
  private voiceProvider: VoiceProvider;
  private state: ConversationState;
  private recognition: SpeechRecognition | null = null;
  private onStateUpdate?: (state: ConversationState) => void;
  private onMessageUpdate?: (message: ConversationMessage) => void;
  private onTransferRequest?: (toAgentType: string) => void;

  constructor(
    voiceProvider: VoiceProvider,
    sessionId: string,
    agentId: string,
    agentType: string
  ) {
    this.voiceProvider = voiceProvider;
    this.state = {
      sessionId,
      agentId,
      agentType,
      currentStep: 'greeting',
      collectedData: {},
      isListening: false,
      isTransferring: false,
      transcript: [],
      logs: []
    };

    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          this.handleUserInput(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.addLog('error', `Speech recognition error: ${event.error}`);
      };
    }
  }

  public setCallbacks(callbacks: {
    onStateUpdate?: (state: ConversationState) => void;
    onMessageUpdate?: (message: ConversationMessage) => void;
    onTransferRequest?: (toAgentType: string) => void;
  }): void {
    this.onStateUpdate = callbacks.onStateUpdate;
    this.onMessageUpdate = callbacks.onMessageUpdate;
    this.onTransferRequest = callbacks.onTransferRequest;
  }

  public async startConversation(): Promise<void> {
    const greeting = this.getGreeting();
    await this.speak(greeting);
    this.startListening();
  }

  public async speak(text: string): Promise<void> {
    try {
      const message: ConversationMessage = {
        speaker: 'agent',
        text,
        timestamp: new Date()
      };

      this.onMessageUpdate?.(message);
      this.addTranscript('agent', text);
      this.addLog('agent_response', text);

      await this.voiceProvider.speak(text);
    } catch (error) {
      console.error('Speech error:', error);
      this.addLog('error', `Speech error: ${error}`);
    }
  }

  public startListening(): void {
    if (this.recognition && !this.state.isListening) {
      this.state.isListening = true;
      this.recognition.start();
      this.addLog('listening_started', 'Started listening for user input');
      this.updateState();
    }
  }

  public stopListening(): void {
    if (this.recognition && this.state.isListening) {
      this.state.isListening = false;
      this.recognition.stop();
      this.addLog('listening_stopped', 'Stopped listening');
      this.updateState();
    }
  }

  public async handleUserInput(input: string): Promise<void> {
    const message: ConversationMessage = {
      speaker: 'user',
      text: input,
      timestamp: new Date()
    };

    this.onMessageUpdate?.(message);
    this.addTranscript('user', input);
    this.addLog('user_input', input);

    // Process the input based on current agent type and step
    const response = await this.processInput(input);
    
    if (response.shouldTransfer) {
      await this.handleTransfer(response.transferTo!);
    } else {
      await this.speak(response.text);
      
      if (response.nextStep) {
        this.state.currentStep = response.nextStep;
        this.updateState();
      }
    }
  }

  private async processInput(input: string): Promise<{
    text: string;
    nextStep?: string;
    shouldTransfer?: boolean;
    transferTo?: string;
  }> {
    const lowerInput = input.toLowerCase();
    
    // Intent detection for primary agent
    if (this.state.agentType === 'primary') {
      return this.processPrimaryAgentInput(lowerInput);
    }
    
    // Specialized agent processing
    switch (this.state.agentType) {
      case 'breakdown':
        return this.processBreakdownInput(lowerInput);
      case 'job-application':
        return this.processJobApplicationInput(lowerInput);
      case 'general':
        return this.processGeneralInput(lowerInput);
      default:
        return { text: "I'm sorry, I didn't understand that. Could you please repeat?" };
    }
  }

  private processPrimaryAgentInput(input: string): {
    text: string;
    nextStep?: string;
    shouldTransfer?: boolean;
    transferTo?: string;
  } {
    // Intent detection keywords
    const breakdownKeywords = ['breakdown', 'broken', 'stuck', 'emergency', 'truck', 'problem', 'help', 'tow'];
    const jobKeywords = ['job', 'work', 'employment', 'application', 'hire', 'position', 'career'];
    const generalKeywords = ['question', 'information', 'service', 'pricing', 'quote', 'logistics'];

    if (breakdownKeywords.some(keyword => input.includes(keyword))) {
      return {
        text: "I understand you're dealing with a breakdown situation. Let me connect you with our Breakdown Assistant who specializes in these situations and can provide you with immediate support. They're really excellent at handling these types of emergencies. Please hold on just a moment while I transfer you.",
        shouldTransfer: true,
        transferTo: 'breakdown'
      };
    }

    if (jobKeywords.some(keyword => input.includes(keyword))) {
      return {
        text: "That's wonderful that you're interested in joining our team! I'm going to connect you with our Job Application specialist who can walk you through our opportunities and help you find the perfect fit. They're really knowledgeable about all our positions and the application process. Please hold on just a moment.",
        shouldTransfer: true,
        transferTo: 'job-application'
      };
    }

    if (generalKeywords.some(keyword => input.includes(keyword))) {
      return {
        text: "I understand you have some questions about our services. Let me connect you with our General Support specialist who can provide you with detailed information and help answer any questions you might have. They're very knowledgeable about all aspects of our operations. Please hold on just a moment.",
        shouldTransfer: true,
        transferTo: 'general'
      };
    }

    return {
      text: "I'd be happy to help you with that. Could you tell me a bit more about what you're calling about today? Are you experiencing a breakdown, interested in a job opportunity, or do you have a general question about our services?",
      nextStep: 'intent_clarification'
    };
  }

  private processBreakdownInput(input: string): {
    text: string;
    nextStep?: string;
  } {
    switch (this.state.currentStep) {
      case 'greeting':
        return {
          text: "That's my top priority - making sure you're safe. Are you pulled over completely off the road, with your hazard lights on? If you're not in a safe spot, I need you to carefully move to the shoulder or a safe area if possible.",
          nextStep: 'safety_check'
        };
      case 'safety_check':
        this.state.collectedData.safety_status = input;
        return {
          text: "Perfect, I'm glad you're safe. Now, can you tell me exactly where you are? What highway or road are you on, and do you see any mile markers, exit numbers, or landmarks nearby? The more specific you can be, the faster I can get help to you.",
          nextStep: 'location'
        };
      case 'location':
        this.state.collectedData.location = input;
        return {
          text: "Thank you for that location information. Now, can you tell me what kind of vehicle you're driving? What's the make, model, and color? And do you have the truck number or any company identifiers visible?",
          nextStep: 'vehicle_info'
        };
      case 'vehicle_info':
        this.state.collectedData.vehicle_info = input;
        return {
          text: "I appreciate all that information. Now, can you describe what's happening with your vehicle? What symptoms are you experiencing? For example, are there any strange noises, warning lights, smells, or is it just not starting?",
          nextStep: 'problem_description'
        };
      case 'problem_description':
        this.state.collectedData.problem_description = input;
        return {
          text: "Alright, I have all the information I need. I'm immediately dispatching a tow truck to your location. They should be there within 30 to 45 minutes. I'm also sending your information to our dispatch team so they can coordinate a replacement vehicle if needed. You'll receive a text message with the tow truck driver's information shortly.",
          nextStep: 'closing'
        };
      default:
        return {
          text: "I understand. Is there anything else I can help you with regarding your breakdown situation?"
        };
    }
  }

  private processJobApplicationInput(input: string): {
    text: string;
    nextStep?: string;
  } {
    switch (this.state.currentStep) {
      case 'greeting':
        return {
          text: "That's a great choice! We have several opportunities in that area. Can you tell me a bit about your experience? How many years have you been working in this field, and what type of work have you been doing?",
          nextStep: 'experience'
        };
      case 'experience':
        this.state.collectedData.experience = input;
        return {
          text: "That's excellent experience! I can tell you'd be a great fit. Do you have any specific certifications or licenses that are relevant to the position? For example, if you're interested in driving positions, do you have a CDL? What class and endorsements?",
          nextStep: 'certifications'
        };
      case 'certifications':
        this.state.collectedData.certifications = input;
        return {
          text: "Perfect! Now, when would you be available to start? Are you currently employed, or would you be able to begin immediately? And are you looking for full-time, part-time, or contract work?",
          nextStep: 'availability'
        };
      case 'availability':
        this.state.collectedData.availability = input;
        return {
          text: "This all sounds fantastic! Based on everything you've told me, I think you'd be an excellent candidate for several of our positions. I'd love to schedule you for an interview with our hiring manager. Are you available sometime this week or next week?",
          nextStep: 'interview_scheduling'
        };
      default:
        return {
          text: "That sounds great! Is there anything else you'd like to know about our job opportunities?"
        };
    }
  }

  private processGeneralInput(input: string): {
    text: string;
    nextStep?: string;
  } {
    switch (this.state.currentStep) {
      case 'greeting':
        return {
          text: "That's a great question! I'd be happy to help you with that. Can you tell me a bit more about what you're looking for? Are you interested in our services for your business, do you have questions about an existing account, or are you looking for general information about our company?",
          nextStep: 'inquiry_type'
        };
      case 'inquiry_type':
        this.state.collectedData.inquiry_type = input;
        return {
          text: "Excellent! I can provide you with detailed information about that. To give you the most relevant details, can you tell me a bit about your business or your specific needs? For example, what type of goods do you need transported, what's your typical volume, and where do you usually ship to and from?",
          nextStep: 'service_details'
        };
      case 'service_details':
        this.state.collectedData.service_details = input;
        return {
          text: "Perfect! Based on what you've told me, I can provide you with some great information about our services. Let me walk you through what we offer and how we can help meet your specific needs. I think you'll find that we have some excellent solutions for your situation.",
          nextStep: 'information_provided'
        };
      default:
        return {
          text: "I hope this information has been helpful! Is there anything else you'd like to know about our services?"
        };
    }
  }

  private async handleTransfer(toAgentType: string): Promise<void> {
    this.state.isTransferring = true;
    this.updateState();

    this.addLog('transfer_initiated', `Transferring to ${toAgentType} agent`);
    this.onTransferRequest?.(toAgentType);

    // Simulate transfer delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.state.agentType = toAgentType;
    this.state.currentStep = 'greeting';
    this.state.isTransferring = false;
    this.updateState();

    // Start new conversation with specialized agent
    const greeting = this.getGreeting();
    await this.speak(greeting);
  }

  private getGreeting(): string {
    const script = conversationTemplates[this.state.agentType as keyof typeof conversationTemplates];
    if (!script) {
      return "Hello! How can I help you today?";
    }
    return getRandomResponse(script.greeting);
  }

  private addTranscript(speaker: 'agent' | 'user', text: string): void {
    const transcript: CallTranscript = {
      id: Date.now().toString(),
      session_id: this.state.sessionId,
      speaker,
      text,
      timestamp: new Date().toISOString(),
      confidence: speaker === 'agent' ? 1.0 : 0.9
    };

    this.state.transcript.push(transcript);
    this.updateState();
  }

  private addLog(type: string, message: string): void {
    const log: CallLog = {
      id: Date.now().toString(),
      session_id: this.state.sessionId,
      log_type: type,
      message,
      timestamp: new Date().toISOString(),
      metadata: { step: this.state.currentStep, agentType: this.state.agentType }
    };

    this.state.logs.push(log);
    this.updateState();
  }

  private updateState(): void {
    this.onStateUpdate?.(this.state);
  }

  public getState(): ConversationState {
    return { ...this.state };
  }

  public getCollectedData(): Record<string, any> {
    return { ...this.state.collectedData };
  }

  public async endConversation(): Promise<void> {
    this.stopListening();
    this.voiceProvider.stop();
    this.addLog('conversation_ended', 'Conversation ended by user');
  }
} 