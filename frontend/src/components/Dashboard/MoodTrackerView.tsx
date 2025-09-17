import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Heart, TrendingUp, Calendar, Clock, BarChart3, 
  Smile, Frown, Meh, Sun, Cloud, CloudRain,
  Star, Plus, Save, ArrowLeft, ArrowRight,
  Activity, Brain, Target, Award, Zap
} from 'lucide-react';

// Animations
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const moodPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Main Container
const MoodTrackerContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  ${css`animation: ${slideIn} 0.6s ease-out;`}
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

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto;
`;

// Mood Selection Section
const MoodSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const MoodTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MoodButton = styled.button<{ selected?: boolean; color: string }>`
  background: ${props => props.selected 
    ? `rgba(${props.color}, 0.3)` 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => props.selected 
    ? `rgba(${props.color}, 0.8)` 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  ${props => props.selected && css`
    ${css`animation: ${moodPulse} 2s ease-in-out infinite;`}
  `}
`;

const MoodIcon = styled.div`
  font-size: 2.5rem;
`;

const MoodLabel = styled.div`
  font-size: 1rem;
`;

// Notes Section
const NotesSection = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const NotesLabel = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: 1rem;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.8);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  }

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
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// History Section
const HistorySection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const HistoryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// History Timeline
const TimelineContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.5);
    border-radius: 3px;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.02);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const TimelineMoodIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(${props => props.color}, 0.2);
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineDate = styled.div`
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const TimelineMood = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TimelineNotes = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-style: italic;
`;

// Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div<{ color: string }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch (props.color) {
        case 'green': return 'linear-gradient(90deg, #10b981, #34d399)';
        case 'blue': return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        case 'purple': return 'linear-gradient(90deg, #8b5cf6, #a78bfa)';
        case 'orange': return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        default: return 'linear-gradient(90deg, #667eea, #764ba2)';
      }
    }};
    border-radius: 16px 16px 0 0;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${props => {
    switch (props.color) {
      case 'green': return 'rgba(16, 185, 129, 0.2)';
      case 'blue': return 'rgba(59, 130, 246, 0.2)';
      case 'purple': return 'rgba(139, 92, 246, 0.2)';
      case 'orange': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'green': return '#10b981';
      case 'blue': return '#3b82f6';
      case 'purple': return '#8b5cf6';
      case 'orange': return '#f59e0b';
      default: return '#667eea';
    }
  }};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
`;

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  notes: string;
  date: Date;
  score: number;
}

interface MoodTrackerViewProps {
  user: any;
}

