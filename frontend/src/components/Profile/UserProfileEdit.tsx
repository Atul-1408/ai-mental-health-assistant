import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { 
  User as UserIcon, Save, Upload, Camera, Mail, Phone, MapPin, 
  Calendar, Briefcase, Heart, Edit2, X, Check,
  Shield, Bell, Palette, Globe
} from 'lucide-react';
import { User } from '../../types';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const AvatarSection = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
`;

const AvatarImage = styled.div<{ backgroundImage?: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.backgroundImage 
    ? `url(${props.backgroundImage}) center/cover` 
    : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #4299e1;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3182ce;
    transform: scale(1.1);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileTitle = styled.h1`
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 2rem;
`;

const ProfileSubtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    background: white;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    background: white;
  }
`;

const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    background: white;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f7fafc;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #4299e1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(66, 153, 225, 0.4);
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }
  `}
`;

const AvatarOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const AvatarOption = styled.button<{ active?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: ${props => props.active ? '3px solid #4299e1' : '2px solid #e2e8f0'};
  background: ${props => props.color || 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'};
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    border-color: #4299e1;
  }
`;

interface UserProfileEditProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
  onCancel: () => void;
}

const UserProfileEdit: React.FC<UserProfileEditProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    username: user.username || '',
    bio: user.bio || '',
    phone: user.phone || '',
    location: user.location || '',
    birthday: user.birthday || '',
    occupation: user.occupation || '',
    avatar: user.avatar || '',
    notifications: {
      email: user.notifications?.email ?? true,
      push: user.notifications?.push ?? true,
      sms: user.notifications?.sms ?? false,
      weekly_summary: user.notifications?.weekly_summary ?? true,
    },
    privacy: {
      profile_visibility: user.privacy?.profile_visibility || 'friends',
      show_online_status: user.privacy?.show_online_status ?? true,
      allow_messages: user.privacy?.allow_messages ?? true,
    },
    preferences: {
      theme: user.preferences?.theme || 'light',
      language: user.preferences?.language || 'en',
      timezone: user.preferences?.timezone || 'UTC',
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          avatar: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (color: string, initials: string) => {
    setFormData(prev => ({
      ...prev,
      avatar: `${color}:${initials}`
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const presetAvatars = [
    { color: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)', name: 'Blue' },
    { color: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', name: 'Green' },
    { color: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', name: 'Orange' },
    { color: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', name: 'Purple' },
    { color: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)', name: 'Red' },
    { color: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)', name: 'Teal' },
  ];

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarSection>
          <AvatarImage backgroundImage={formData.avatar.startsWith('http') || formData.avatar.startsWith('data:') ? formData.avatar : undefined}>
            {!formData.avatar.startsWith('http') && !formData.avatar.startsWith('data:') && getUserInitials(formData.name || 'User')}
          </AvatarImage>
          <AvatarUpload onClick={() => fileInputRef.current?.click()}>
            <Camera size={16} />
          </AvatarUpload>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </AvatarSection>
        <ProfileTitle>Edit Your Profile</ProfileTitle>
        <ProfileSubtitle>Update your information and preferences</ProfileSubtitle>
        
        <AvatarOptions>
          {presetAvatars.map((preset, index) => (
            <AvatarOption
              key={index}
              color={preset.color}
              active={formData.avatar.includes(preset.name.toLowerCase())}
              onClick={() => handleAvatarSelect(preset.color, getUserInitials(formData.name || 'User'))}
            >
              {getUserInitials(formData.name || 'User')}
            </AvatarOption>
          ))}
        </AvatarOptions>
      </ProfileHeader>

      <FormSection>
        <SectionTitle>
          <UserIcon size={24} />
          Personal Information
        </SectionTitle>
        <FormGrid>
          <InputGroup>
            <Label><UserIcon size={16} />Full Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </InputGroup>
          <InputGroup>
            <Label><Mail size={16} />Email Address</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </InputGroup>
          <InputGroup>
            <Label><UserIcon size={16} />Username</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
            />
          </InputGroup>
          <InputGroup>
            <Label><Phone size={16} />Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </InputGroup>
          <InputGroup>
            <Label><MapPin size={16} />Location</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where are you located?"
            />
          </InputGroup>
          <InputGroup>
            <Label><Calendar size={16} />Birthday</Label>
            <Input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup>
            <Label><Briefcase size={16} />Occupation</Label>
            <Input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              placeholder="What do you do?"
            />
          </InputGroup>
        </FormGrid>
        <InputGroup style={{ marginTop: '1.5rem' }}>
          <Label><Heart size={16} />Bio</Label>
          <TextArea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us a bit about yourself..."
          />
        </InputGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>
          <Bell size={24} />
          Notification Preferences
        </SectionTitle>
        <CheckboxGroup>
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleInputChange}
            />
            <span>Email notifications for important updates</span>
          </CheckboxItem>
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              name="notifications.push"
              checked={formData.notifications.push}
              onChange={handleInputChange}
            />
            <span>Push notifications on this device</span>
          </CheckboxItem>
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              name="notifications.sms"
              checked={formData.notifications.sms}
              onChange={handleInputChange}
            />
            <span>SMS notifications for critical alerts</span>
          </CheckboxItem>
          <CheckboxItem>
            <Checkbox
              type="checkbox"
              name="notifications.weekly_summary"
              checked={formData.notifications.weekly_summary}
              onChange={handleInputChange}
            />
            <span>Weekly progress summary</span>
          </CheckboxItem>
        </CheckboxGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>
          <Shield size={24} />
          Privacy Settings
        </SectionTitle>
        <FormGrid>
          <InputGroup>
            <Label>Profile Visibility</Label>
            <Select
              name="privacy.profile_visibility"
              value={formData.privacy.profile_visibility}
              onChange={handleInputChange}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </Select>
          </InputGroup>
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="privacy.show_online_status"
                checked={formData.privacy.show_online_status}
                onChange={handleInputChange}
              />
              <span>Show when I'm online</span>
            </CheckboxItem>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="privacy.allow_messages"
                checked={formData.privacy.allow_messages}
                onChange={handleInputChange}
              />
              <span>Allow messages from other users</span>
            </CheckboxItem>
          </CheckboxGroup>
        </FormGrid>
      </FormSection>

      <FormSection>
        <SectionTitle>
          <Palette size={24} />
          Preferences
        </SectionTitle>
        <FormGrid>
          <InputGroup>
            <Label>Theme</Label>
            <Select
              name="preferences.theme"
              value={formData.preferences.theme}
              onChange={handleInputChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label><Globe size={16} />Language</Label>
            <Select
              name="preferences.language"
              value={formData.preferences.language}
              onChange={handleInputChange}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Timezone</Label>
            <Select
              name="preferences.timezone"
              value={formData.preferences.timezone}
              onChange={handleInputChange}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">GMT</option>
              <option value="Europe/Paris">CET</option>
              <option value="Asia/Tokyo">JST</option>
            </Select>
          </InputGroup>
        </FormGrid>
      </FormSection>

      <ButtonGroup>
        <Button variant="secondary" onClick={onCancel}>
          <X size={16} />
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <Save size={16} />
          Save Changes
        </Button>
      </ButtonGroup>
    </ProfileContainer>
  );
};

export default UserProfileEdit;
