import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  BookOpen, Plus, Search, Calendar, Clock, 
  Edit3, Save, X, Heart, Star, Trash2, Eye
} from 'lucide-react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Main Container
const JournalsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  ${css`animation: ${fadeIn} 0.6s ease-out;`}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const NewEntryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
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

// Search Section
const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1rem 1rem 3rem;
  color: #ffffff;
  font-size: 1rem;
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

const SearchIcon = styled.div`
  position: absolute;
  left: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
`;

// Journal Entries
const EntriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const EntryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const EntryDate = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
`;

const EntryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const EntryTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const EntryPreview = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EntryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
`;

// New Entry Modal
const ModalOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const Modal = styled.div`
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
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

const Textarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
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

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const SaveEntryButton = styled.button`
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

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }
`;

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
  tags: string[];
}

interface JournalsViewProps {
  user: any;
}

const JournalsView: React.FC<JournalsViewProps> = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: ''
  });
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Reflecting on Personal Growth',
      content: 'Today I realized how much I have grown over the past few months. The challenges I faced have made me stronger, and I am learning to appreciate the small victories. Therapy has been incredibly helpful in processing my emotions and developing better coping strategies.',
      date: new Date(Date.now() - 86400000),
      mood: 'Grateful',
      tags: ['growth', 'therapy', 'reflection']
    },
    {
      id: '2',
      title: 'Managing Work Stress',
      content: 'Work has been overwhelming lately, but I am trying to implement better boundaries. I practiced some breathing exercises during lunch break and it really helped calm my mind. Need to remember that its okay to say no sometimes.',
      date: new Date(Date.now() - 172800000),
      mood: 'Stressed but hopeful',
      tags: ['work', 'stress', 'boundaries']
    },
    {
      id: '3',
      title: 'Weekend Self-Care',
      content: 'Spent the weekend focusing on self-care. Went for a long walk in nature, read a good book, and caught up with an old friend. These moments of peace are so important for my mental health. Feeling recharged for the week ahead.',
      date: new Date(Date.now() - 259200000),
      mood: 'Peaceful',
      tags: ['self-care', 'nature', 'friends']
    }
  ]);

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      date: new Date(),
      tags: []
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '' });
    setShowModal(false);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <JournalsContainer>
      <Header>
        <HeaderLeft>
          <Title>My Journal</Title>
          <Subtitle>Express your thoughts and track your mental health journey</Subtitle>
        </HeaderLeft>
        <NewEntryButton onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Entry
        </NewEntryButton>
      </Header>

      <SearchSection>
        <div style={{ position: 'relative' }}>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search your journal entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SearchSection>

      <EntriesGrid>
        {filteredEntries.map(entry => (
          <EntryCard key={entry.id}>
            <EntryHeader>
              <EntryDate>
                {entry.date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </EntryDate>
              <EntryActions>
                <ActionButton>
                  <Eye size={16} />
                </ActionButton>
                <ActionButton>
                  <Edit3 size={16} />
                </ActionButton>
              </EntryActions>
            </EntryHeader>
            
            <EntryTitle>{entry.title}</EntryTitle>
            <EntryPreview>{entry.content}</EntryPreview>
            
            <EntryMeta>
              {entry.mood && (
                <span>
                  <Heart size={14} style={{ marginRight: '0.25rem' }} />
                  {entry.mood}
                </span>
              )}
              <span>
                <Clock size={14} style={{ marginRight: '0.25rem' }} />
                {entry.content.split(' ').length} words
              </span>
            </EntryMeta>
          </EntryCard>
        ))}
      </EntriesGrid>

      <ModalOverlay show={showModal}>
        <Modal>
          <ModalHeader>
            <ModalTitle>New Journal Entry</ModalTitle>
            <CloseButton onClick={() => setShowModal(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Entry Title</Label>
            <Input
              type="text"
              placeholder="Give your entry a meaningful title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>Your Thoughts</Label>
            <Textarea
              placeholder="Write about your day, feelings, thoughts, or anything on your mind. This is your safe space..."
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
            />
          </FormGroup>

          <ModalActions>
            <CancelButton onClick={() => setShowModal(false)}>
              Cancel
            </CancelButton>
            <SaveEntryButton onClick={handleSaveEntry}>
              <Save size={20} />
              Save Entry
            </SaveEntryButton>
          </ModalActions>
        </Modal>
      </ModalOverlay>
    </JournalsContainer>
  );
};

export default JournalsView;