const MoodTrackerView: React.FC<MoodTrackerViewProps> = ({ user }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setSaving] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([
    {
      id: '1',
      mood: 'Great',
      emoji: '😊',
      notes: 'Had a wonderful day with family',
      date: new Date(Date.now() - 86400000),
      score: 9
    },
    {
      id: '2',
      mood: 'Good',
      emoji: '🙂',
      notes: 'Productive work session today',
      date: new Date(Date.now() - 172800000),
      score: 7
    },
    {
      id: '3',
      mood: 'Okay',
      emoji: '😐',
      notes: 'Feeling neutral, nothing special',
      date: new Date(Date.now() - 259200000),
      score: 5
    },
    {
      id: '4',
      mood: 'Stressed',
      emoji: '😰',
      notes: 'Work deadlines causing anxiety',
      date: new Date(Date.now() - 345600000),
      score: 3
    }
  ]);

  const moods = [
    { name: 'Excellent', emoji: '😍', color: '16, 185, 129', score: 10 },
    { name: 'Great', emoji: '😊', color: '34, 197, 94', score: 9 },
    { name: 'Good', emoji: '🙂', color: '59, 130, 246', score: 7 },
    { name: 'Okay', emoji: '😐', color: '156, 163, 175', score: 5 },
    { name: 'Meh', emoji: '😕', color: '245, 158, 11', score: 4 },
    { name: 'Down', emoji: '☹️', color: '249, 115, 22', score: 3 },
    { name: 'Stressed', emoji: '😰', color: '239, 68, 68', score: 2 },
    { name: 'Awful', emoji: '😭', color: '220, 38, 127', score: 1 }
  ];

  const handleSaveMood = async () => {
    if (!selectedMood) return;
    
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const moodData = moods.find(m => m.name === selectedMood);
      if (moodData) {
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          mood: selectedMood,
          emoji: moodData.emoji,
          notes: notes,
          date: new Date(),
          score: moodData.score
        };
        
        setMoodHistory(prev => [newEntry, ...prev]);
        setSelectedMood('');
        setNotes('');
      }
      setSaving(false);
    }, 1000);
  };

  const getColorForMood = (moodName: string) => {
    const mood = moods.find(m => m.name === moodName);
    return mood ? mood.color : '102, 126, 234';
  };

  const averageMood = moodHistory.length > 0 
    ? (moodHistory.reduce((sum, entry) => sum + entry.score, 0) / moodHistory.length).toFixed(1)
    : '0';

  const bestMood = moodHistory.length > 0 
    ? Math.max(...moodHistory.map(entry => entry.score))
    : 0;

  const weeklyAverage = moodHistory
    .filter(entry => Date.now() - entry.date.getTime() < 7 * 24 * 60 * 60 * 1000)
    .reduce((sum, entry, _, arr) => arr.length ? sum + entry.score / arr.length : 0, 0)
    .toFixed(1);

  return (
    <MoodTrackerContainer>
      <Header>
        <Title>Mood Tracker</Title>
        <Subtitle>Track your daily emotions and discover patterns in your mental wellbeing</Subtitle>
      </Header>

      <MoodSection>
        <MoodTitle>
          <Heart size={24} />
          How are you feeling today?
        </MoodTitle>
        
        <MoodGrid>
          {moods.map(mood => (
            <MoodButton
              key={mood.name}
              selected={selectedMood === mood.name}
              color={mood.color}
              onClick={() => setSelectedMood(mood.name)}
            >
              <MoodIcon>{mood.emoji}</MoodIcon>
              <MoodLabel>{mood.name}</MoodLabel>
            </MoodButton>
          ))}
        </MoodGrid>

        <NotesSection>
          <NotesLabel>How was your day? (Optional)</NotesLabel>
          <NotesTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share what made you feel this way, any thoughts, or what you're grateful for..."
            maxLength={500}
          />
        </NotesSection>

        <SaveButton 
          onClick={handleSaveMood} 
          disabled={!selectedMood || isLoading}
        >
          <Save size={20} />
          {isLoading ? 'Saving...' : 'Save Mood Entry'}
        </SaveButton>
      </MoodSection>

      <StatsGrid>
        <StatCard color="blue">
          <StatIcon color="blue">
            <TrendingUp size={20} />
          </StatIcon>
          <StatValue>{averageMood}</StatValue>
          <StatLabel>Average Mood</StatLabel>
        </StatCard>

        <StatCard color="green">
          <StatIcon color="green">
            <Star size={20} />
          </StatIcon>
          <StatValue>{bestMood}/10</StatValue>
          <StatLabel>Best This Month</StatLabel>
        </StatCard>

        <StatCard color="purple">
          <StatIcon color="purple">
            <Activity size={20} />
          </StatIcon>
          <StatValue>{weeklyAverage}</StatValue>
          <StatLabel>Weekly Average</StatLabel>
        </StatCard>

        <StatCard color="orange">
          <StatIcon color="orange">
            <Target size={20} />
          </StatIcon>
          <StatValue>{moodHistory.length}</StatValue>
          <StatLabel>Total Entries</StatLabel>
        </StatCard>
      </StatsGrid>

      <HistorySection>
        <HistoryCard>
          <SectionTitle>
            <Calendar size={20} />
            Recent Mood History
          </SectionTitle>
          <TimelineContainer>
            {moodHistory.map(entry => (
              <TimelineItem key={entry.id}>
                <TimelineMoodIcon color={getColorForMood(entry.mood)}>
                  {entry.emoji}
                </TimelineMoodIcon>
                <TimelineContent>
                  <TimelineDate>
                    {entry.date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TimelineDate>
                  <TimelineMood>Feeling {entry.mood} ({entry.score}/10)</TimelineMood>
                  {entry.notes && (
                    <TimelineNotes>"{entry.notes}"</TimelineNotes>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineContainer>
        </HistoryCard>

        <HistoryCard>
          <SectionTitle>
            <Brain size={20} />
            Mood Insights
          </SectionTitle>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
              <strong style={{ color: '#3b82f6' }}>💡 Pattern Detected:</strong>
              <br />
              You tend to feel better on weekends. Consider incorporating weekend activities into your weekdays.
            </div>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
              <strong style={{ color: '#10b981' }}>✨ Positive Trend:</strong>
              <br />
              Your mood has improved by 15% over the past month. Keep up the great work!
            </div>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <strong style={{ color: '#8b5cf6' }}>🎯 Recommendation:</strong>
              <br />
              Try meditation on low-mood days. Users report 23% better outcomes.
            </div>
          </div>
        </HistoryCard>
      </HistorySection>
    </MoodTrackerContainer>
  );
};

export default MoodTrackerView;
