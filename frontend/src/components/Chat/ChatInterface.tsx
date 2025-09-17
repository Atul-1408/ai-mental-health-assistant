import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, Loader, Download, X } from 'lucide-react';
import ChatMessage from './ChatMessage';
import CrisisSupport from '../Common/CrisisSupport';
import MediaPlayer, { MediaItem } from '../Media/MediaPlayer';
import BreathingExercise from '../Common/BreathingExercise';
import { ChatMessage as ChatMessageType, EmotionAnalysis } from '../../types';
import apiService from '../../services/api';
import { detectCrisis, generateCrisisResponse } from '../../utils/crisisDetection';
import { getDailyQuote } from '../../utils/quotes';
import { detectMediaRequest, getRandomMedia, getMediaByCategory } from '../../data/mediaLibrary';
import { useTheme } from '../../contexts/ThemeContext';

const ChatContainer = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  max-width: 800px;
  margin: 0 auto;
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, ${props => props.theme.mode === 'dark' ? '0.3' : '0.1'});
  
  @media (max-width: 768px) {
    height: calc(100vh - 64px);
    border-radius: 0;
    box-shadow: none;
  }
`;

const ChatHeader = styled.div<{ theme: any }>`
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const HeaderSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
`;

const MessagesContainer = styled.div<{ theme: any }>`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  background: ${props => props.theme.colors.background};
`;

const WelcomeMessage = styled.div<{ theme: any }>`
  text-align: center;
  padding: 3rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const WelcomeTitle = styled.h2<{ theme: any }>`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const WelcomeText = styled.p`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const InputContainer = styled.div<{ theme: any }>`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.glass};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  max-width: 100%;
`;

const TextArea = styled.textarea<{ theme: any }>`
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 22px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SendButton = styled.button<{ theme: any }>`
  width: 44px;
  height: 44px;
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.theme.colors.primary}40;
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
`;

const ErrorMessage = styled.div<{ theme: any }>`
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  padding: 0.75rem 1rem;
  margin: 0 1rem 1rem 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.error};
  backdrop-filter: blur(10px);
`;

const ModalOverlay = styled.div<{ theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, ${props => props.theme.mode === 'dark' ? '0.7' : '0.5'});
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div<{ theme: any }>`
  background: ${props => props.theme.colors.surface};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, ${props => props.theme.mode === 'dark' ? '0.4' : '0.2'});
`;

const ModalHeader = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.glass};
    color: ${props => props.theme.colors.text};
  }
`;

