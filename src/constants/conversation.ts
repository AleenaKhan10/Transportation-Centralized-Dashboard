export interface ConversationScript {
  greeting: string[];
  questions: {
    [key: string]: {
      text: string;
      followUp?: string[];
      validation?: RegExp;
      required?: boolean;
    };
  };
  transitions: {
    [key: string]: string[];
  };
  closing: string[];
}

export interface ConversationFlow {
  steps: string[];
  currentStep: number;
  collectedData: Record<string, any>;
  context: Record<string, any>;
}

// Primary Agent - Routes calls to specialized agents
export const primaryAgentScript: ConversationScript = {
  greeting: [
    "Hello! Thank you for calling AGY Logistics. I'm your AI assistant, and I'm here to help you today. How are you doing?",
    "Good morning! This is AGY Logistics AI assistant speaking. I hope you're having a great day so far. How can I assist you today?",
    "Hi there! Welcome to AGY Logistics. I'm your virtual assistant, and I'm excited to help you with whatever you need. What brings you to us today?"
  ],
  questions: {
    intent_detection: {
      text: "I'd be happy to help you with that. Could you tell me a bit more about what you're calling about today? Are you experiencing a breakdown, interested in a job opportunity, or do you have a general question?",
      followUp: [
        "I see. That sounds important. Let me make sure I understand correctly...",
        "Okay, I think I can help with that. Just to clarify...",
        "Perfect, I've got a good understanding of what you need. Let me..."
      ]
    },
    urgency_assessment: {
      text: "Thanks for explaining that. On a scale of 1 to 10, how urgent would you say this matter is? This helps me route you to the right specialist who can give you the best assistance.",
      followUp: [
        "I understand. That does sound like it needs immediate attention.",
        "Okay, I appreciate you letting me know. This will help me get you to the right person.",
        "Got it. I want to make sure you get the help you need as quickly as possible."
      ]
    }
  },
  transitions: {
    to_breakdown: [
      "I understand you're dealing with a breakdown situation. Let me connect you with our Breakdown Assistant who specializes in these situations and can provide you with immediate support. They're really excellent at handling these types of emergencies. Please hold on just a moment while I transfer you.",
      "That sounds like a breakdown situation that needs immediate attention. I'm going to transfer you to our specialized Breakdown Assistant who can help you get back on the road as quickly as possible. They have all the tools and resources to assist you. One moment please.",
      "I can hear the concern in your voice about this breakdown. Don't worry - I'm transferring you to our expert Breakdown Assistant who handles these situations every day. They'll take great care of you and get you the help you need right away."
    ],
    to_job_application: [
      "That's wonderful that you're interested in joining our team! I'm going to connect you with our Job Application specialist who can walk you through our opportunities and help you find the perfect fit. They're really knowledgeable about all our positions and the application process. Please hold on just a moment.",
      "How exciting that you want to work with us! Let me transfer you to our Job Application Agent who specializes in helping people like you find great opportunities with AGY Logistics. They'll be able to discuss positions, requirements, and next steps with you. One moment please.",
      "I love hearing from people who want to be part of our team! I'm connecting you with our Job Application specialist who can tell you all about our current openings and help you through the application process. They're fantastic at matching people with the right opportunities."
    ],
    to_general: [
      "I understand you have some questions about our services. Let me connect you with our General Support specialist who can provide you with detailed information and help answer any questions you might have. They're very knowledgeable about all aspects of our operations. Please hold on just a moment.",
      "Those are great questions! I'm going to transfer you to our General Support team member who can give you comprehensive information about our services and help with any other questions you might have. They're really helpful and knowledgeable. One moment please.",
      "I'd be happy to get you the information you need. Let me connect you with our General Support specialist who can provide detailed answers to your questions and help you with anything else you might need to know about AGY Logistics."
    ]
  },
  closing: [
    "It's been my pleasure helping you today. Have a wonderful rest of your day!",
    "Thank you for calling AGY Logistics. I hope the rest of your day goes smoothly!",
    "I'm glad I could help get you connected with the right person. Take care and have a great day!"
  ]
};

