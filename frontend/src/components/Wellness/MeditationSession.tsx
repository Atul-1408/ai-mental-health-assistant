import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Play, Pause, RotateCcw, X, Volume2, VolumeX, 
  Clock, Heart, Leaf, Mountain
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const breathingAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const ModalOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  ${css`animation: ${fadeIn} 0.3s ease-out;`}
`;

const MeditationModal = styled.div`
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }
`;

const SessionTitle = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SessionDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const MeditationCircle = styled.div<{ isActive: boolean; sessionType: string }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  background: ${props => {
    switch (props.sessionType) {
      case 'focus': return 'linear-gradient(135deg, #3b82f6, #60a5fa)';
      case 'calm': return 'linear-gradient(135deg, #10b981, #34d399)';
      case 'sleep': return 'linear-gradient(135deg, #8b5cf6, #a78bfa)';
      default: return 'linear-gradient(135deg, #667eea, #764ba2)';
    }
  }};
  
  ${props => props.isActive && css`
    ${css`animation: ${breathingAnimation} 4s ease-in-out infinite;`}
  `}
`;

const Timer = styled.div`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem 0;
  font-family: 'Courier New', monospace;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const ControlButton = styled.button<{ primary?: boolean }>`
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${props => props.primary 
    ? 'transparent'
    : 'rgba(255, 255, 255, 0.2)'
  };
  color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.primary 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.15)'
    };
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SessionSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SessionCard = styled.button<{ selected?: boolean }>`
  background: ${props => props.selected 
    ? 'rgba(102, 126, 234, 0.2)' 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => props.selected 
    ? 'rgba(102, 126, 234, 0.8)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  text-align: center;

  &:hover {
    background: rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

const SessionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const SessionName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const SessionDuration = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
`;

const Instruction = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #10b981, #34d399);
  transition: width 0.3s ease;
`;

interface MeditationSessionProps {
  show: boolean;
  onClose: () => void;
}

const MeditationSession: React.FC<MeditationSessionProps> = ({ show, onClose }) => {
  const [selectedSession, setSelectedSession] = useState<string>('calm');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [originalTime, setOriginalTime] = useState(300);
  const [isMuted, setIsMuted] = useState(false);

  const sessions = [
    { id: 'focus', name: 'Focus', duration: 600, icon: '🎯', instructions: 'Focus on your breath and let thoughts pass by like clouds.' },
    { id: 'calm', name: 'Calm', duration: 300, icon: '🌊', instructions: 'Find peace and tranquility in this calming meditation.' },
    { id: 'sleep', name: 'Sleep', duration: 900, icon: '🌙', instructions: 'Prepare your mind and body for restful sleep.' },
    { id: 'anxiety', name: 'Anxiety Relief', duration: 420, icon: '🕊️', instructions: 'Release anxiety and find your center of calm.' }
  ];

  const currentSession = sessions.find(s => s.id === selectedSession) || sessions[1];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && originalTime > 0) {
      // Session completed
      setTimeout(() => {
        alert('🎉 Meditation session completed! Great job taking care of your mental health.');
      }, 500);
    }
  }, [timeLeft, originalTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSessionChange = (sessionId: string) => {
    if (!isActive) {
      setSelectedSession(sessionId);
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setTimeLeft(session.duration);
        setOriginalTime(session.duration);
      }
    }
  };

  const startSession = () => {
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(currentSession.duration);
    setOriginalTime(currentSession.duration);
  };

  const progress = originalTime > 0 ? ((originalTime - timeLeft) / originalTime) * 100 : 0;

  if (!show) return null;

  return (
    <ModalOverlay show={show}>
      <MeditationModal>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <SessionTitle>Guided Meditation</SessionTitle>
        <SessionDescription>
          Choose your meditation session and find your moment of peace
        </SessionDescription>

        <SessionSelector>
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              selected={selectedSession === session.id}
              onClick={() => handleSessionChange(session.id)}
              disabled={isActive}
            >
              <SessionIcon>{session.icon}</SessionIcon>
              <SessionName>{session.name}</SessionName>
              <SessionDuration>{Math.floor(session.duration / 60)} min</SessionDuration>
            </SessionCard>
          ))}
        </SessionSelector>

        <MeditationCircle isActive={isActive} sessionType={selectedSession}>
          {currentSession.icon}
        </MeditationCircle>

        <Timer>{formatTime(timeLeft)}</Timer>

        <ProgressBar>
          <Progress progress={progress} />
        </ProgressBar>

        <Instruction>
          {currentSession.instructions}
        </Instruction>

        <Controls>
          <ControlButton onClick={isMuted ? () => setIsMuted(false) : () => setIsMuted(true)}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </ControlButton>
          
          <ControlButton primary onClick={isActive ? pauseSession : startSession}>
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </ControlButton>

          <ControlButton onClick={resetSession}>
            <RotateCcw size={20} />
          </ControlButton>
        </Controls>

        <div style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '0.9rem', 
          marginTop: '1rem' 
        }}>
          {isActive ? '🧘‍♀️ Session in progress...' : '💫 Ready to begin your journey'}
        </div>
      </MeditationModal>
    </ModalOverlay>
  );
};

export default MeditationSession;