interface ChatInterfaceProps {
  user: any;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [dailyQuote] = useState(getDailyQuote());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  // Generate AI response based on emotion analysis and crisis detection
  const generateResponse = (emotionAnalysis: EmotionAnalysis, crisisInfo?: any): string => {
    const { primary_emotion, sentiment, crisis_detected } = emotionAnalysis;
    
    // Use crisis-aware response if crisis is detected
    if (crisisInfo && crisisInfo.crisisDetected) {
      return generateCrisisResponse(crisisInfo.crisisLevel);
    }
    
    if (crisis_detected) {
      return "I understand you're going through a very difficult time right now. Your feelings are valid, and it's important to reach out for professional help. Please consider contacting a crisis helpline or speaking with a mental health professional. You don't have to face this alone.";
    }

    const responses = {
      happy: [
        "That's wonderful to hear! It's great that you're feeling positive. What's been contributing to your happiness today?",
        "I'm so glad you're in a good mood! Happiness can be contagious - how are you planning to share this positive energy?",
        "Your joy is beautiful! What would you like to talk about while you're feeling so good?"
      ],
      sad: [
        "I can sense that you're feeling down, and that's completely okay. Sometimes we need to sit with difficult emotions. What's been weighing on your mind?",
        "It sounds like you're going through a tough time. I'm here to listen. Would you like to share what's making you feel this way?",
        "I'm sorry you're feeling sad. These feelings are temporary, even though they might feel overwhelming right now. How can I support you today?"
      ],
      anxious: [
        "I can feel that you're experiencing some anxiety. That can be really challenging. Let's take this one step at a time. What's been causing you the most worry?",
        "Anxiety can feel overwhelming, but remember that you've gotten through difficult times before. What usually helps you when you feel this way?",
        "I understand you're feeling anxious. Sometimes it helps to focus on what we can control. What's one small thing you could do right now to feel a bit better?"
      ],
      angry: [
        "I can sense your frustration and anger. These are valid emotions, and it's important to acknowledge them. What's been triggering these feelings?",
        "It sounds like something has really upset you. Anger often comes from feeling hurt or misunderstood. Would you like to talk about what happened?",
        "I hear that you're angry. Sometimes anger is our mind's way of protecting us. What do you think is behind these feelings?"
      ],
      excited: [
        "Your excitement is wonderful! It's amazing when we feel energized and enthusiastic. What's got you feeling so excited?",
        "I love your enthusiasm! Excitement can be such a motivating force. What are you looking forward to?",
        "Your energy is infectious! Tell me more about what's making you feel so excited today."
      ],
      calm: [
        "It's beautiful that you're feeling calm and peaceful. These moments of tranquility are precious. What's been helping you maintain this sense of calm?",
        "I'm glad you're in a peaceful state of mind. Calmness can be a wonderful foundation for reflection. Is there anything you'd like to explore or discuss?",
        "Your sense of calm is lovely. Sometimes these quiet moments are perfect for deeper conversations. What's on your mind?"
      ],
      neutral: [
        "I'm here to chat with you. How has your day been so far?",
        "Sometimes we feel somewhere in the middle, and that's perfectly normal. What would you like to talk about today?",
        "I'm glad you reached out. What's been on your mind lately?"
      ]
    };

    const emotionResponses = responses[primary_emotion as keyof typeof responses] || responses.neutral;
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError('');

    try {
      // Send message to chat endpoint
      const chatResponse = await apiService.sendMessage(userMessage.content);
      
      // Add natural typing delay to make it feel more human-like
      const typingDelay = Math.random() * 2000 + 1000; // 1-3 seconds delay
      
      setTimeout(() => {
        // Check if the response contains a media suggestion
        let messageContent = chatResponse.data.message;
        let suggestedMedia: MediaItem | null = null;
        
        if (messageContent.startsWith('MEDIA_SUGGESTION:')) {
          // Parse media suggestion from backend
          const parts = messageContent.split(':');
          const category = parts[1] as MediaItem['category'];
          const type = parts[2] as 'audio' | 'video' | 'any';
          const actualMessage = parts.slice(3).join(':');
          
          // Get appropriate media
          if (type === 'any') {
            suggestedMedia = getRandomMedia(category);
          } else {
            const categoryMedia = getMediaByCategory(category).filter(m => m.type === type);
            suggestedMedia = categoryMedia.length > 0 ? 
              categoryMedia[Math.floor(Math.random() * categoryMedia.length)] : 
              getRandomMedia(category);
          }
          
          messageContent = actualMessage;
          setCurrentMedia(suggestedMedia);
        }
        
        // Create AI response message
        const aiMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          content: messageContent,
          sender: 'assistant',
          timestamp: new Date()
        };

        // Add AI response to messages
        setMessages(prev => {
          const newMessages = [...prev, aiMessage];
          
          // Save chat session to localStorage for dashboard
          if (newMessages.length >= 2) { // At least one user message and one AI response
            const chatTitle = userMessage.content.length > 30 
              ? userMessage.content.substring(0, 30) + '...' 
              : userMessage.content;
            
            const existingHistory = localStorage.getItem('chatHistory');
            const chatHistory = existingHistory ? JSON.parse(existingHistory) : [];
            
            // Check if this is a new session or continuation
            const lastSession = chatHistory[chatHistory.length - 1];
            const isNewSession = !lastSession || 
              (new Date().getTime() - new Date(lastSession.updated_at).getTime()) > 300000; // 5 minutes gap = new session
            
            if (isNewSession) {
              // Create new session
              const newSession = {
                id: Date.now().toString(),
                title: chatTitle,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                messages: newMessages.slice(-2) // Last user message + AI response
              };
              chatHistory.push(newSession);
            } else {
              // Update existing session
              lastSession.updated_at = new Date().toISOString();
              lastSession.messages.push(...newMessages.slice(-2));
            }
            
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
          }
          
          return newMessages;
        });
        
        // Remove loading state after response is added
        setIsLoading(false);
      }, typingDelay);
      
      // Check for crisis keywords in a simple way
      const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'die'];
      const hasCrisisContent = crisisKeywords.some(keyword => 
        userMessage.content.toLowerCase().includes(keyword)
      );
      
