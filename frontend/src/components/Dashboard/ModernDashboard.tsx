import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Home, MessageSquare, BarChart3, Heart, BookOpen, Leaf,
  User, Settings, LogOut, TrendingUp, Calendar,
  Shield, MessageCircle, CheckCircle, Wind, Bell,
  ChevronRight, Activity, Brain, Zap
} from 'lucide-react';

// Import all view components
import HomeView from './HomeView';
import MoodTrackerView from './MoodTrackerView';
import JournalsView from './JournalsView';
import WellnessView from './WellnessView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';

// Animations
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(118, 75, 162, 0.5); }
  50% { box-shadow: 0 0 40px rgba(118, 75, 162, 0.8), 0 0 60px rgba(118, 75, 162, 0.4); }
  100% { box-shadow: 0 0 20px rgba(118, 75, 162, 0.5); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Main Dashboard Container
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(ellipse at top, #1a1d29 0%, #0f1419 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(45, 212, 191, 0.05) 0%,
      rgba(102, 126, 234, 0.08) 40%,
      transparent 70%
    );
    ${css`animation: ${float} 20s ease-in-out infinite;`}
    z-index: 0;
  }
`;

// Sidebar Navigation
const Sidebar = styled.div`
  width: 280px;
  background: rgba(26, 29, 41, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const Logo = styled.div`
  padding: 0 2rem;
  margin-bottom: 3rem;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    padding: 0 1rem;
    font-size: 1.2rem;
  }
`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 1rem 2rem;
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  margin: 0.25rem 1rem;
  border-radius: 12px;
  font-weight: 500;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  border-left: ${props => props.active ? '4px solid #667eea' : '4px solid transparent'};

  &:hover {
    background: rgba(102, 126, 234, 0.15);
    color: #ffffff;
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    justify-content: center;
    
    span {
      display: none;
    }
  }
`;

// Main Content Area
const MainContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 5;
`;

// Top Bar
const TopBar = styled.div`
  background: rgba(26, 29, 41, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Greeting = styled.div`
  color: #ffffff;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-style: italic;
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
  }
`;

// Dashboard Content
const DashboardContent = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  ${css`animation: ${slideIn} 0.6s ease-out;`}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatsCard = styled.div<{ color: string }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.color) {
        case 'green': return 'linear-gradient(90deg, #10b981, #34d399)';
        case 'blue': return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        case 'orange': return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        case 'purple': return 'linear-gradient(90deg, #8b5cf6, #a78bfa)';
        default: return 'linear-gradient(90deg, #667eea, #764ba2)';
      }
    }};
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const StatsIcon = styled.div<{ color: string }>`
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
      case 'orange': return 'rgba(245, 158, 11, 0.2)';
      case 'purple': return 'rgba(139, 92, 246, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'green': return '#10b981';
      case 'blue': return '#3b82f6';
      case 'orange': return '#f59e0b';
      case 'purple': return '#8b5cf6';
      default: return '#667eea';
    }
  }};
`;

const StatsValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const StatsLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
`;

const StatsChange = styled.div<{ positive?: boolean }>`
  color: ${props => props.positive ? '#10b981' : '#ff6b6b'};
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Quick Actions Panel
const QuickActions = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div<{ color: string; pulse?: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.pulse && css`animation: ${pulseGlow} 3s ease-in-out infinite;`}

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => {
      switch (props.color) {
        case 'blue': return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        case 'green': return 'linear-gradient(90deg, #10b981, #34d399)';
        case 'purple': return 'linear-gradient(90deg, #8b5cf6, #a78bfa)';
        default: return 'linear-gradient(90deg, #667eea, #764ba2)';
      }
    }};
  }
`;

const ActionIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${props => {
    switch (props.color) {
      case 'blue': return 'rgba(59, 130, 246, 0.2)';
      case 'green': return 'rgba(16, 185, 129, 0.2)';
      case 'purple': return 'rgba(139, 92, 246, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'purple': return '#8b5cf6';
      default: return '#667eea';
    }
  }};
`;

const ActionTitle = styled.h4`
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ActionDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

// Analytics Section
const AnalyticsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
`;

const ChartTitle = styled.h4`
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MockChart = styled.div`
  height: 300px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  border: 2px dashed rgba(102, 126, 234, 0.3);
`;

// Alert Box
const AlertBox = styled.div`
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const AlertIcon = styled.div`
  color: #f59e0b;
  flex-shrink: 0;