// Breakdown Assistant - Handles emergency situations
export const breakdownAgentScript: ConversationScript = {
  greeting: [
    "Hello! I'm the Breakdown Assistant, and I'm here to help you get back on the road safely. I understand you're dealing with a breakdown situation, and I want you to know that we're going to take care of this together. First, are you in a safe location right now?",
    "Hi there! This is your Breakdown Assistant speaking. I can hear that you're dealing with a vehicle issue, and I want to help you resolve this as quickly as possible. My first concern is your safety - are you currently in a safe spot?",
    "Good day! I'm your specialized Breakdown Assistant. I deal with these situations every day, and I'm here to help you through this step by step. Most importantly, I need to know - are you somewhere safe right now?"
  ],
  questions: {
    safety_check: {
      text: "That's my top priority - making sure you're safe. Are you pulled over completely off the road, with your hazard lights on? If you're not in a safe spot, I need you to carefully move to the shoulder or a safe area if possible.",
      required: true
    },
    location: {
      text: "Perfect, I'm glad you're safe. Now, can you tell me exactly where you are? What highway or road are you on, and do you see any mile markers, exit numbers, or landmarks nearby? The more specific you can be, the faster I can get help to you.",
      required: true
    },
    vehicle_info: {
      text: "Thank you for that location information. Now, can you tell me what kind of vehicle you're driving? What's the make, model, and color? And do you have the truck number or any company identifiers visible?",
      required: true
    },
    problem_description: {
      text: "I appreciate all that information. Now, can you describe what's happening with your vehicle? What symptoms are you experiencing? For example, are there any strange noises, warning lights, smells, or is it just not starting?",
      required: true
    },
    immediate_danger: {
      text: "Based on what you've told me, I want to double-check - do you see any smoke, smell anything unusual, or notice any fluids leaking? I need to make sure there's no immediate danger.",
      required: true
    }
  },
  transitions: {
    dispatch_help: [
      "Alright, I have all the information I need. I'm immediately dispatching a tow truck to your location. They should be there within 30 to 45 minutes. I'm also sending your information to our dispatch team so they can coordinate a replacement vehicle if needed. You'll receive a text message with the tow truck driver's information shortly.",
      "Perfect, I've got everything documented. Help is on the way! I'm sending a tow truck to your exact location, and they'll be there in about 30-45 minutes. I'm also notifying our logistics team about your situation so we can minimize any delays. You should get a text with tracking information momentarily.",
      "Great, I have all the details I need to help you. I'm dispatching emergency roadside assistance to your location right now. The tow truck should arrive within 30-45 minutes, and I'm coordinating with our team to arrange backup transportation. You'll receive a text message with all the details."
    ]
  },
  closing: [
    "You're all set! Help is on the way, and you should receive text updates shortly. Please stay safe, keep your hazard lights on, and don't hesitate to call us back if anything changes or if you need any additional assistance. We've got you covered!",
    "Everything is arranged! The tow truck is en route, and our team is coordinating your next steps. Stay safe in your vehicle, and we'll have you back on the road as soon as possible. Call us immediately if your situation changes in any way.",
    "You're in good hands now! I've got everything set up for you - tow truck dispatched, replacement vehicle being arranged, and you'll get text updates every step of the way. Stay safe and warm, and don't worry - we'll take care of everything from here!"
  ]
};

// Job Application Agent - Handles employment inquiries
export const jobApplicationAgentScript: ConversationScript = {
  greeting: [
    "Hello! I'm the Job Application specialist, and I'm thrilled that you're interested in joining the AGY Logistics family! We're always looking for talented people who want to be part of our team. I'd love to learn more about you and help you find the perfect opportunity with us. What position are you most interested in?",
    "Hi there! This is your Job Application Agent speaking. It's so exciting to talk with someone who wants to work with AGY Logistics! We have some fantastic opportunities available, and I'm here to help you through the entire process. Tell me, what kind of work are you looking for?",
    "Good day! I'm your Job Application specialist, and I'm absolutely delighted to speak with you about career opportunities at AGY Logistics! We pride ourselves on being a great place to work, and I'd love to help you find the right fit. What type of position interests you most?"
  ],
  questions: {
    position_interest: {
      text: "That's a great choice! We have several opportunities in that area. Can you tell me a bit about your experience? How many years have you been working in this field, and what type of work have you been doing?",
      required: true
    },
    experience_level: {
      text: "That's excellent experience! I can tell you'd be a great fit. Do you have any specific certifications or licenses that are relevant to the position? For example, if you're interested in driving positions, do you have a CDL? What class and endorsements?",
      required: true
    },
    availability: {
      text: "Perfect! Now, when would you be available to start? Are you currently employed, or would you be able to begin immediately? And are you looking for full-time, part-time, or contract work?",
      required: true
    },
    location_preferences: {
      text: "Great to know! Are you flexible with travel or location? Some of our positions involve regional or long-haul routes, while others are more local. What's your preference, and are there any areas you'd prefer to work in or avoid?",
      required: true
    },
    salary_expectations: {
      text: "I appreciate you sharing that information. Do you have salary expectations or requirements? Our positions are competitive, and I want to make sure we're aligned on compensation before we move forward.",
      required: true
    }
  },
  transitions: {
    schedule_interview: [
      "This all sounds fantastic! Based on everything you've told me, I think you'd be an excellent candidate for several of our positions. I'd love to schedule you for an interview with our hiring manager. Are you available sometime this week or next week? We can do it in person, over the phone, or via video call - whatever works best for you.",
      "I'm really impressed with your background and experience! I think we have some perfect opportunities for you. The next step would be to set up an interview with our hiring team. They'll be able to discuss specific positions, benefits, and next steps with you. When would be a good time for you this week or next?",
      "You sound like exactly the kind of person we're looking for! I'm excited to move you forward in our process. Let me schedule you for an interview with our hiring manager who can discuss specific opportunities and answer any questions you might have about working with us. What's your schedule like this week?"
    ]
  },
  closing: [
    "Wonderful! I've got you scheduled for an interview, and you should receive a confirmation email within the next hour with all the details. I'm really excited about your potential with our company, and I think you're going to love working with AGY Logistics. Thank you for your interest, and I look forward to hearing how your interview goes!",
    "Perfect! Everything is set up for your interview. You'll get a confirmation email shortly with the date, time, and format details. I have a really good feeling about this, and I think you're going to be a great addition to our team. Thanks for choosing to explore opportunities with AGY Logistics!",
    "Excellent! Your interview is scheduled, and you'll receive all the details by email very soon. I'm genuinely excited about your potential with our company. Make sure to prepare any questions you have about the role or our company culture. I can't wait to hear about your interview experience!"
  ]
};

