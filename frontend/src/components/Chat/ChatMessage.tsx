import React from 'react';
import styled from 'styled-components';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${props => props.isUser ? '0 0 0 0.75rem' : '0 0.75rem 0 0'};
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
    : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
  };
  color: white;
  flex-shrink: 0;
`;

const MessageWrapper = styled.div<{ isUser: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  order: ${props => props.isUser ? -1 : 0};
`;

const MessageBubble = styled.div<{ isUser: boolean; theme: any }>`
  background: ${props => props.isUser 
    ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%)`
    : props.theme.colors.surface
  };
  color: ${props => props.isUser ? 'white' : props.theme.colors.text};
  padding: 1rem 1.25rem;
  border-radius: 20px;
  border-top-${props => props.isUser ? 'right' : 'left'}-radius: 8px;
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 8px 20px rgba(0, 0, 0, ${props => props.theme.mode === 'dark' ? '0.3' : '0.15'});
  font-size: 0.95rem;
  line-height: 1.6;
  word-wrap: break-word;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, ${props => props.theme.mode === 'dark' ? '0.4' : '0.2'});
  }
  
  ${props => !props.isUser && `
    &::before {
      content: '🤖';
      position: absolute;
      top: -8px;
      left: 12px;
      background: ${props.theme.colors.surface};
      border: 1px solid ${props.theme.colors.border};
      border-radius: 12px;
      padding: 2px 6px;
      font-size: 0.75rem;
    }
  `}
`;

const MessageTime = styled.div<{ isUser: boolean; theme: any }>`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const EmotionBadge = styled.div<{ emotion: string }>`
  display: inline-block;
  background: ${props => {
    const emotionColors: { [key: string]: string } = {
      happy: '#48bb78',
      sad: '#4299e1',
      anxious: '#ed8936',
      angry: '#e53e3e',
      excited: '#9f7aea',
      calm: '#38b2ac',
      neutral: '#718096'
    };
    return emotionColors[props.emotion] || '#718096';
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const CrisisAlert = styled.div<{ theme: any }>`
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.error};
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const Suggestions = styled.div`
  margin-top: 0.75rem;
`;

const SuggestionChip = styled.span<{ theme: any }>`
  display: inline-block;
  background: ${props => props.theme.colors.glass};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary}20;
  }
`;

const MotivationalQuote = styled.div<{ theme: any }>`
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}20 0%, ${props.theme.colors.primary}10 100%)`};
  color: ${props => props.theme.colors.text};
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.accent};
  margin-top: 0.5rem;
  font-style: italic;
  font-size: 0.85rem;
  backdrop-filter: blur(10px);
`;

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { theme } = useTheme();
  const isUser = message.sender === 'user';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <MessageContainer isUser={isUser}>
      <Avatar isUser={isUser}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </Avatar>
      
      <MessageWrapper isUser={isUser}>
        <MessageBubble isUser={isUser} theme={theme}>
          {message.content}
        </MessageBubble>
        
        <MessageTime isUser={isUser} theme={theme}>
          {formatTime(message.timestamp)}
        </MessageTime>

        {/* Show emotion analysis for user messages */}
        {isUser && message.emotionAnalysis && (
          <>
            <EmotionBadge emotion={message.emotionAnalysis.primary_emotion}>
              {message.emotionAnalysis.primary_emotion} ({Math.round(message.emotionAnalysis.confidence * 100)}%)
            </EmotionBadge>

            {message.emotionAnalysis.crisis_detected && (
              <CrisisAlert theme={theme}>
                ⚠️ Crisis detected - Please consider reaching out for professional help
              </CrisisAlert>
            )}

            {message.emotionAnalysis.suggestions.length > 0 && (
              <Suggestions>
                {message.emotionAnalysis.suggestions.map((suggestion, index) => (
                  <SuggestionChip key={index} theme={theme}>{suggestion}</SuggestionChip>
                ))}
              </Suggestions>
            )}

            {message.emotionAnalysis.motivational_quote && (
              <MotivationalQuote theme={theme}>
                💡 {message.emotionAnalysis.motivational_quote}
              </MotivationalQuote>
            )}
          </>
        )}
      </MessageWrapper>
    </MessageContainer>
  );
};

export default ChatMessage;
