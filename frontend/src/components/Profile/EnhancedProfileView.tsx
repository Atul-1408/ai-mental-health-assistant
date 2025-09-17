import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User, Camera, Save, Edit3, MapPin, Calendar, Briefcase, Phone, Mail, Trophy, RefreshCw } from 'lucide-react';
import apiService from '../../services/api';

const ProfileContainer = styled.div`
  padding: 2rem;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${AvatarContainer}:hover & {
    opacity: 1;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProfileBio = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  
  svg {
    width: 16px;
    height: 16px;
    color: #667eea;
  }
`;

const EditSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px ${props => props.variant === 'secondary' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(102, 126, 234, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AvatarOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  max-width: 600px;
`;

const AvatarOption = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: scale(1.1);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  location: string;
  birthday: string;
  occupation: string;
  phone: string;
  email: string;
}

const EnhancedProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Demo User',
    bio: 'Mental wellness enthusiast exploring the journey of self-discovery',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo&backgroundColor=b6e3f4',
    location: 'San Francisco, CA',
    birthday: '1990-01-01',
    occupation: 'Software Developer',
    phone: '+1 (555) 123-4567',
    email: 'demo@mindchat.com'
  });
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveTab('view');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const backgrounds = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${randomBg}`;
    setProfileData(prev => ({ ...prev, avatar: newAvatar }));
  };

  const getPresetAvatars = () => {
    const seeds = ['felix', 'aneka', 'charlie', 'fluffy', 'max', 'princess', 'shadow', 'snuggles'];
    const backgrounds = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
    return seeds.map((seed, index) => 
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${backgrounds[index % backgrounds.length]}`
    );
  };

  const mockStats = {
    totalSessions: 45,
    streakDays: 7,
    totalMinutes: 1250,
    moodAverage: 7.2
  };

  const renderViewMode = () => (
    <>
      <ProfileHeader>
        <AvatarContainer onClick={() => setActiveTab('edit')}>
          <Avatar src={profileData.avatar} alt="Profile Avatar" />
          <AvatarOverlay>
            <Edit3 size={24} />
          </AvatarOverlay>
        </AvatarContainer>
        
        <ProfileInfo>
          <ProfileName>{profileData.name}</ProfileName>
          <ProfileBio>{profileData.bio}</ProfileBio>
          
          <InfoGrid>
            <InfoItem>
              <MapPin />
              <span>{profileData.location}</span>
            </InfoItem>
            <InfoItem>
              <Briefcase />
              <span>{profileData.occupation}</span>
            </InfoItem>
            <InfoItem>
              <Calendar />
              <span>Born {new Date(profileData.birthday).getFullYear()}</span>
            </InfoItem>
            <InfoItem>
              <Mail />
              <span>{profileData.email}</span>
            </InfoItem>
            <InfoItem>
              <Phone />
              <span>{profileData.phone}</span>
            </InfoItem>
          </InfoGrid>
          
          <Button onClick={() => setActiveTab('edit')}>
            <Edit3 size={16} />
            Edit Profile
          </Button>
        </ProfileInfo>
      </ProfileHeader>

      <EditSection>
        <h3 style={{ marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy color="#ffd700" />
          Wellness Statistics
        </h3>
        <StatsSection>
          <StatCard>
            <StatNumber>{mockStats.totalSessions}</StatNumber>
            <StatLabel>Total Sessions</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{mockStats.streakDays}</StatNumber>
            <StatLabel>Day Streak</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{mockStats.totalMinutes}</StatNumber>
            <StatLabel>Minutes</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{mockStats.moodAverage}/10</StatNumber>
            <StatLabel>Avg Mood</StatLabel>
          </StatCard>
        </StatsSection>
      </EditSection>
    </>
  );

  const renderEditMode = () => (
    <EditSection>
      <h3 style={{ marginBottom: '2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Edit3 />
        Edit Your Profile
      </h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <Label>Profile Avatar</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
          <AvatarContainer style={{ width: '100px', height: '100px' }}>
            <Avatar src={profileData.avatar} alt="Current Avatar" />
          </AvatarContainer>
          <div>
            <Button onClick={generateRandomAvatar} style={{ marginBottom: '0.5rem' }}>
              <RefreshCw size={16} />
              Random Avatar
            </Button>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              Click to generate a new random avatar
            </p>
          </div>
        </div>
        
        <Label>Or choose from presets:</Label>
        <AvatarOptionsGrid>
          {getPresetAvatars().map((avatarUrl, index) => (
            <AvatarOption 
              key={index} 
              onClick={() => setProfileData(prev => ({ ...prev, avatar: avatarUrl }))}
            >
              <img src={avatarUrl} alt={`Avatar option ${index + 1}`} />
            </AvatarOption>
          ))}
        </AvatarOptionsGrid>
      </div>
      
      <FormGrid>
        <FormGroup>
          <Label>Full Name</Label>
          <Input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Email Address</Label>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your phone"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter your location"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Occupation</Label>
          <Input
            type="text"
            value={profileData.occupation}
            onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
            placeholder="Enter your occupation"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Birthday</Label>
          <Input
            type="date"
            value={profileData.birthday}
            onChange={(e) => setProfileData(prev => ({ ...prev, birthday: e.target.value }))}
          />
        </FormGroup>
      </FormGrid>
      
      <FormGroup>
        <Label>Bio</Label>
        <TextArea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself and your wellness journey..."
        />
      </FormGroup>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Button onClick={handleSaveProfile} disabled={loading}>
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button 
          variant="secondary"
          onClick={() => setActiveTab('view')}
        >
          Cancel
        </Button>
      </div>
    </EditSection>
  );

  return (
    <ProfileContainer>
      <TabButtons>
        <TabButton 
          active={activeTab === 'view'} 
          onClick={() => setActiveTab('view')}
        >
          <User size={16} />
          View Profile
        </TabButton>
        <TabButton 
          active={activeTab === 'edit'} 
          onClick={() => setActiveTab('edit')}
        >
          <Edit3 size={16} />
          Edit Profile
        </TabButton>
      </TabButtons>
      
      {activeTab === 'view' ? renderViewMode() : renderEditMode()}
    </ProfileContainer>
  );
};

export default EnhancedProfileView;
