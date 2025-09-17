import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  X, CheckCircle, Circle, Heart, Sun, Droplets, 
  Moon, Book, Phone, Leaf, Music, 
  Smile, Award, RotateCcw
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const checkAnimation = keyframes`
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
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

const ChecklistModal = styled.div`
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

const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProgressCircle = styled.div<{ progress: number }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    #10b981 0deg,
    #10b981 ${props => (props.progress / 100) * 360}deg,
    rgba(255, 255, 255, 0.1) ${props => (props.progress / 100) * 360}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  position: relative;

  &::before {
    content: '';
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(26, 29, 41, 0.95);
    position: absolute;
  }
`;

const ProgressText = styled.div`
  position: relative;
  z-index: 1;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
`;

const ProgressLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const CompletionMessage = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ChecklistSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChecklistItems = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const ChecklistItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.completed 
    ? 'rgba(16, 185, 129, 0.1)' 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 1px solid ${props => props.completed 
    ? 'rgba(16, 185, 129, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.completed 
      ? 'rgba(16, 185, 129, 0.15)' 
      : 'rgba(255, 255, 255, 0.08)'
    };
    transform: translateY(-1px);
  }
`;

const CheckIcon = styled.div<{ completed: boolean }>`
  color: ${props => props.completed ? '#10b981' : 'rgba(255, 255, 255, 0.4)'};
  transition: all 0.3s ease;
  
  ${props => props.completed && css`
    ${css`animation: ${checkAnimation} 0.3s ease-out;`}
  `}
`;

const ItemIcon = styled.div<{ completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.completed 
    ? 'rgba(16, 185, 129, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.completed ? '#10b981' : 'rgba(255, 255, 255, 0.7)'};
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div<{ completed: boolean }>`
  color: ${props => props.completed ? '#ffffff' : 'rgba(255, 255, 255, 0.9)'};
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.8 : 1};
`;

const ItemDescription = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

interface SelfCareChecklistProps {
  show: boolean;
  onClose: () => void;
}

interface ChecklistItemType {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  completed: boolean;
}

const SelfCareChecklist: React.FC<SelfCareChecklistProps> = ({ show, onClose }) => {
  const [items, setItems] = useState<ChecklistItemType[]>([
    // Physical Wellness
    { id: '1', title: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day', icon: 'Droplets', category: 'Physical', completed: false },
    { id: '2', title: 'Take a 10-minute walk', description: 'Get some fresh air and movement', icon: 'Sun', category: 'Physical', completed: false },
    { id: '3', title: 'Eat a nutritious meal', description: 'Fuel your body with healthy food', icon: 'Heart', category: 'Physical', completed: false },
    { id: '4', title: 'Get 7-8 hours of sleep', description: 'Rest and recharge your body', icon: 'Moon', category: 'Physical', completed: false },

    // Mental Wellness
    { id: '5', title: '5 minutes of meditation', description: 'Practice mindfulness and calm your mind', icon: 'Leaf', category: 'Mental', completed: false },
    { id: '6', title: 'Write in gratitude journal', description: 'Note 3 things you\'re grateful for', icon: 'Book', category: 'Mental', completed: false },
    { id: '7', title: 'Listen to uplifting music', description: 'Boost your mood with favorite songs', icon: 'Music', category: 'Mental', completed: false },
    { id: '8', title: 'Practice positive self-talk', description: 'Speak kindly to yourself today', icon: 'Smile', category: 'Mental', completed: false },

    // Social Wellness
    { id: '9', title: 'Connect with a friend', description: 'Reach out to someone you care about', icon: 'Phone', category: 'Social', completed: false },
    { id: '10', title: 'Express appreciation', description: 'Thank someone or show gratitude', icon: 'Heart', category: 'Social', completed: false }
  ]);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem('selfCareChecklist');
    if (saved) {
      try {
        const savedItems = JSON.parse(saved);
        const today = new Date().toDateString();
        if (savedItems.date === today) {
          setItems(savedItems.items);
        }
      } catch (error) {
        console.error('Error loading checklist:', error);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('selfCareChecklist', JSON.stringify({
      date: today,
      items: items
    }));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const resetChecklist = () => {
    setItems(prev => prev.map(item => ({ ...item, completed: false })));
  };

  const completedCount = items.filter(item => item.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  const getProgressMessage = () => {
    if (progress === 100) return "🎉 Amazing! You've completed all your self-care activities!";
    if (progress >= 75) return "🌟 You're doing great! Almost there!";
    if (progress >= 50) return "💪 Great progress! Keep going!";
    if (progress >= 25) return "✨ Good start! You've got this!";
    return "🌱 Take your first step towards self-care!";
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItemType[]>);

  const iconMap = {
    Droplets,
    Sun,
    Heart,
    Moon,
    Leaf,
    Book,
    Music,
    Smile,
    Phone
  };

  const categoryIcons = {
    Physical: Heart,
    Mental: Leaf,
    Social: Phone
  };

  if (!show) return null;

  return (
    <ModalOverlay show={show}>
      <ChecklistModal>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <Header>
          <Title>Daily Self-Care Checklist</Title>
          <Subtitle>
            Take care of yourself with these daily wellness activities
          </Subtitle>
        </Header>

        <ProgressSection>
          <ProgressCircle progress={progress}>
            <ProgressText>{progress}%</ProgressText>
          </ProgressCircle>
          <ProgressLabel>
            {completedCount} of {items.length} completed
          </ProgressLabel>
          <CompletionMessage>
            {getProgressMessage()}
          </CompletionMessage>
        </ProgressSection>

        {Object.entries(groupedItems).map(([category, categoryItems]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Heart;
          return (
            <ChecklistSection key={category}>
              <SectionTitle>
                <CategoryIcon size={20} />
                {category} Wellness
              </SectionTitle>
              <ChecklistItems>
                {categoryItems.map(item => (
                  <ChecklistItem 
                    key={item.id} 
                    completed={item.completed}
                    onClick={() => toggleItem(item.id)}
                  >
                    <CheckIcon completed={item.completed}>
                      {item.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </CheckIcon>
                    <ItemIcon completed={item.completed}>
                      {(() => {
                        const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Heart;
                        return <IconComponent size={20} />;
                      })()}
                    </ItemIcon>
                    <ItemContent>
                      <ItemTitle completed={item.completed}>
                        {item.title}
                      </ItemTitle>
                      <ItemDescription>
                        {item.description}
                      </ItemDescription>
                    </ItemContent>
                  </ChecklistItem>
                ))}
              </ChecklistItems>
            </ChecklistSection>
          );
        })}

        <Actions>
          <ActionButton onClick={resetChecklist}>
            <RotateCcw size={20} />
            Reset Progress
          </ActionButton>
          {progress === 100 && (
            <ActionButton style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              border: 'none'
            }}>
              <Award size={20} />
              Celebrate!
            </ActionButton>
          )}
        </Actions>
      </ChecklistModal>
    </ModalOverlay>
  );
};

export default SelfCareChecklist;
