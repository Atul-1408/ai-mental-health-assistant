import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Settings, Bell, Shield, Palette, Globe, Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  ${css`animation: ${fadeIn} 0.6s ease-out;`}
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const SettingCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const SettingIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
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

const SettingTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SettingDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SettingControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SettingLabel = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const Toggle = styled.button<{ active: boolean }>`
  width: 50px;
  height: 26px;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #10b981, #34d399)'
    : 'rgba(255, 255, 255, 0.2)'
  };

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '26px' : '2px'};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SelectDropdown = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;

  option {
    background: #1a1d29;
    color: #ffffff;
  }
`;

interface SettingsViewProps {
  user: any;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      moodReminders: true,
      wellnessAlerts: false,
      weeklyReports: true,
      chatNotifications: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      profileVisibility: 'private' as 'public' | 'friends' | 'private'
    },
    appearance: {
      theme: theme.mode as 'light' | 'dark' | 'auto',
      animations: true,
      sounds: false
    },
    language: {
      locale: 'en-US',
      timezone: 'America/New_York'
    }
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('mindchatSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('mindchatSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    
    // Handle theme changes
    if (category === 'appearance' && key === 'theme') {
      if (value === 'light' || value === 'dark') {
        setTheme(value);
      }
    }
  };

  return (
    <SettingsContainer>
      <Title>Settings</Title>
      <SettingsGrid>
        <SettingCard>
          <SettingIcon color="blue">
            <Bell size={32} />
          </SettingIcon>
          <SettingTitle>Notifications</SettingTitle>
          <SettingDescription>
            Manage your notification preferences and reminders.
          </SettingDescription>
          <SettingControls>
            <SettingItem>
              <SettingLabel>Mood Reminders</SettingLabel>
              <Toggle 
                active={settings.notifications.moodReminders}
                onClick={() => updateSetting('notifications', 'moodReminders', !settings.notifications.moodReminders)}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Wellness Alerts</SettingLabel>
              <Toggle 
                active={settings.notifications.wellnessAlerts}
                onClick={() => updateSetting('notifications', 'wellnessAlerts', !settings.notifications.wellnessAlerts)}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Weekly Reports</SettingLabel>
              <Toggle 
                active={settings.notifications.weeklyReports}
                onClick={() => updateSetting('notifications', 'weeklyReports', !settings.notifications.weeklyReports)}
              />
            </SettingItem>
          </SettingControls>
        </SettingCard>

        <SettingCard>
          <SettingIcon color="green">
            <Shield size={32} />
          </SettingIcon>
          <SettingTitle>Privacy & Security</SettingTitle>
          <SettingDescription>
            Control your data privacy settings and security preferences for your mental health information.
          </SettingDescription>
        </SettingCard>

        <SettingCard>
          <SettingIcon color="purple">
            <Palette size={32} />
          </SettingIcon>
          <SettingTitle>Appearance</SettingTitle>
          <SettingDescription>
            Customize the app's visual appearance.
          </SettingDescription>
          <SettingControls>
            <SettingItem>
              <SettingLabel>Theme</SettingLabel>
              <SelectDropdown 
                value={settings.appearance.theme}
                onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </SelectDropdown>
            </SettingItem>
            <SettingItem>
              <SettingLabel>Animations</SettingLabel>
              <Toggle 
                active={settings.appearance.animations}
                onClick={() => updateSetting('appearance', 'animations', !settings.appearance.animations)}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Sound Effects</SettingLabel>
              <Toggle 
                active={settings.appearance.sounds}
                onClick={() => updateSetting('appearance', 'sounds', !settings.appearance.sounds)}
              />
            </SettingItem>
          </SettingControls>
        </SettingCard>

        <SettingCard>
          <SettingIcon color="orange">
            <Globe size={32} />
          </SettingIcon>
          <SettingTitle>Language & Region</SettingTitle>
          <SettingDescription>
            Set your preferred language, time zone, and regional settings for a personalized experience.
          </SettingDescription>
        </SettingCard>
      </SettingsGrid>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        color: 'rgba(255, 255, 255, 0.6)',
        fontStyle: 'italic'
      }}>
        Advanced settings configuration coming soon!
      </div>
    </SettingsContainer>
  );
};

export default SettingsView;
