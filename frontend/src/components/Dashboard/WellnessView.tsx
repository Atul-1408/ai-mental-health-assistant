import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Leaf, Wind, Heart, Play, Pause, RotateCcw,
  Clock, Target, Star, CheckCircle, Brain
} from 'lucide-react';

// Import functional components
import MeditationSession from '../Wellness/MeditationSession';
import SelfCareChecklist from '../Wellness/SelfCareChecklist';
import GratitudePractice from '../Wellness/GratitudePractice';
import ProgressiveRelaxation from '../Wellness/ProgressiveRelaxation';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const breathe = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const WellnessContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  ${css`animation: ${fadeIn} 0.6s ease-out;`}
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ActivityCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ActivityIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: ${props => {
    switch (props.color) {
      case 'green': return 'rgba(16, 185, 129, 0.2)';
      case 'blue': return 'rgba(59, 130, 246, 0.2)';
      case 'purple': return 'rgba(139, 92, 246, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'green': return '#10b981';
      case 'blue': return '#3b82f6';
      case 'purple': return '#8b5cf6';
      default: return '#667eea';
    }
  }};
`;

const ActivityTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ActivityDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const BreathingExercise = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  margin-bottom: 3rem;

  ${props => props.isActive && css`
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
  `}
`;

const BreathingCircle = styled.div<{ isBreathing: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #34d399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  
  ${props => props.isBreathing && css`
    ${css`animation: ${breathe} 4s ease-in-out infinite;`}
  `}
`;

const BreathingControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Timer = styled.div`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 1rem;
`;

interface WellnessViewProps {
  user: any;
}

const WellnessView: React.FC<WellnessViewProps> = ({ user }) => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showSelfCare, setShowSelfCare] = useState(false);
  const [showGratitude, setShowGratitude] = useState(false);
  const [showRelaxation, setShowRelaxation] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setActiveExercise('breathing');
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setActiveExercise(null);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsBreathing(false);
    setActiveExercise(null);
  };

  return (
    <WellnessContainer>
      <Header>
        <Title>Wellness Center</Title>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
          Take care of your mind and body with guided wellness activities
        </p>
      </Header>

      <BreathingExercise isActive={activeExercise === 'breathing'}>
        <ActivityTitle>
          <Wind size={24} style={{ marginRight: '0.5rem' }} />
          Breathing Exercise
        </ActivityTitle>
        
        <BreathingCircle isBreathing={isBreathing}>
          {isBreathing ? 'Breathe' : 'Ready'}
        </BreathingCircle>
        
        <Timer>{formatTime(timer)}</Timer>
        
        <BreathingControls>
          <ControlButton onClick={isBreathing ? stopBreathing : startBreathing}>
            {isBreathing ? <Pause size={20} /> : <Play size={20} />}
          </ControlButton>
          <ControlButton onClick={resetTimer}>
            <RotateCcw size={20} />
          </ControlButton>
        </BreathingControls>
        
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', maxWidth: '400px' }}>
          Follow the circle's rhythm: inhale as it expands, exhale as it contracts. 
          Focus on your breath and let go of any tension.
        </p>
      </BreathingExercise>

      <ActivitiesGrid>
        <ActivityCard>
          <ActivityIcon color="green">
            <Leaf size={32} />
          </ActivityIcon>
          <ActivityTitle>Mindful Meditation</ActivityTitle>
          <ActivityDescription>
            Practice mindfulness with guided meditation sessions designed to reduce stress and improve focus.
          </ActivityDescription>
          <StartButton onClick={() => setShowMeditation(true)}>
            <Play size={20} />
            Start Meditation
          </StartButton>
        </ActivityCard>

        <ActivityCard>
          <ActivityIcon color="blue">
            <Heart size={32} />
          </ActivityIcon>
          <ActivityTitle>Self-Care Checklist</ActivityTitle>
          <ActivityDescription>
            Daily self-care activities to help maintain your physical and mental wellbeing.
          </ActivityDescription>
          <StartButton onClick={() => setShowSelfCare(true)}>
            <CheckCircle size={20} />
            View Checklist
          </StartButton>
        </ActivityCard>

        <ActivityCard>
          <ActivityIcon color="purple">
            <Brain size={32} />
          </ActivityIcon>
          <ActivityTitle>Progressive Relaxation</ActivityTitle>
          <ActivityDescription>
            Systematic muscle relaxation technique to release physical tension and promote calm.
          </ActivityDescription>
          <StartButton onClick={() => setShowRelaxation(true)}>
            <Play size={20} />
            Start Session
          </StartButton>
        </ActivityCard>

        <ActivityCard>
          <ActivityIcon color="green">
            <Target size={32} />
          </ActivityIcon>
          <ActivityTitle>Gratitude Practice</ActivityTitle>
          <ActivityDescription>
            Daily gratitude exercises to shift your mindset toward positivity and appreciation.
          </ActivityDescription>
          <StartButton onClick={() => setShowGratitude(true)}>
            <Star size={20} />
            Practice Gratitude
          </StartButton>
        </ActivityCard>
      </ActivitiesGrid>

      {/* Modal Components */}
      <MeditationSession 
        show={showMeditation} 
        onClose={() => setShowMeditation(false)} 
      />
      
      <SelfCareChecklist 
        show={showSelfCare} 
        onClose={() => setShowSelfCare(false)} 
      />
      
      <GratitudePractice 
        show={showGratitude} 
        onClose={() => setShowGratitude(false)} 
      />
      
      <ProgressiveRelaxation 
        show={showRelaxation} 
        onClose={() => setShowRelaxation(false)} 
      />
    </WellnessContainer>
  );
};

export default WellnessView;
