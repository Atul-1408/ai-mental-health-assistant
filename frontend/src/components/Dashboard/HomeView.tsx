import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Sun, Moon, Coffee, Heart, TrendingUp, MessageSquare, 
  BookOpen, Calendar, Clock, Award, Target, Smile,
  Activity, Zap, Wind, Brain, CheckCircle, Plus
} from 'lucide-react';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 25px rgba(102, 126, 234, 0.8), 0 0 35px rgba(102, 126, 234, 0.6); }
  100% { box-shadow: 0 0 10px rgba(102, 126, 234, 0.4); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Main Container
const HomeContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  ${css`animation: ${fadeIn} 0.6s ease-out;`}
`;

const WelcomeSection = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
    ${css`animation: ${pulse} 8s ease-in-out infinite;`}
  }
`;

const WelcomeTitle = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const TimeGreeting = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

// Stats Overview
const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  overflow: hidden;

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
        case 'orange': return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        default: return 'linear-gradient(90deg, #667eea, #764ba2)';
      }
    }};
    border-radius: 16px 16px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), ${props => {
      switch (props.color) {
        case 'blue': return '0 0 30px rgba(59, 130, 246, 0.5)';
        case 'green': return '0 0 30px rgba(16, 185, 129, 0.5)';
        case 'purple': return '0 0 30px rgba(139, 92, 246, 0.5)';
        case 'orange': return '0 0 30px rgba(245, 158, 11, 0.5)';
        default: return '0 0 30px rgba(102, 126, 234, 0.5)';
      }
    }};
    border-color: ${props => {
      switch (props.color) {
        case 'blue': return 'rgba(59, 130, 246, 0.6)';
        case 'green': return 'rgba(16, 185, 129, 0.6)';
        case 'purple': return 'rgba(139, 92, 246, 0.6)';
        case 'orange': return 'rgba(245, 158, 11, 0.6)';
        default: return 'rgba(102, 126, 234, 0.6)';
      }
    }};
    
    &::after {
      left: 100%;
    }
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  background: ${props => {
    switch (props.color) {
      case 'blue': return 'rgba(59, 130, 246, 0.2)';
      case 'green': return 'rgba(16, 185, 129, 0.2)';
      case 'purple': return 'rgba(139, 92, 246, 0.2)';
      case 'orange': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'purple': return '#8b5cf6';
      case 'orange': return '#f59e0b';
      default: return '#667eea';
    }
  }};

  ${StatCard}:hover & {
    transform: scale(1.1);
    box-shadow: ${props => {
      switch (props.color) {
        case 'blue': return '0 0 20px rgba(59, 130, 246, 0.6)';
        case 'green': return '0 0 20px rgba(16, 185, 129, 0.6)';
        case 'purple': return '0 0 20px rgba(139, 92, 246, 0.6)';
        case 'orange': return '0 0 20px rgba(245, 158, 11, 0.6)';
        default: return '0 0 20px rgba(102, 126, 234, 0.6)';
      }
    }};
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

// Recent Activity
const RecentActivity = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled.div`
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

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ActivityIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.color) {
      case 'blue': return 'rgba(59, 130, 246, 0.2)';
      case 'green': return 'rgba(16, 185, 129, 0.2)';
      case 'purple': return 'rgba(139, 92, 246, 0.2)';
      case 'orange': return 'rgba(245, 158, 11, 0.2)';
      default: return 'rgba(102, 126, 234, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'blue': return '#3b82f6';
      case 'green': return '#10b981';
      case 'purple': return '#8b5cf6';
      case 'orange': return '#f59e0b';
      default: return '#667eea';
    }
  }};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
`;

// Quick Goals
const GoalsSection = styled.div`
  margin-bottom: 3rem;
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const GoalCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`;

const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const GoalTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
`;

const GoalProgress = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const GoalProgressBar = styled.div<{ progress: number; color: string }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${props => {
    switch (props.color) {
      case 'green': return 'linear-gradient(90deg, #10b981, #34d399)';
      case 'blue': return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
      case 'purple': return 'linear-gradient(90deg, #8b5cf6, #a78bfa)';
      default: return 'linear-gradient(90deg, #667eea, #764ba2)';
    }
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const GoalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

// Quick Actions Section
const QuickActionsSection = styled.div`
  margin: 3rem 0;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const QuickActionCard = styled.div<{ color: string }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

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
    border-radius: 20px 20px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), ${props => {
      switch (props.color) {
        case 'blue': return '0 0 25px rgba(59, 130, 246, 0.4)';
        case 'green': return '0 0 25px rgba(16, 185, 129, 0.4)';
        case 'purple': return '0 0 25px rgba(139, 92, 246, 0.4)';
        default: return '0 0 25px rgba(102, 126, 234, 0.4)';
      }
    }};
    border-color: ${props => {
      switch (props.color) {
        case 'blue': return 'rgba(59, 130, 246, 0.5)';
        case 'green': return 'rgba(16, 185, 129, 0.5)';
        case 'purple': return 'rgba(139, 92, 246, 0.5)';
        default: return 'rgba(102, 126, 234, 0.5)';
      }
    }};
    
    &::after {
      left: 100%;
    }
  }
