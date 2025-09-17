import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const breathIn = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.8);
    opacity: 0.9;
  }
`;

const breathOut = keyframes`
  0% {
    transform: scale(1.8);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
`;

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  color: #2d3748;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const BreathingCircle = styled.div<{ phase: 'inhale' | 'hold' | 'exhale' | 'pause' }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  
  ${props => {
    if (props.phase === 'inhale') {
      return css`animation: ${breathIn} 4s ease-in-out;`;
    }
    if (props.phase === 'exhale') {
      return css`animation: ${breathOut} 8s ease-in-out;`;
    }
    return css`animation: none;`;
  }}
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 50%;
    ${props => {
      if (props.phase === 'inhale') {
        return css`animation: ${breathIn} 4s ease-in-out;`;
      }
      if (props.phase === 'exhale') {
        return css`animation: ${breathOut} 8s ease-in-out;`;
      }
      return css`animation: none;`;
    }}
  }
`;

const PhaseText = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1rem 0;
  height: 2rem;
`;

const CounterText = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #4299e1;
  margin: 0.5rem 0;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }
  `}
`;

const InstructionText = styled.div`
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const CycleCounter = styled.div`
  color: #48bb78;
  font-weight: 600;
  margin-top: 1rem;
`;

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('pause');
  const [counter, setCounter] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 1
  };

  const phaseMessages = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
    pause: "Ready?"
  };

  const phaseInstructions = {
    inhale: "Slowly inhale through your nose",
    hold: "Hold your breath gently",
    exhale: "Slowly exhale through your mouth",
    pause: "Prepare for next breath"
  };

  const nextPhase = (currentPhase: Phase): Phase => {
    switch (currentPhase) {
      case 'pause': return 'inhale';
      case 'inhale': return 'hold';
      case 'hold': return 'exhale';
      case 'exhale': return 'pause';
      default: return 'pause';
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCounter(prev => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            setPhase(currentPhase => {
              const next = nextPhase(currentPhase);
              if (next === 'pause') {
                setCycleCount(count => count + 1);
              }
              return next;
            });
            return phaseDurations[phase];
          }
          return newCount;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase]);

  useEffect(() => {
    if (isActive && counter === 0) {
      setCounter(phaseDurations[phase]);
    }
  }, [phase, isActive]);

  const handleStart = () => {
    if (!isActive) {
      setPhase('inhale');
      setCounter(phaseDurations.inhale);
      setCycleCount(0);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('pause');
    setCounter(0);
    setCycleCount(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <Container>
      <Title>
        <Zap size={20} />
        4-7-8 Breathing Exercise
      </Title>
      
      <InstructionText>
        This breathing technique helps reduce anxiety and promotes relaxation. 
        Follow the circle and breathe with the rhythm.
      </InstructionText>

      <BreathingCircle phase={phase}>
        <div>
          <div>{phaseMessages[phase]}</div>
          {isActive && <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {phaseInstructions[phase]}
          </div>}
        </div>
      </BreathingCircle>

      <PhaseText>
        {isActive ? phaseMessages[phase] : "Press Start to Begin"}
      </PhaseText>

      {isActive && (
        <CounterText>
          {counter}
        </CounterText>
      )}

      <Controls>
        <ControlButton variant="primary" onClick={handleStart}>
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          {isActive ? 'Pause' : 'Start'}
        </ControlButton>
        <ControlButton onClick={handleReset}>
          <RotateCcw size={16} />
          Reset
        </ControlButton>
      </Controls>

      {cycleCount > 0 && (
        <CycleCounter>
          Completed Cycles: {cycleCount}
        </CycleCounter>
      )}
    </Container>
  );
};

export default BreathingExercise;
