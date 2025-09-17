import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { User, Mail, Phone, MapPin, Calendar, Edit3 } from 'lucide-react';
import ProfileEditor from '../Profile/ProfileEditor';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProfileContainer = styled.div`
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

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
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
  margin: 0 auto 2rem;
`;

const UserName = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

interface ProfileViewProps {
  user: any;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  const handleSave = (updatedUser: any) => {
    setLocalUser(updatedUser);
    // Persist to localStorage for demo
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <ProfileContainer>
      <Title>My Profile</Title>
      <ProfileCard>
        <Avatar>{localUser?.name?.charAt(0) || 'U'}</Avatar>
        <UserName>{localUser?.name || 'User'}</UserName>
        <UserEmail>{localUser?.email || 'user@example.com'}</UserEmail>
        <button 
          onClick={() => setShowEditor(true)}
          style={{
            marginTop: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Edit Profile
        </button>
      </ProfileCard>

      <ProfileEditor 
        show={showEditor} 
        onClose={() => setShowEditor(false)} 
        user={localUser} 
        onSave={handleSave} 
      />
    </ProfileContainer>
  );
};

export default ProfileView;
