import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  X, Save, User, Mail, Phone, MapPin, Calendar, 
  Camera, Edit3, Check, AlertCircle
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const ProfileModal = styled.div`
  background: rgba(26, 29, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  max-width: 600px;
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

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(102, 126, 234, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 1);
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
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
  box-sizing: border-box;

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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${props => props.variant === 'primary' 
    ? 'transparent'
    : 'rgba(255, 255, 255, 0.2)'
  };
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background: ${props => props.variant === 'primary' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.15)'
    };
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

interface ProfileEditorProps {
  show: boolean;
  onClose: () => void;
  user: any;
  onSave: (userData: any) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ show, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    occupation: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        occupation: user.occupation || ''
      });
    }
  }, [user, show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...formData };
      onSave(updatedUser);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <ModalOverlay show={show}>
      <ProfileModal>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <Header>
          <Title>Edit Profile</Title>
        </Header>

        {showSuccess && (
          <SuccessMessage>
            <Check size={20} />
            Profile updated successfully!
          </SuccessMessage>
        )}

        <AvatarSection>
          <AvatarContainer>
            <Avatar>
              {formData.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
              <AvatarUpload type="button">
                <Camera size={16} />
              </AvatarUpload>
            </Avatar>
          </AvatarContainer>
        </AvatarSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <User size={16} />
              Full Name
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Mail size={16} />
              Email Address
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Edit3 size={16} />
              Bio
            </Label>
            <TextArea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Phone size={16} />
              Phone Number
            </Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <MapPin size={16} />
              Location
            </Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Calendar size={16} />
              Occupation
            </Label>
            <Input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              placeholder="Enter your occupation"
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </ButtonGroup>
        </Form>
      </ProfileModal>
    </ModalOverlay>
  );
};

export default ProfileEditor;