`;

const AlertContent = styled.div`
  color: #ffffff;
  
  h5 {
    margin: 0 0 0.5rem 0;
    color: #f59e0b;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }
`;

interface ModernDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigateToChat?: () => void;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ user, onLogout, onNavigateToChat }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dailyQuotes = [
    "Your mental health is a priority. Your happiness is essential.",
    "Progress, not perfection, is what we should strive for.",
    "It's okay to not be okay. What matters is that you're here.",
    "Small steps every day lead to big changes over time.",
    "You are stronger than you think and braver than you believe."
  ];

  const todayQuote = dailyQuotes[currentTime.getDate() % dailyQuotes.length];

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'mood', icon: Heart, label: 'Mood Tracker' },
    { id: 'journals', icon: BookOpen, label: 'Journals' },
    { id: 'wellness', icon: Leaf, label: 'Wellness' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderMainContent = () => {
    switch (activeNav) {
      case 'home':
        return <HomeView user={user} onNavigateToChat={onNavigateToChat} />;
      case 'chat':
        if (onNavigateToChat) {
          onNavigateToChat();
        }
        return (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            <p>Redirecting to chat...</p>
          </div>
        );
      case 'mood':
        return <MoodTrackerView user={user} />;
      case 'journals':
        return <JournalsView user={user} />;
      case 'wellness':
        return <WellnessView user={user} />;
      case 'profile':
        return <ProfileView user={user} />;
      case 'settings':
        return <SettingsView user={user} />;
      case 'dashboard':
      default:
        return (
          <DashboardContent>
            {/* Alert Box */}
            <AlertBox>
              <AlertIcon>
                <Bell size={20} />
              </AlertIcon>
              <AlertContent>
                <h5>Mood Monitoring Alert</h5>
                <p>We noticed some changes in your mood patterns. Consider scheduling a check-in with your wellness routine.</p>
              </AlertContent>
            </AlertBox>

            {/* Stats Grid */}
            <StatsGrid>
              <StatsCard color="green">
                <StatsIcon color="green">
                  <MessageSquare size={24} />
                </StatsIcon>
                <StatsValue>24</StatsValue>
                <StatsLabel>Total Conversations</StatsLabel>
                <StatsChange positive>
                  <TrendingUp size={14} />
                  +12% this week
                </StatsChange>
              </StatsCard>

              <StatsCard color="blue">
                <StatsIcon color="blue">
                  <Activity size={24} />
                </StatsIcon>
                <StatsValue>7.8</StatsValue>
                <StatsLabel>Average Mood Score</StatsLabel>
                <StatsChange positive>
                  <TrendingUp size={14} />
                  +0.5 this month
                </StatsChange>
              </StatsCard>

              <StatsCard color="orange">
                <StatsIcon color="orange">
                  <Calendar size={24} />
                </StatsIcon>
                <StatsValue>18</StatsValue>
                <StatsLabel>Mood Check-ins</StatsLabel>
                <StatsChange>
                  <ChevronRight size={14} />
                  3 this week
                </StatsChange>
              </StatsCard>

              <StatsCard color="purple">
                <StatsIcon color="purple">
                  <Shield size={24} />
                </StatsIcon>
                <StatsValue>Safe</StatsValue>
                <StatsLabel>Safety & Support</StatsLabel>
                <StatsChange positive>
                  <CheckCircle size={14} />
                  All systems active
                </StatsChange>
              </StatsCard>
            </StatsGrid>

            {/* Quick Actions */}
            <QuickActions>
              <SectionTitle>
                <Zap size={20} />
                Quick Actions
              </SectionTitle>
              <ActionsGrid>
                <ActionCard color="blue" onClick={onNavigateToChat}>
                  <ActionIcon color="blue">
                    <MessageCircle size={24} />
                  </ActionIcon>
                  <ActionTitle>Start New Chat</ActionTitle>
                  <ActionDescription>Begin a conversation with your AI companion for support and guidance.</ActionDescription>
                </ActionCard>

                <ActionCard color="green" onClick={() => setActiveNav('mood')}>
                  <ActionIcon color="green">
                    <Heart size={24} />
                  </ActionIcon>
                  <ActionTitle>Mood Check-In</ActionTitle>
                  <ActionDescription>Track how you're feeling today and get personalized insights.</ActionDescription>
                </ActionCard>

                <ActionCard color="purple" pulse onClick={() => setActiveNav('wellness')}>
                  <ActionIcon color="purple">
                    <Wind size={24} />
                  </ActionIcon>
                  <ActionTitle>Breathing Exercise</ActionTitle>
                  <ActionDescription>Take a moment to center yourself with guided breathing techniques.</ActionDescription>
                </ActionCard>
              </ActionsGrid>
            </QuickActions>

            {/* Analytics Section */}
            <SectionTitle>
              <Brain size={20} />
              Wellness Analytics
            </SectionTitle>
            <AnalyticsSection>
              <ChartCard>
                <ChartTitle>
                  <TrendingUp size={18} />
                  Mood Tracking Over Time
                </ChartTitle>
                <MockChart>
                  📊 Interactive Mood Chart Coming Soon
                </MockChart>
              </ChartCard>

              <ChartCard>
                <ChartTitle>
                  <Activity size={18} />
                  Stress Factors Analysis
                </ChartTitle>
                <MockChart>
                  🥧 Pie Chart Analysis
                </MockChart>
              </ChartCard>
            </AnalyticsSection>
          </DashboardContent>
        );
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>MindChat</Logo>
        {navItems.map(item => (
          <NavItem
            key={item.id}
            active={activeNav === item.id}
            onClick={() => setActiveNav(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavItem>
        ))}
      </Sidebar>

      <MainContent>
        <TopBar>
          <Greeting>
            <h2>{getGreeting()}, {user?.name || 'Friend'}!</h2>
            <p>✨ {todayQuote}</p>
          </Greeting>
          <TopBarActions>
            <Bell size={20} color="rgba(255, 255, 255, 0.7)" style={{ cursor: 'pointer' }} />
            <ProfileAvatar>
              {user?.name?.charAt(0) || 'U'}
            </ProfileAvatar>
            <LogoutButton onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </LogoutButton>
          </TopBarActions>
        </TopBar>

        {renderMainContent()}
      </MainContent>
    </DashboardContainer>
  );
};

export default ModernDashboard;