// General Support Agent - Handles general inquiries
export const generalSupportScript: ConversationScript = {
  greeting: [
    "Hello! I'm your General Support specialist, and I'm here to help you with any questions or information you need about AGY Logistics. Whether you're curious about our services, need help with an existing account, or just want to learn more about what we do, I'm your go-to person. What can I help you with today?",
    "Hi there! This is your General Support Agent speaking. I'm here to provide you with information and assistance with anything related to AGY Logistics. I love helping people understand our services and solve any questions they might have. What would you like to know about?",
    "Good day! I'm your General Support specialist, and I'm delighted to help you today! I can assist with information about our services, help with account questions, or provide details about how we can help with your logistics needs. What brings you to us today?"
  ],
  questions: {
    inquiry_type: {
      text: "That's a great question! I'd be happy to help you with that. Can you tell me a bit more about what you're looking for? Are you interested in our services for your business, do you have questions about an existing account, or are you looking for general information about our company?",
      required: true
    },
    service_interest: {
      text: "Excellent! I can provide you with detailed information about that. To give you the most relevant details, can you tell me a bit about your business or your specific needs? For example, what type of goods do you need transported, what's your typical volume, and where do you usually ship to and from?",
      required: false
    },
    timeline: {
      text: "That's very helpful information! When are you looking to potentially start using our services? Are you exploring options for immediate needs, or are you planning for the future? This helps me provide you with the most appropriate information and next steps.",
      required: false
    },
    budget_considerations: {
      text: "I appreciate you sharing that. Do you have a general budget range in mind for logistics services? This helps me recommend the most suitable options for your needs. Don't worry - we have solutions for businesses of all sizes!",
      required: false
    }
  },
  transitions: {
    provide_information: [
      "Perfect! Based on what you've told me, I can provide you with some great information about our services. Let me walk you through what we offer and how we can help meet your specific needs. I think you'll find that we have some excellent solutions for your situation.",
      "Wonderful! I have a clear understanding of what you're looking for. Let me share some information about our services that would be most relevant to your needs. I'm confident we can provide you with some great options that will work well for your business.",
      "Great! I'm excited to tell you about how AGY Logistics can help you. Based on your requirements, I can recommend several service options that would be perfect for your situation. Let me give you an overview of what we can do for you."
    ],
    schedule_follow_up: [
      "I hope this information has been helpful! Would you like me to have one of our sales specialists reach out to you with more detailed information and pricing? They can provide you with a customized quote based on your specific needs and answer any additional questions you might have.",
      "This has been a great conversation! I think our services would be a perfect fit for your needs. Would you like me to connect you with one of our account representatives who can work with you on specifics like pricing, timelines, and setting up your account?",
      "I'm glad I could provide you with this information! The next step would be to have one of our logistics specialists reach out to you with detailed proposals and pricing. They can work with you to create a customized solution that meets your exact requirements. Would you like me to arrange that?"
    ]
  },
  closing: [
    "It's been my pleasure helping you today! I'm confident that AGY Logistics can provide you with excellent service, and I'm excited about the possibility of working with you. You should hear from our team soon, and please don't hesitate to call back if you have any other questions. Have a fantastic day!",
    "Thank you so much for your interest in AGY Logistics! I really enjoyed our conversation, and I think we can provide you with some great solutions. Our team will be in touch soon with more detailed information. If you need anything else in the meantime, please don't hesitate to reach out. Take care!",
    "This has been wonderful! I'm thrilled that you're considering AGY Logistics for your logistics needs. I have a good feeling that we'll be able to work together very successfully. You'll hear from our team soon, and remember, I'm always here if you need any additional information. Have a great rest of your day!"
  ]
};

// Conversation templates for different scenarios
export const conversationTemplates = {
  primary: primaryAgentScript,
  breakdown: breakdownAgentScript,
  'job-application': jobApplicationAgentScript,
  general: generalSupportScript
};

// Helper function to get random response
export function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Helper function to create conversation flow
export function createConversationFlow(agentType: keyof typeof conversationTemplates): ConversationFlow {
  const script = conversationTemplates[agentType];
  const steps = ['greeting', ...Object.keys(script.questions), 'closing'];
  
  return {
    steps,
    currentStep: 0,
    collectedData: {},
    context: { agentType }
  };
} 