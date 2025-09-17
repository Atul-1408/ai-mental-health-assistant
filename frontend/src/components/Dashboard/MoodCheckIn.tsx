import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Smile, Coffee, Moon, MessageSquare, Check } from 'lucide-react';
import { MoodCheckIn as IMoodCheckIn, loadMoodCheckIns, upsertMoodCheckIn, getTodayKey } from '../../utils/mood';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const MoodRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MoodButton = styled.button<{ active: boolean; color: string }>`
  width: 50px;
  height: 50px;
  border: 2px solid ${props => props.active ? props.color : '#e2e8f0'};
  background: ${props => props.active ? props.color : 'white'};
  color: ${props => props.active ? 'white' : '#718096'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
  }
`;

const SuccessMessage = styled.div`
  background: #c6f6d5;
  color: #276749;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const moodLabels = ['😞', '😟', '😐', '😊', '😍'];
const moodColors = ['#e53e3e', '#ed8936', '#ecc94b', '#48bb78', '#9f7aea'];

const MoodCheckIn: React.FC = () => {
  const [entry, setEntry] = useState<IMoodCheckIn>({
    date: getTodayKey(),
    mood: 3,
    energy: 3,
    sleepHours: 8,
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasCheckInToday, setHasCheckInToday] = useState(false);

  useEffect(() => {
    // Load today's check-in if it exists
    const checkIns = loadMoodCheckIns();
    const todayEntry = checkIns.find(c => c.date === getTodayKey());
    if (todayEntry) {
      setEntry(todayEntry);
      setHasCheckInToday(true);
    }
  }, []);

  const handleSubmit = () => {
    upsertMoodCheckIn(entry);
    setShowSuccess(true);
    setHasCheckInToday(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Container>
      <Title>
        <Smile size={20} />
        Daily Mood Check-In
      </Title>

      <Section>
        <Label>How are you feeling today? (1 = Very Bad, 5 = Amazing)</Label>
        <MoodRow>
          {[1, 2, 3, 4, 5].map((rating) => (
            <MoodButton
              key={rating}
              active={entry.mood === rating}
              color={moodColors[rating - 1]}
              onClick={() => setEntry({ ...entry, mood: rating as 1|2|3|4|5 })}
            >
              {moodLabels[rating - 1]}
            </MoodButton>
          ))}
        </MoodRow>
      </Section>

      <Section>
        <Label>Energy Level (1 = Exhausted, 5 = Very Energetic)</Label>
        <MoodRow>
          {[1, 2, 3, 4, 5].map((rating) => (
            <MoodButton
              key={rating}
              active={entry.energy === rating}
              color="#4299e1"
              onClick={() => setEntry({ ...entry, energy: rating as 1|2|3|4|5 })}
            >
              <Coffee size={16} />
            </MoodButton>
          ))}
        </MoodRow>
      </Section>

      <Section>
        <Label>Sleep Hours</Label>
        <Input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={entry.sleepHours || 8}
          onChange={(e) => setEntry({ ...entry, sleepHours: parseFloat(e.target.value) })}
        />
      </Section>

      <Section>
        <Label>Notes (Optional)</Label>
        <TextArea
          value={entry.notes || ''}
          onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
          placeholder="How are you feeling? What happened today? Any insights..."
        />
      </Section>

      <SubmitButton onClick={handleSubmit}>
        <Check size={16} />
        {hasCheckInToday ? 'Update Check-In' : 'Save Check-In'}
      </SubmitButton>

      {showSuccess && (
        <SuccessMessage>
          <Check size={16} />
          Mood check-in saved successfully! Keep tracking your progress.
        </SuccessMessage>
      )}
    </Container>
  );
};

export default MoodCheckIn;