      if (hasCrisisContent) {
        setCrisisLevel('high');
        setShowCrisisSupport(true);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Chat error:', err);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      alert('No messages to export!');
      return;
    }

    const exportData = {
      user: user?.username || 'Unknown',
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp,
        emotionAnalysis: msg.emotionAnalysis ? {
          primary_emotion: msg.emotionAnalysis.primary_emotion,
          confidence: msg.emotionAnalysis.confidence,
          sentiment: msg.emotionAnalysis.sentiment,
          crisis_detected: msg.emotionAnalysis.crisis_detected
        } : null
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindchat-conversation-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ChatContainer theme={theme}>
        <ChatHeader theme={theme}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <HeaderTitle>AI Mental Health Assistant</HeaderTitle>
              <HeaderSubtitle>Welcome {user?.name || user?.username}! I'm here to listen and support you.</HeaderSubtitle>
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                opacity: 0.9,
                fontStyle: 'italic'
              }}>
                💫 "{dailyQuote}"
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowBreathingExercise(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                🫁 Breathe
              </button>
              {messages.length > 0 && (
                <button
                  onClick={handleExportChat}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  <Download size={14} />
                  Export Chat
                </button>
              )}
            </div>
          </div>
        </ChatHeader>

        <MessagesContainer theme={theme}>
          {messages.length === 0 ? (
            <WelcomeMessage theme={theme}>
              <WelcomeTitle theme={theme}>👋 Hello there!</WelcomeTitle>
              <WelcomeText>I'm your AI mental health companion. I'm here to:</WelcomeText>
              <WelcomeText>• Listen to your thoughts and feelings</WelcomeText>
              <WelcomeText>• Analyze your emotions and provide insights</WelcomeText>
              <WelcomeText>• Offer support and suggestions</WelcomeText>
              <WelcomeText>• Help you process your experiences</WelcomeText>
              <WelcomeText style={{ marginTop: '1.5rem', fontWeight: '500' }}>
                How are you feeling today? Feel free to share anything on your mind.
              </WelcomeText>
            </WelcomeMessage>
          ) : (
            messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {isLoading && (
            <TypingIndicator theme={theme}>
              <Loader size={16} style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
              AI is typing...
            </TypingIndicator>
          )}

          {error && (
            <ErrorMessage theme={theme}>
              <strong>Error:</strong> {error}
            </ErrorMessage>
          )}
          
          {currentMedia && (
            <div style={{ padding: '0 1rem' }}>
              <MediaPlayer 
                media={currentMedia} 
                onClose={() => setCurrentMedia(null)}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer theme={theme}>
          <InputWrapper>
            <TextArea
              ref={textAreaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts and feelings..."
              disabled={isLoading}
              rows={1}
              theme={theme}
            />
            <SendButton onClick={handleSendMessage} disabled={!inputText.trim() || isLoading} theme={theme}>
              <Send size={18} />
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </ChatContainer>
      
      <CrisisSupport
        isVisible={showCrisisSupport}
        onClose={() => setShowCrisisSupport(false)}
        severity={crisisLevel}
      />
      
      {showBreathingExercise && (
        <ModalOverlay onClick={() => setShowBreathingExercise(false)} theme={theme}>
          <ModalContent onClick={(e) => e.stopPropagation()} theme={theme}>
            <ModalHeader theme={theme}>
              <h3>Breathing Exercise</h3>
              <CloseButton onClick={() => setShowBreathingExercise(false)} theme={theme}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <BreathingExercise />
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ChatInterface;
