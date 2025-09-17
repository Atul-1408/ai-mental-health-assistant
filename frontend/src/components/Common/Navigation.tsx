import React, { useState } from 'react';
import styled from 'styled-components';
import { MessageCircle, BarChart3, Settings, LogOut, Menu, X, Brain } from 'lucide-react';
import { User } from '../../types';

const NavContainer = styled.nav`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.2rem;
  color: #2d3748;
`;

const BrandIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e2e8f0;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

const NavLink = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? '#ebf8ff' : 'transparent'};
  color: ${props => props.active ? '#4299e1' : '#718096'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f7fafc;
    color: #4299e1;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #feb2b2;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #4299e1;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

interface NavigationProps {
  user: User;
  currentView: 'chat' | 'dashboard';
  onViewChange: (view: 'chat' | 'dashboard') => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  user, 
  currentView, 
  onViewChange, 
  onLogout 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewChange = (view: 'chat' | 'dashboard') => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <NavContainer>
      <NavContent>
        <NavBrand>
          <BrandIcon>
            <Brain size={20} />
          </BrandIcon>
          MindChat
        </NavBrand>

        <NavLinks isOpen={mobileMenuOpen}>
          <NavLink 
            active={currentView === 'chat'}
            onClick={() => handleViewChange('chat')}
          >
            <MessageCircle size={16} />
            Chat
          </NavLink>
          <NavLink 
            active={currentView === 'dashboard'}
            onClick={() => handleViewChange('dashboard')}
          >
            <BarChart3 size={16} />
            Dashboard
          </NavLink>
        </NavLinks>

        <UserSection>
          <UserInfo>
            <Avatar>
              {getUserInitials(user.name || user.username)}
            </Avatar>
            <UserName>{user.name || user.username}</UserName>
          </UserInfo>
          
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </LogoutButton>
          
          <MobileMenuButton 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuButton>
        </UserSection>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;
