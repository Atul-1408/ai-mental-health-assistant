// User types
export interface User {
  id?: string;
  username: string;
  email: string;
  name: string;
  created_at?: string;
  bio?: string;
  phone?: string;
  location?: string;
  birthday?: string;
  occupation?: string;
  avatar?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weekly_summary: boolean;
  };
  privacy?: {
    profile_visibility: 'public' | 'friends' | 'private';
    show_online_status: boolean;
    allow_messages: boolean;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    token_type: string;
  };
}

// Chat types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  emotionAnalysis?: EmotionAnalysis;
}

export interface EmotionAnalysis {
  primary_emotion: string;
  confidence: number;
  emotions: { [key: string]: number };
  sentiment: 'positive' | 'negative' | 'neutral';
  crisis_detected: boolean;
  suggestions: string[];
  motivational_quote?: string;
  emergency_resources?: string[];
}

export interface EmotionRequest {
  text: string;
}

export interface EmotionResponse {
  success: boolean;
  data: EmotionAnalysis;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Chat session types
export interface ChatSession {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  messages: ChatMessage[];
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  fontSize: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
