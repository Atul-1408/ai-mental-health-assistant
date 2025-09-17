import { EmotionAnalysis } from '../types';

// Crisis keywords with severity levels
const CRISIS_KEYWORDS = {
  high: [
    // Suicide-related
    'suicide', 'kill myself', 'end my life', 'take my life', 'want to die',
    'ending it all', 'no point living', 'better off dead', 'suicide plan',
    'overdose', 'hanging', 'jump off', 'cut myself deep', 'razor blade',
    
    // Self-harm
    'hurt myself badly', 'cut deep', 'burn myself', 'harm myself seriously',
    
    // Violence to others
    'kill someone', 'hurt others', 'violent thoughts', 'homicidal',
    
    // Immediate danger
    'gun', 'pills to overdose', 'rope to hang', 'bridge to jump'
  ],
  
  medium: [
    // Self-harm
    'self harm', 'cut myself', 'scratch myself', 'hurt myself', 'self injury',
    'cutting', 'burning myself', 'hitting myself', 'self mutilation',
    
    // Suicidal ideation (less immediate)
    'thoughts of death', 'wish i was dead', 'life not worth living',
    'everyone better without me', 'disappear forever', 'escape everything',
    'tired of living', 'give up on life',
    
    // Severe depression indicators
    'cant go on', 'no hope', 'everything is pointless', 'nothing matters',
    'too much pain', 'unbearable', 'overwhelming sadness'
  ],
  
  low: [
    // Mild crisis indicators
    'feeling hopeless', 'very depressed', 'extremely sad', 'deeply troubled',
    'crisis', 'breaking down', 'falling apart', 'cant cope', 'overwhelmed',
    'desperate', 'panic attack', 'severe anxiety', 'mental breakdown'
  ]
};

// Positive keywords that might indicate recovery or coping
const PROTECTIVE_FACTORS = [
  'getting help', 'therapy', 'counseling', 'support system', 'family support',
  'friends care', 'seeking treatment', 'medication helping', 'feeling better',
  'things improving', 'hope', 'future plans', 'goals', 'looking forward'
];

/**
 * Enhanced crisis detection that analyzes text for crisis indicators
 */
export const detectCrisis = (text: string, emotionAnalysis?: EmotionAnalysis) => {
  const lowerText = text.toLowerCase();
  
  // Count matches for each severity level
  const highMatches = CRISIS_KEYWORDS.high.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  const mediumMatches = CRISIS_KEYWORDS.medium.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  const lowMatches = CRISIS_KEYWORDS.low.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  const protectiveMatches = PROTECTIVE_FACTORS.filter(factor => 
    lowerText.includes(factor.toLowerCase())
  );
  
  // Determine crisis level
  let crisisLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  let crisisDetected = false;
  
  if (highMatches.length > 0) {
    crisisLevel = 'high';
    crisisDetected = true;
  } else if (mediumMatches.length > 0) {
    crisisLevel = 'medium';
    crisisDetected = true;
  } else if (lowMatches.length > 0) {
    crisisLevel = 'low';
    crisisDetected = true;
  }
  
  // Consider emotion analysis if available
  if (emotionAnalysis) {
    if (emotionAnalysis.sentiment === 'negative' && 
        emotionAnalysis.confidence > 0.8 && 
        (emotionAnalysis.primary_emotion === 'sad' || 
         emotionAnalysis.primary_emotion === 'anxious')) {
      
      if (crisisLevel === 'none') {
        crisisLevel = 'low';
        crisisDetected = true;
      }
    }
  }
  
  // Reduce severity if protective factors are present
  if (protectiveMatches.length > 0 && crisisLevel !== 'none') {
    if (crisisLevel === 'high') {
      crisisLevel = 'medium';
    } else if (crisisLevel === 'medium') {
      crisisLevel = 'low';
    }
  }
  
  return {
    crisisDetected,
    crisisLevel,
    triggers: [...highMatches, ...mediumMatches, ...lowMatches],
    protectiveFactors: protectiveMatches,
    immediateRisk: crisisLevel === 'high',
    recommendedAction: getRecommendedAction(crisisLevel)
  };
};

/**
 * Get recommended action based on crisis level
 */
const getRecommendedAction = (level: 'none' | 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'high':
      return 'immediate_intervention';
    case 'medium':
      return 'urgent_support';
    case 'low':
      return 'supportive_resources';
    default:
      return 'continue_conversation';
  }
};

/**
 * Generate crisis-aware response suggestions
 */
export const generateCrisisResponse = (crisisLevel: 'none' | 'low' | 'medium' | 'high') => {
  const responses = {
    high: [
      "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please consider reaching out for immediate help.",
      "What you're going through sounds extremely difficult. You don't have to face this alone - there are people who want to help you right now.",
      "I can hear how much pain you're in. Please know that there are trained professionals available 24/7 who can provide the support you need."
    ],
    
    medium: [
      "I can hear that you're going through a really tough time. It's important to know that these feelings can change, and support is available.",
      "Thank you for sharing something so difficult with me. Have you been able to talk to anyone else about how you're feeling?",
      "It takes courage to express these feelings. While I'm here to listen, I'd also like to make sure you know about some additional resources that might help."
    ],
    
    low: [
      "I can see that you're struggling right now, and I want you to know that your feelings are valid and understandable.",
      "It sounds like you're going through a challenging time. Sometimes it helps to talk through these feelings with someone.",
      "I'm here to listen and support you. How long have you been feeling this way?"
    ],
    
    none: [
      "Thank you for sharing that with me. How are you feeling about the situation?",
      "I appreciate you opening up. What would be most helpful for you right now?",
      "I'm here to listen and support you. What else is on your mind?"
    ]
  };
  
  const levelResponses = responses[crisisLevel] || responses.none;
  return levelResponses[Math.floor(Math.random() * levelResponses.length)];
};

/**
 * Get emergency resources based on crisis level
 */
export const getEmergencyResources = (crisisLevel: 'none' | 'low' | 'medium' | 'high') => {
  const baseResources = [
    "National Suicide Prevention Lifeline: 988",
    "Crisis Text Line: Text HOME to 741741",
    "Emergency Services: 911"
  ];
  
  const supportResources = [
    "SAMHSA National Helpline: 1-800-662-4357",
    "NAMI HelpLine: 1-800-950-6264"
  ];
  
  switch (crisisLevel) {
    case 'high':
      return baseResources;
    case 'medium':
      return [...baseResources, ...supportResources];
    case 'low':
      return supportResources;
    default:
      return [];
  }
};
