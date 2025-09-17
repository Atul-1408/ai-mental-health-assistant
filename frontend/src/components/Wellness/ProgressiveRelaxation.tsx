import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  X, Play, Pause, SkipForward, RotateCcw, 
  Volume2, VolumeX, Clock, ArrowRight
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3); }
  100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
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

const RelaxationModal = styled.div`
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ProgressIndicator = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const StepCounter = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const Timer = styled.div`
  color: #8b5cf6;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const Progress = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  transition: width 0.3s ease;
`;

const InstructionCard = styled.div<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.1) 100%)'
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 1px solid ${props => props.active 
    ? 'rgba(139, 92, 246, 0.4)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  ${props => props.active && css`
    ${css`animation: ${pulseGlow} 3s ease-in-out infinite;`}
  `}
`;

const BodyPartTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const InstructionText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const PhaseIndicator = styled.div<{ phase: 'tense' | 'hold' | 'release' }>`
  background: ${props => {
    switch (props.phase) {
      case 'tense': return 'rgba(239, 68, 68, 0.2)';
      case 'hold': return 'rgba(245, 158, 11, 0.2)';
      case 'release': return 'rgba(16, 185, 129, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.phase) {
      case 'tense': return '#ef4444';
      case 'hold': return '#f59e0b';
      case 'release': return '#10b981';
      default: return '#ffffff';
    }
  }};
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  display: inline-block;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
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

interface ProgressiveRelaxationProps {
  show: boolean;
  onClose: () => void;
}

interface RelaxationStep {
  id: number;
  bodyPart: string;
  emoji: string;
  instruction: string;
  tenseDuration: number;
  holdDuration: number;
  releaseDuration: number;
}

const ProgressiveRelaxation: React.FC<ProgressiveRelaxationProps> = ({ show, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'tense' | 'hold' | 'release'>('tense');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const steps: RelaxationStep[] = [
    {
      id: 1,
      bodyPart: "Right Foot",
      emoji: "🦶",
      instruction: "Point your right foot and curl your toes tightly. Feel the tension in your foot and calf.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 2,
      bodyPart: "Left Foot", 
      emoji: "🦶",
      instruction: "Point your left foot and curl your toes tightly. Feel the tension in your foot and calf.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 3,
      bodyPart: "Right Leg",
      emoji: "🦵",
      instruction: "Tighten your right thigh and calf muscles. Straighten your leg and press it down firmly.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 4,
      bodyPart: "Left Leg",
      emoji: "🦵", 
      instruction: "Tighten your left thigh and calf muscles. Straighten your leg and press it down firmly.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 5,
      bodyPart: "Abdomen",
      emoji: "💪",
      instruction: "Tighten your abdominal muscles. Pull them in and press them against your spine.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 6,
      bodyPart: "Right Hand",
      emoji: "✊",
      instruction: "Clench your right fist tightly. Feel the tension in your hand and forearm.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 7,
      bodyPart: "Left Hand",
      emoji: "✊",
      instruction: "Clench your left fist tightly. Feel the tension in your hand and forearm.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 8,
      bodyPart: "Shoulders",
      emoji: "🤷",
      instruction: "Raise your shoulders up to your ears. Feel the tension in your shoulders and neck.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 9,
      bodyPart: "Face",
      emoji: "😬",
      instruction: "Scrunch your face muscles. Close your eyes tightly, wrinkle your forehead, and clench your jaw.",
      tenseDuration: 5,
      holdDuration: 5,
      releaseDuration: 10
    },
    {
      id: 10,
      bodyPart: "Whole Body",
      emoji: "🧘",
      instruction: "Take a moment to scan your entire body. Notice how relaxed and peaceful you feel.",
      tenseDuration: 0,
      holdDuration: 0,
      releaseDuration: 30
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && phaseTimeLeft > 0) {
      interval = setInterval(() => {
        setPhaseTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase or step
            if (currentPhase === 'tense' && steps[currentStep].holdDuration > 0) {
              setCurrentPhase('hold');
              return steps[currentStep].holdDuration;
            } else if (currentPhase === 'hold' || (currentPhase === 'tense' && steps[currentStep].holdDuration === 0)) {
              setCurrentPhase('release');
              return steps[currentStep].releaseDuration;
            } else {
              // Move to next step
              if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
                setCurrentPhase('tense');
                return steps[currentStep + 1].tenseDuration || steps[currentStep + 1].releaseDuration;
              } else {
                // Session complete
                setIsActive(false);
                alert('🎉 Progressive relaxation session completed! Your body should feel completely relaxed now.');
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phaseTimeLeft, currentPhase, currentStep, steps]);

  const startSession = () => {
    setCurrentStep(0);
    setCurrentPhase('tense');
    setPhaseTimeLeft(steps[0].tenseDuration || steps[0].releaseDuration);
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentStep(0);
    setCurrentPhase('tense');
    setPhaseTimeLeft(0);
  };

  const skipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentPhase('tense');
      setPhaseTimeLeft(steps[currentStep + 1].tenseDuration || steps[currentStep + 1].releaseDuration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = () => {
    const step = steps[currentStep];
    if (step.id === 10) return "Breathe deeply and enjoy this peaceful state.";
    
    switch (currentPhase) {
      case 'tense': return "Tense the muscles now!";
      case 'hold': return "Hold the tension...";
      case 'release': return "Release and relax completely...";
      default: return "";
    }
  };

  const totalProgress = ((currentStep / (steps.length - 1)) * 100);

  if (!show) return null;

  return (
    <ModalOverlay show={show}>
      <RelaxationModal>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <Header>
          <Title>Progressive Muscle Relaxation</Title>
          <Subtitle>
            A guided journey to release tension and achieve deep relaxation
          </Subtitle>
        </Header>

        <ProgressIndicator>
          <StepCounter>
            Step {currentStep + 1} of {steps.length}
          </StepCounter>
          <Timer>{formatTime(phaseTimeLeft)}</Timer>
          <ProgressBar>
            <Progress progress={totalProgress} />
          </ProgressBar>
        </ProgressIndicator>

        <InstructionCard active={isActive}>
          <BodyPartTitle>
            <span style={{ fontSize: '2rem' }}>{steps[currentStep].emoji}</span>
            {steps[currentStep].bodyPart}
          </BodyPartTitle>
          
          {isActive && steps[currentStep].id !== 10 && (
            <PhaseIndicator phase={currentPhase}>
              {currentPhase} ({phaseTimeLeft}s)
            </PhaseIndicator>
          )}
          
          <InstructionText>
            {steps[currentStep].instruction}
          </InstructionText>
          
          {isActive && (
            <div style={{ 
              color: '#8b5cf6', 
              fontWeight: '600', 
              fontSize: '1.1rem',
              marginTop: '1rem'
            }}>
              {getPhaseInstruction()}
            </div>
          )}
        </InstructionCard>

        <Controls>
          <ControlButton onClick={isMuted ? () => setIsMuted(false) : () => setIsMuted(true)}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </ControlButton>
          
          <ControlButton primary onClick={isActive ? pauseSession : startSession}>
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </ControlButton>

          <ControlButton onClick={skipStep} disabled={!isActive || currentStep >= steps.length - 1}>
            <SkipForward size={20} />
          </ControlButton>

          <ControlButton onClick={resetSession}>
            <RotateCcw size={20} />
          </ControlButton>
        </Controls>

        <div style={{ 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '0.9rem', 
          marginTop: '2rem' 
        }}>
          {isActive ? '🧘‍♀️ Relaxation in progress...' : '💜 Ready to release tension and find peace'}
        </div>
      </RelaxationModal>
    </ModalOverlay>
  );
};

export default ProgressiveRelaxation;
