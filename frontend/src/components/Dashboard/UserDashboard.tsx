import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  User, Settings, MessageCircle, BarChart3, Heart, 
  Calendar, Clock, Trash2, Download, Shield, 
  Bell, Palette, Volume2, Eye, Smile, Zap, Edit
} from 'lucide-react';
import { User as UserType, ChatSession, EmotionAnalysis } from '../../types';
import apiService from '../../services/api';
import MoodCheckIn from './MoodCheckIn';
import BreathingExercise from '../Common/BreathingExercise';
import UserProfileEdit from '../Profile/UserProfileEdit';
import { getDailyQuote } from '../../utils/quotes';
import { loadMoodCheckIns } from '../../utils/mood';
import notificationService, { scheduleReminders } from '../../utils/notifications';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f7fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const QuoteBanner = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%);
  color: #2d3748;
  font-style: italic;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 600;
`;

const UserDetails = styled.div`
  color: #718096;
  font-size: 0.95rem;
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TabNav = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#f7fafc' : 'white'};
  color: ${props => props.active ? '#4299e1' : '#718096'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: #f7fafc;
    color: #4299e1;
  }
  
  ${props => props.active && `
    border-bottom: 2px solid #4299e1;
  `}
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ChatHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChatHistoryItem = styled.div`
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4299e1;
    background: #ebf8ff;
  }
`;

const ChatTitle = styled.div`
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const ChatMeta = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  font-size: 0.85rem;
  color: #718096;
`;

const ChatDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ChatActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: #e2e8f0;
    color: #4a5568;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const SettingLabel = styled.div`
  font-weight: 500;
  color: #2d3748;
`;

const SettingDescription = styled.div`
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.25rem;
`;

const Toggle = styled.button<{ active: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: ${props => props.active ? '#4299e1' : '#e2e8f0'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #718096;
`;