`;

const QuickActionIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
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

  ${QuickActionCard}:hover & {
    transform: scale(1.1);
    box-shadow: ${props => {
      switch (props.color) {
        case 'blue': return '0 0 25px rgba(59, 130, 246, 0.6)';
        case 'green': return '0 0 25px rgba(16, 185, 129, 0.6)';
        case 'purple': return '0 0 25px rgba(139, 92, 246, 0.6)';
        default: return '0 0 25px rgba(102, 126, 234, 0.6)';
      }
    }};
  }
`;

const QuickActionTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const QuickActionDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  font-size: 0.95rem;
`;

// Analytics Section (Coming Soon)
const AnalyticsSection = styled.div`
  margin: 3rem 0;
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AnalyticsCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.4);
    
    &::after {
      left: 100%;
    }
  }
`;

const ComingSoonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
`;

const ComingSoonIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ComingSoonText = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-weight: 500;
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

interface HomeViewProps {
  user: any;
  onNavigateToChat?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, onNavigateToChat }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun };
    if (hour < 21) return { text: 'Good Evening', icon: Moon };
    return { text: 'Good Night', icon: Moon };
  };

  const greeting = getTimeGreeting();
  const GreetingIcon = greeting.icon;

  const recentActivities = [
    { title: 'Completed mood check-in', time: '2 hours ago', icon: Heart, color: 'green' },
    { title: 'Had a chat session', time: '5 hours ago', icon: MessageSquare, color: 'blue' },
    { title: 'Wrote in journal', time: '1 day ago', icon: BookOpen, color: 'purple' },
    { title: 'Finished breathing exercise', time: '2 days ago', icon: Wind, color: 'orange' },
  ];

  const goals = [
    { title: 'Weekly Mood Tracking', progress: 71, target: '7 days', current: '5 days', color: 'green' },
    { title: 'Daily Journaling', progress: 60, target: '7 entries', current: '4 entries', color: 'blue' },
    { title: 'Mindfulness Sessions', progress: 40, target: '10 sessions', current: '4 sessions', color: 'purple' },
  ];

  return (
    <HomeContainer>
      <WelcomeSection>
        <WelcomeCard>
          <WelcomeTitle>{greeting.text}, {user?.name || 'Friend'}!</WelcomeTitle>
          <WelcomeSubtitle>
            Welcome back to your mental wellness journey. Today is a new opportunity to take care of yourself and grow stronger.
          </WelcomeSubtitle>
          <TimeGreeting>
            <GreetingIcon size={20} />
            <span>{currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <Clock size={16} />
            <span>{currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </TimeGreeting>
        </WelcomeCard>
      </WelcomeSection>

      <StatsOverview>
        <StatCard color="green">
          <StatIcon color="green">
            <MessageSquare size={24} />
          </StatIcon>
          <StatValue>24</StatValue>
          <StatLabel>Total Conversations</StatLabel>
          <StatChange positive={true}>
            <TrendingUp size={12} />
            +15% this week
          </StatChange>
        </StatCard>

        <StatCard color="blue">
          <StatIcon color="blue">
            <TrendingUp size={24} />
          </StatIcon>
          <StatValue>7.8</StatValue>
          <StatLabel>Average Mood Score</StatLabel>
          <StatChange positive={false}>
            <TrendingUp size={12} style={{ transform: 'rotate(180deg)' }} />
            -0.5 this month
          </StatChange>
        </StatCard>

        <StatCard color="orange">
          <StatIcon color="orange">
            <Heart size={24} />
          </StatIcon>
          <StatValue>18</StatValue>
          <StatLabel>Mood Check-ins</StatLabel>
          <StatChange positive={true}>
            <TrendingUp size={12} />
            3 this week
          </StatChange>
        </StatCard>

        <StatCard color="purple">
          <StatIcon color="purple">
            <CheckCircle size={24} />
          </StatIcon>
          <StatValue>Safe</StatValue>
          <StatLabel>Safety & Support</StatLabel>
          <StatChange positive={true}>
            <CheckCircle size={12} />
            All systems active
          </StatChange>
        </StatCard>
      </StatsOverview>

      <RecentActivity>
        <ActivityCard>
          <SectionTitle>
            <Clock size={20} />
            Recent Activity
          </SectionTitle>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon color={activity.color}>
                <activity.icon size={20} />
              </ActivityIcon>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityCard>

        <ActivityCard>
          <SectionTitle>
            <Brain size={20} />
            Today's Insight
          </SectionTitle>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            lineHeight: '1.6', 
            fontSize: '1rem',
            textAlign: 'center',
            padding: '1rem 0'
          }}>
            <Smile size={32} style={{ margin: '0 auto 1rem', display: 'block', color: '#10b981' }} />
            "Your mental health journey is unique to you. Celebrate small victories and be patient with yourself."
          </div>
        </ActivityCard>
      </RecentActivity>

      <QuickActionsSection>
        <SectionTitle>
          <Zap size={20} />
          Quick Actions
        </SectionTitle>
        <QuickActionsGrid>
          <QuickActionCard color="blue" onClick={onNavigateToChat}>
            <QuickActionIcon color="blue">
              <MessageSquare size={28} />
            </QuickActionIcon>
            <QuickActionTitle>Start New Chat</QuickActionTitle>
            <QuickActionDescription>
              Begin a conversation with your AI companion for support and guidance.
            </QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard color="green">
            <QuickActionIcon color="green">
              <Heart size={28} />
            </QuickActionIcon>
            <QuickActionTitle>Mood Check-In</QuickActionTitle>
            <QuickActionDescription>
              Track how you're feeling today and get personalized insights.
            </QuickActionDescription>
          </QuickActionCard>

          <QuickActionCard color="purple">
            <QuickActionIcon color="purple">
              <Wind size={28} />
            </QuickActionIcon>
            <QuickActionTitle>Breathing Exercise</QuickActionTitle>
            <QuickActionDescription>
              Take a moment to center yourself with guided breathing techniques.
            </QuickActionDescription>
          </QuickActionCard>
        </QuickActionsGrid>
      </QuickActionsSection>

      <AnalyticsSection>
        <SectionTitle>
          <Activity size={20} />
          Wellness Analytics
        </SectionTitle>
        <AnalyticsGrid>
          <AnalyticsCard>
            <SectionTitle style={{ marginBottom: '1rem' }}>
              <TrendingUp size={20} />
              Mood Tracking Over Time
            </SectionTitle>
            <ComingSoonContainer>
              <ComingSoonIcon>📈</ComingSoonIcon>
              <ComingSoonText>Interactive Mood Chart Coming Soon</ComingSoonText>
            </ComingSoonContainer>
          </AnalyticsCard>

          <AnalyticsCard>
            <SectionTitle style={{ marginBottom: '1rem' }}>
              <Target size={20} />
              Stress Factors Analysis
            </SectionTitle>
            <ComingSoonContainer>
              <ComingSoonIcon>🥧</ComingSoonIcon>
              <ComingSoonText>Pie Chart Analysis</ComingSoonText>
            </ComingSoonContainer>
          </AnalyticsCard>
        </AnalyticsGrid>
      </AnalyticsSection>
    </HomeContainer>
  );
};

export default HomeView;
