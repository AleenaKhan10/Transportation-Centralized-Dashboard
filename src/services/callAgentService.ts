import { 
  CallAgent, 
  CallSession, 
  CallStats, 
  CallsResponse, 
  CallsFilter,
  CallbackRequest,
  CallScript,
  CallerInfo,
  CallTranscript,
  CallLog,
  PaginatedResponse,
  ApiResponse
} from '../types';

// Mock data for development
const mockAgents: CallAgent[] = [
  {
    id: '1',
    name: 'Primary Agent',
    type: 'primary',
    status: 'available',
    description: 'Main call routing agent that identifies caller intent and routes to appropriate specialized agents',
    scripted_flows: ['caller-identification', 'intent-detection', 'routing'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Breakdown Assistant',
    type: 'breakdown',
    status: 'available',
    description: 'Specialized agent for handling driver breakdown reports and emergency situations',
    scripted_flows: ['breakdown-assessment', 'location-capture', 'issue-diagnosis'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Job Application Agent',
    type: 'job-application',
    status: 'available',
    description: 'Handles job applications and candidate screening for various positions',
    scripted_flows: ['application-intake', 'qualification-screening', 'interview-scheduling'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'General Support',
    type: 'general',
    status: 'available',
    description: 'Handles general inquiries and provides basic information',
    scripted_flows: ['general-inquiry', 'information-provision', 'escalation'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockCallSessions: CallSession[] = [
  {
    id: '1',
    call_id: 'call_2024_001',
    caller_phone: '+1234567890',
    caller_name: 'John Smith',
    caller_type: 'driver',
    agent_id: '2',
    agent_name: 'Breakdown Assistant',
    status: 'completed',
    call_type: 'inbound',
    duration: 420,
    start_time: '2024-01-15T10:30:00Z',
    end_time: '2024-01-15T10:37:00Z',
    recording_url: 'https://example.com/recordings/call_2024_001.mp3',
    transcript: [],
    call_logs: [],
    caller_info: {
      name: 'John Smith',
      phone: '+1234567890',
      driver_id: 'DRV001',
      issue_type: 'breakdown',
      truck_id: 'TRK001',
      location: 'I-75 Mile Marker 150',
      urgency: 'high',
      notes: 'Engine overheating, driver stranded',
      previous_calls: 2,
      form_data: {
        issue_description: 'Engine overheating',
        location: 'I-75 Mile Marker 150',
        truck_condition: 'not_drivable',
        safety_status: 'safe'
      }
    },
    follow_up_required: true,
    follow_up_notes: 'Dispatch tow truck and replacement vehicle',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:37:00Z'
  },
  {
    id: '2',
    call_id: 'call_2024_002',
    caller_phone: '+1987654321',
    caller_name: 'Sarah Johnson',
    caller_type: 'job-applicant',
    agent_id: '3',
    agent_name: 'Job Application Agent',
    status: 'active',
    call_type: 'inbound',
    duration: 180,
    start_time: '2024-01-15T11:00:00Z',
    recording_url: 'https://example.com/recordings/call_2024_002.mp3',
    transcript: [],
    call_logs: [],
    caller_info: {
      name: 'Sarah Johnson',
      phone: '+1987654321',
      email: 'sarah.johnson@email.com',
      position_applied: 'truck-driver',
      urgency: 'medium',
      notes: 'Interested in long-haul driving position',
      previous_calls: 0,
      form_data: {
        experience_years: '5',
        cdl_class: 'A',
        endorsements: 'HazMat,Tanker',
        availability: 'immediate'
      }
    },
    follow_up_required: false,
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  }
];

const mockStats: CallStats = {
  total_calls: 156,
  answered_calls: 142,
  missed_calls: 14,
  average_duration: 285,
  completion_rate: 91.0,
  satisfaction_rating: 4.2,
  breakdown_calls: 45,
  job_application_calls: 32,
  general_calls: 65,
  calls_today: 8,
  calls_this_week: 34,
  calls_this_month: 156
};

class CallAgentService {
  // Agent Management
  async getAgents(): Promise<CallAgent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAgents;
  }

  async getAgentById(id: string): Promise<CallAgent | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAgents.find(agent => agent.id === id) || null;
  }

  async updateAgentStatus(id: string, status: CallAgent['status']): Promise<CallAgent> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const agent = mockAgents.find(a => a.id === id);
    if (!agent) throw new Error('Agent not found');
    
    agent.status = status;
    agent.updated_at = new Date().toISOString();
    return agent;
  }

  // Call Session Management
  async getCalls(params: CallsFilter & { page?: number; limit?: number } = {}): Promise<CallsResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCalls = [...mockCallSessions];
    
    // Apply filters
    if (params.agent_id) {
      filteredCalls = filteredCalls.filter(call => call.agent_id === params.agent_id);
    }
    if (params.call_type) {
      filteredCalls = filteredCalls.filter(call => call.call_type === params.call_type);
    }
    if (params.status) {
      filteredCalls = filteredCalls.filter(call => call.status === params.status);
    }
    if (params.caller_type) {
      filteredCalls = filteredCalls.filter(call => call.caller_type === params.caller_type);
    }
    if (params.urgency) {
      filteredCalls = filteredCalls.filter(call => call.caller_info.urgency === params.urgency);
    }
    
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filteredCalls.slice(start, end),
      pagination: {
        page,
        limit,
        total: filteredCalls.length,
        pages: Math.ceil(filteredCalls.length / limit)
      },
      stats: mockStats
    };
  }

  async getCallById(id: string): Promise<CallSession | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCallSessions.find(call => call.id === id) || null;
  }

  async startCall(callType: string, agentId: string): Promise<CallSession> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    
    const newCall: CallSession = {
      id: Date.now().toString(),
      call_id: `call_${Date.now()}`,
      caller_phone: 'user-simulation', // Placeholder for simulated user call
      caller_name: 'Simulated User',
      caller_type: 'unknown', // Will be determined by primary agent
      agent_id: agentId,
      agent_name: agent.name,
      status: 'active', // Start active since user initiated the call
      call_type: 'inbound', // User is calling in
      duration: 0,
      start_time: new Date().toISOString(),
      transcript: [
        {
          id: '1',
          session_id: Date.now().toString(),
          speaker: 'agent',
          text: 'Hello! I\'m the Primary AI Agent. I\'m here to help route your call to the right specialist. Are you calling about a breakdown emergency, job application, or general inquiry?',
          timestamp: new Date().toISOString(),
          confidence: 0.95,
          sentiment: 'positive'
        }
      ],
      call_logs: [
        {
          id: '1',
          session_id: Date.now().toString(),
          event_type: 'call_started',
          message: 'Call started with Primary Agent',
          timestamp: new Date().toISOString(),
          agent_id: agentId
        }
      ],
      caller_info: {
        phone: 'user-simulation',
        urgency: 'medium',
        previous_calls: 0,
        notes: 'User started call with Primary Agent for routing'
      },
      follow_up_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockCallSessions.unshift(newCall);
    return newCall;
  }

  async answerCall(callId: string): Promise<CallSession> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const call = mockCallSessions.find(c => c.id === callId);
    if (!call) throw new Error('Call not found');
    
    call.status = 'active';
    call.updated_at = new Date().toISOString();
    
    return call;
  }

  async endCall(callId: string): Promise<CallSession> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const call = mockCallSessions.find(c => c.id === callId);
    if (!call) throw new Error('Call not found');
    
    call.status = 'completed';
    call.end_time = new Date().toISOString();
    call.duration = Math.floor((Date.now() - new Date(call.start_time).getTime()) / 1000);
    call.updated_at = new Date().toISOString();
    
    return call;
  }

  async transferCall(callId: string, toAgentId: string): Promise<CallSession> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const call = mockCallSessions.find(c => c.id === callId);
    if (!call) throw new Error('Call not found');
    
    const agent = mockAgents.find(a => a.id === toAgentId);
    if (!agent) throw new Error('Agent not found');
    
    call.agent_id = toAgentId;
    call.agent_name = agent.name;
    call.status = 'transferred';
    call.updated_at = new Date().toISOString();
    
    return call;
  }

  async updateCallerInfo(callId: string, callerInfo: Partial<CallerInfo>): Promise<CallSession> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const call = mockCallSessions.find(c => c.id === callId);
    if (!call) throw new Error('Call not found');
    
    call.caller_info = { ...call.caller_info, ...callerInfo };
    call.updated_at = new Date().toISOString();
    
    return call;
  }

  async addCallLog(callId: string, log: Omit<CallLog, 'id' | 'session_id'>): Promise<CallLog> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const call = mockCallSessions.find(c => c.id === callId);
    if (!call) throw new Error('Call not found');
    
    const newLog: CallLog = {
      id: Date.now().toString(),
      session_id: callId,
      ...log
    };
    
    call.call_logs.push(newLog);
    call.updated_at = new Date().toISOString();
    
    return newLog;
  }

  async addTranscript(callId: string, transcript: Omit<CallTranscript, 'id' | 'session_id'>): Promise<CallTranscript> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const call = mockCallSessions.find(c => c.id === callId);
    if (!call) throw new Error('Call not found');
    
    const newTranscript: CallTranscript = {
      id: Date.now().toString(),
      session_id: callId,
      ...transcript
    };
    
    call.transcript.push(newTranscript);
    call.updated_at = new Date().toISOString();
    
    return newTranscript;
  }

  // Stats and Analytics
  async getCallStats(): Promise<CallStats> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStats;
  }

  // Callbacks
  async getCallbackRequests(): Promise<CallbackRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        caller_phone: '+1234567890',
        caller_name: 'John Smith',
        requested_time: '2024-01-16T14:00:00Z',
        reason: 'Follow up on breakdown status',
        priority: 'high',
        status: 'pending',
        attempts: 0,
        max_attempts: 3,
        notes: 'Wants update on tow truck ETA',
        created_at: '2024-01-15T10:37:00Z',
        updated_at: '2024-01-15T10:37:00Z'
      }
    ];
  }

  async scheduleCallback(request: Omit<CallbackRequest, 'id' | 'created_at' | 'updated_at'>): Promise<CallbackRequest> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newRequest: CallbackRequest = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...request
    };
    
    return newRequest;
  }
}

export const callAgentService = new CallAgentService();
export default callAgentService; 