interface UserDashboardProps {
  user: UserType;
  onStartNewChat: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onStartNewChat }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [dailyQuote, setDailyQuote] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(user);
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: false,
    darkMode: false,
    crisisAlerts: true,
    dataCollection: true
  });
  
  // Mock data for demonstration
  useEffect(() => {
    // Load daily quote
    setDailyQuote(getDailyQuote());
    
    // Load dark mode setting from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    console.log('Loading dark mode setting:', savedDarkMode);
    
    if (savedDarkMode) {
      const isDarkMode = JSON.parse(savedDarkMode);
      console.log('Parsed dark mode:', isDarkMode);
      setSettings(prev => ({ ...prev, darkMode: isDarkMode }));
      
      // Apply dark mode immediately
      if (isDarkMode) {
        console.log('Applying dark mode...');
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ffffff';
        document.body.classList.add('dark-mode');
        document.documentElement.style.backgroundColor = '#1a1a1a';
      } else {
        console.log('Applying light mode...');
        document.body.style.backgroundColor = '#f7fafc';
        document.body.style.color = '#2d3748';
        document.body.classList.remove('dark-mode');
        document.documentElement.style.backgroundColor = '#f7fafc';
      }
    }
    
    // Initialize notifications if enabled in settings
    if (settings.notifications && notificationService.isSupported()) {
      notificationService.requestPermission().then(permission => {
        if (permission === 'granted') {
          scheduleReminders();
        }
      });
    }
    
    // Clear any existing demo data and start fresh
    const hasInitialized = localStorage.getItem('appInitialized');
    if (!hasInitialized) {
      localStorage.removeItem('chatHistory');
      localStorage.setItem('appInitialized', 'true');
    }
    
    // Load real chat history from localStorage if available
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      try {
        const parsedHistory = JSON.parse(savedChatHistory);
        setChatHistory(parsedHistory.map((chat: any) => ({
          ...chat,
          created_at: new Date(chat.created_at),
          updated_at: new Date(chat.updated_at)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
        setChatHistory([]);
      }
    }
    // If no saved history, start with empty array
  }, []);

  const handleSettingToggle = (setting: string) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      };
      
      // Handle notifications setting
      if (setting === 'notifications' && newSettings.notifications) {
        notificationService.requestPermission().then(permission => {
          if (permission === 'granted') {
            scheduleReminders();
            notificationService.showPositiveAffirmation('Notifications enabled! We\'ll help remind you to check in with yourself.');
          }
        });
      }
      
      // Handle dark mode setting
      if (setting === 'darkMode') {
        console.log('Dark mode toggled to:', newSettings.darkMode);
        
        // Save to localStorage
        localStorage.setItem('darkMode', JSON.stringify(newSettings.darkMode));
        console.log('Saved to localStorage:', localStorage.getItem('darkMode'));
        
        // Apply dark mode to body and document
        if (newSettings.darkMode) {
          console.log('Enabling dark mode...');
          document.body.style.backgroundColor = '#1a1a1a';
          document.body.style.color = '#ffffff';
          document.body.classList.add('dark-mode');
          document.documentElement.style.backgroundColor = '#1a1a1a';
          
          // Force update all elements
          setTimeout(() => {
            const allElements = document.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style.backgroundColor === 'white' || el.style.backgroundColor === '#f7fafc') {
                el.style.backgroundColor = '#2d2d2d';
              }
            });
          }, 100);
        } else {
          console.log('Disabling dark mode...');
          document.body.style.backgroundColor = '#f7fafc';
          document.body.style.color = '#2d3748';
          document.body.classList.remove('dark-mode');
          document.documentElement.style.backgroundColor = '#f7fafc';
        }
      }
      
      return newSettings;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Function to save chat sessions
  const saveChatSession = (title: string, messages: any[]) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title,
      created_at: new Date(),
      updated_at: new Date(),
      messages: messages
    };
    
    const updatedHistory = [...chatHistory, newSession];
    setChatHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  // Chat management functions
  const handleViewChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      alert(`Viewing chat: "${chat.title}"\n\nThis would normally open the chat in a modal or navigate to a detailed view. For this demo, this is just a placeholder.`);
    }
  };

  const handleDownloadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      // Create a simple text export of the chat
      const exportData = {
        title: chat.title,
        created_at: chat.created_at.toISOString(),
        updated_at: chat.updated_at.toISOString(),
        message_count: chat.messages.length,
        content: `Chat Session: ${chat.title}\nDate: ${formatDate(chat.created_at)}\nMessages: ${chat.messages.length}\n\nThis is a demo export. In a real application, this would contain all the conversation messages.`
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mindchat-${chat.title.toLowerCase().replace(/\s+/g, '-')}-${chat.created_at.toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat && window.confirm(`Are you sure you want to delete the chat "${chat.title}"? This action cannot be undone.`)) {
      setChatHistory(prev => prev.filter(c => c.id !== chatId));
      alert('Chat deleted successfully!');
    }
  };

  // Profile management functions
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setActiveTab('profile');
  };

  const handleSaveProfile = (profileData: Partial<UserType>) => {
    // Update user profile
    setUserProfile(prev => ({ ...prev, ...profileData }));
    setIsEditingProfile(false);
    
    // In a real app, you would save to backend here
    console.log('Saving profile data:', profileData);
    alert('Profile updated successfully! 🎉');
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    if (activeTab === 'profile') {
      setActiveTab('overview');
    }
  };

  const renderOverview = () => {
    const moodData = loadMoodCheckIns();
    const avgMood = moodData.length > 0 
      ? (moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length).toFixed(1)
      : '0';
    
    return (
    <>
      <StatsGrid>
        <StatCard style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
          <StatValue>{chatHistory.length}</StatValue>
          <StatLabel>Total Conversations</StatLabel>
        </StatCard>
        <StatCard style={{ background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' }}>
          <StatValue>{avgMood}</StatValue>
          <StatLabel>Avg. Mood Score</StatLabel>
        </StatCard>
        <StatCard style={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' }}>
          <StatValue>{moodData.length}</StatValue>
          <StatLabel>Mood Check-ins</StatLabel>
        </StatCard>
        <StatCard style={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)' }}>
          <StatValue>100%</StatValue>
          <StatLabel>Safe & Supported</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Recent Activity</h3>
          <ChatHistoryList>
            {chatHistory.slice(0, 3).map(chat => (
              <ChatHistoryItem key={chat.id}>
                <ChatTitle>{chat.title}</ChatTitle>
                <ChatMeta>
                  <ChatDate>
                    <Calendar size={14} />
                    {formatDate(chat.created_at)}
                  </ChatDate>
                  <ChatActions>
                    <ActionButton 
                      onClick={() => handleViewChat(chat.id)}
                      title="View chat details"
                    >
                      <Eye size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleDownloadChat(chat.id)}
                      title="Download chat"
                    >
                      <Download size={16} />
                    </ActionButton>
                  </ChatActions>
                </ChatMeta>
              </ChatHistoryItem>
            ))}
          </ChatHistoryList>
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={onStartNewChat}
              style={{
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <MessageCircle size={16} />
              Start New Chat
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              style={{
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Smile size={16} />
              Mood Check-in
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              style={{
                background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Zap size={16} />
              Breathing Exercise
            </button>
          </div>
        </div>
      </div>
    </>
    );
  };

  const renderChatHistory = () => (
    <div>
      {chatHistory.length === 0 ? (
        <EmptyState>
          <MessageCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <div>No chat history yet</div>
          <button
            onClick={onStartNewChat}
            style={{
              marginTop: '1rem',
              background: '#4299e1',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Start Your First Chat
          </button>
        </EmptyState>
      ) : (
        <ChatHistoryList>
          {chatHistory.map(chat => (
            <ChatHistoryItem key={chat.id}>
              <ChatTitle>{chat.title}</ChatTitle>
              <ChatMeta>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <ChatDate>
                    <Calendar size={14} />
                    {formatDate(chat.created_at)}
                  </ChatDate>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    {chat.messages.length} messages
                  </span>
                </div>
                <ChatActions>
                  <ActionButton 
                    onClick={() => handleViewChat(chat.id)}
                    title="View chat details"
                  >
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDownloadChat(chat.id)}
                    title="Download chat"
                  >
                    <Download size={16} />
                  </ActionButton>
                  <ActionButton 
                    onClick={() => handleDeleteChat(chat.id)}
                    title="Delete chat"
                    style={{ color: '#e53e3e' }}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ChatActions>
              </ChatMeta>
            </ChatHistoryItem>
          ))}
        </ChatHistoryList>
      )}
    </div>
  );

  const renderSettings = () => (
    <div>
      <SettingsSection>
        <SectionTitle>
          <Bell size={20} />
          Notifications
        </SectionTitle>
        <SettingItem>
          <div>
            <SettingLabel>Push Notifications</SettingLabel>
            <SettingDescription>Receive notifications for important updates</SettingDescription>
          </div>
          <Toggle 
            active={settings.notifications} 
            onClick={() => handleSettingToggle('notifications')}
          />
        </SettingItem>
        <SettingItem>
          <div>
            <SettingLabel>Crisis Alerts</SettingLabel>
            <SettingDescription>Show crisis support resources when needed</SettingDescription>
          </div>
          <Toggle 
            active={settings.crisisAlerts} 
            onClick={() => handleSettingToggle('crisisAlerts')}
          />
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <Palette size={20} />
          Appearance
        </SectionTitle>
        <SettingItem>
          <div>
            <SettingLabel>Dark Mode</SettingLabel>
            <SettingDescription>Use dark theme for better night viewing</SettingDescription>
          </div>
          <Toggle 
            active={settings.darkMode} 
            onClick={() => handleSettingToggle('darkMode')}
          />
        </SettingItem>
        <SettingItem>
          <div>
            <SettingLabel>Sound Effects</SettingLabel>
            <SettingDescription>Play sounds for message notifications</SettingDescription>
          </div>
          <Toggle 
            active={settings.soundEffects} 
            onClick={() => handleSettingToggle('soundEffects')}
          />
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <Shield size={20} />
          Privacy & Data
        </SectionTitle>
        <SettingItem>
          <div>
            <SettingLabel>Data Collection</SettingLabel>
            <SettingDescription>Help improve our service by sharing anonymized usage data</SettingDescription>
          </div>
          <Toggle 
            active={settings.dataCollection} 
            onClick={() => handleSettingToggle('dataCollection')}
          />
        </SettingItem>
      </SettingsSection>
    </div>
  );

  const renderWellness = () => (
    <div>
      <MoodCheckIn />
      <BreathingExercise />
    </div>
  );

  const renderProfile = () => {
    if (isEditingProfile) {
      return (
        <UserProfileEdit
          user={userProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancelProfileEdit}
        />
      );
    }
    
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Profile Management</h3>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            View and edit your profile information, preferences, and settings.
          </p>
          <button
            onClick={handleEditProfile}
            style={{
              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              color: 'white',
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Edit size={16} />
            Edit Your Profile
          </button>
        </div>
      </div>
    );
  };

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Avatar>
            {getUserInitials(userProfile.name || userProfile.username)}
          </Avatar>
          <UserInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <UserName>{userProfile.name || userProfile.username}</UserName>
              <button
                onClick={handleEditProfile}
                style={{
                  background: 'rgba(66, 153, 225, 0.1)',
                  border: '1px solid #4299e1',
                  color: '#4299e1',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4299e1';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(66, 153, 225, 0.1)';
                  e.currentTarget.style.color = '#4299e1';
                }}
              >
                <Edit size={14} />
                Edit Profile
              </button>
            </div>
            <UserDetails>
              <span>Email: {userProfile.email}</span>
              <span>Member since: {userProfile.created_at ? formatDate(new Date(userProfile.created_at)) : 'Recently'}</span>
              {userProfile.location && <span>📍 {userProfile.location}</span>}
              {userProfile.occupation && <span>💼 {userProfile.occupation}</span>}
            </UserDetails>
            {userProfile.bio && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                background: 'rgba(66, 153, 225, 0.05)', 
                borderRadius: '8px',
                fontStyle: 'italic',
                color: '#4a5568'
              }}>
                💭 "{userProfile.bio}"
              </div>
            )}
            <QuoteBanner>
              💫 Daily Inspiration: "{dailyQuote}"
            </QuoteBanner>
          </UserInfo>
        </HeaderContent>
      </Header>

      <TabContainer>
        <TabNav>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={16} />
            Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            <MessageCircle size={16} />
            Chat History
          </TabButton>
          <TabButton 
            active={activeTab === 'wellness'} 
            onClick={() => setActiveTab('wellness')}
          >
            <Heart size={16} />
            Wellness
          </TabButton>
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            Profile
          </TabButton>
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            Settings
          </TabButton>
        </TabNav>

        <TabContent>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'history' && renderChatHistory()}
          {activeTab === 'wellness' && renderWellness()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'settings' && renderSettings()}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  );
};

export default UserDashboard;
