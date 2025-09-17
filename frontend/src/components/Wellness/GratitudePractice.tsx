import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  X, Heart, Star, Save, Plus, Trash2, Calendar, 
  Smile, Sun, Sparkles
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const GratitudeModal = styled.div`
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 700px;
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

const PromptCard = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const PromptText = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const PromptIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const GratitudeInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const GratitudeInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
`;

const InputNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #34d399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const TextInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PastEntries = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h4`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EntryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const EntryDate = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GratitudeList = styled.ol`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

interface GratitudePracticeProps {
  show: boolean;
  onClose: () => void;
}

interface GratitudeEntry {
  id: string;
  date: Date;
  gratitudes: string[];
}

const GratitudePractice: React.FC<GratitudePracticeProps> = ({ show, onClose }) => {
  const [currentGratitudes, setCurrentGratitudes] = useState(['', '', '']);
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [todaysPrompt, setTodaysPrompt] = useState('');

  const prompts = [
    "What made you smile today? 😊",
    "Who in your life are you most grateful for? 🤗",
    "What small pleasure did you enjoy today? ✨",
    "What challenge helped you grow recently? 💪",
    "What in nature are you thankful for? 🌿",
    "What comfort or convenience do you appreciate? 🏠",
    "What skill or talent are you grateful to have? 🎨",
    "What memory brings you joy when you think of it? 💭",
    "What opportunity came your way recently? 🚪",
    "What act of kindness touched your heart? 💝"
  ];

  useEffect(() => {
    // Load saved entries
    const saved = localStorage.getItem('gratitudeEntries');
    if (saved) {
      try {
        const savedEntries = JSON.parse(saved).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(savedEntries);
      } catch (error) {
        console.error('Error loading gratitude entries:', error);
      }
    }

    // Set today's prompt based on date
    const today = new Date();
    const promptIndex = today.getDate() % prompts.length;
    setTodaysPrompt(prompts[promptIndex]);

    // Check if there's already an entry for today
    const todayStr = today.toDateString();
    const todaysEntry = entries.find(entry => entry.date.toDateString() === todayStr);
    if (todaysEntry) {
      setCurrentGratitudes(todaysEntry.gratitudes);
    }
  }, []);

  const handleSave = () => {
    const validGratitudes = currentGratitudes.filter(g => g.trim() !== '');
    if (validGratitudes.length === 0) return;

    const today = new Date();
    const todayStr = today.toDateString();
    
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: today,
      gratitudes: validGratitudes
    };

    // Remove existing entry for today if any
    const updatedEntries = entries.filter(entry => entry.date.toDateString() !== todayStr);
    updatedEntries.unshift(newEntry);

    setEntries(updatedEntries);
    localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries));
    
    alert('🌟 Gratitude practice saved! Thank you for taking time to appreciate the good in your life.');
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudes = [...currentGratitudes];
    newGratitudes[index] = value;
    setCurrentGratitudes(newGratitudes);
  };

  const canSave = currentGratitudes.some(g => g.trim() !== '');
  const recentEntries = entries.slice(0, 5); // Show last 5 entries

  if (!show) return null;

  return (
    <ModalOverlay show={show}>
      <GratitudeModal>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <Header>
          <Title>Gratitude Practice</Title>
          <Subtitle>
            Take a moment to appreciate the good things in your life
          </Subtitle>
        </Header>

        <PromptCard>
          <PromptIcon>🌟</PromptIcon>
          <PromptText>{todaysPrompt}</PromptText>
        </PromptCard>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>
            What are you grateful for today?
          </h4>
          <GratitudeInputs>
            {currentGratitudes.map((gratitude, index) => (
              <GratitudeInput key={index}>
                <InputNumber>{index + 1}</InputNumber>
                <TextInput
                  value={gratitude}
                  onChange={(e) => handleGratitudeChange(index, e.target.value)}
                  placeholder={`Something you're grateful for...`}
                  maxLength={200}
                />
              </GratitudeInput>
            ))}
          </GratitudeInputs>

          <SaveButton onClick={handleSave} disabled={!canSave}>
            <Save size={20} />
            Save Today's Gratitude
          </SaveButton>
        </div>

        {recentEntries.length > 0 && (
          <PastEntries>
            <SectionTitle>
              <Calendar size={18} />
              Recent Entries
            </SectionTitle>
            {recentEntries.map(entry => (
              <EntryCard key={entry.id}>
                <EntryDate>
                  <Calendar size={16} />
                  {entry.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </EntryDate>
                <GratitudeList>
                  {entry.gratitudes.map((gratitude, index) => (
                    <li key={index}>{gratitude}</li>
                  ))}
                </GratitudeList>
              </EntryCard>
            ))}
          </PastEntries>
        )}
      </GratitudeModal>
    </ModalOverlay>
  );
};

export default GratitudePractice;
