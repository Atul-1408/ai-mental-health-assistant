import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Eye, EyeOff, Lock, User, Home, Info, FileText, Phone, UserPlus } from 'lucide-react';
import apiService from '../../services/api';

// Animations
const waveAnimation = keyframes`
  0% { transform: translateX(-100%) translateY(0px); }
  50% { transform: translateX(-50%) translateY(-20px); }
  100% { transform: translateX(0%) translateY(0px); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(102, 126, 234, 0.3); }
  100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
`;

const floatingAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Background Container
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at top, #1a1d29 0%, #0f1419 100%);
  position: relative;
  overflow: hidden;

  // Animated background waves
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(102, 126, 234, 0.1) 0%,
      rgba(118, 75, 162, 0.15) 25%,
      rgba(45, 212, 191, 0.1) 50%,
      rgba(102, 126, 234, 0.1) 75%,
      rgba(118, 75, 162, 0.1) 100%
    );
    ${css`animation: ${waveAnimation} 20s ease-in-out infinite;`}
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: -30%;
    right: -50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(
      circle,
      rgba(45, 212, 191, 0.08) 0%,
      rgba(102, 126, 234, 0.12) 40%,
      transparent 70%
    );
    ${css`animation: ${waveAnimation} 25s ease-in-out infinite reverse;`}
    z-index: 0;
  }
`;

// Top Navigation
const TopNavigation = styled.nav`
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(26, 29, 41, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #ffffff;
    background: rgba(102, 126, 234, 0.2);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
  }
`;

// Main Content
const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 5;
`;

// Glassmorphism Login Card
const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 420px;
  text-align: center;
  ${css`animation: ${floatingAnimation} 6s ease-in-out infinite;`}
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

const WelcomeText = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  font-weight: 400;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 1rem;
  color: #ffffff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.8);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2), 0 0 30px rgba(102, 126, 234, 0.3);
    ${css`animation: ${glowPulse} 2s ease-in-out infinite;`}
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.1) inset;
    -webkit-text-fill-color: #ffffff !important;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 2;

  ${Label} ~ & {
    top: calc(50% + 1rem);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  z-index: 2;
  transition: all 0.3s ease;
  
  ${Label} ~ & {
    top: calc(50% + 1rem);
  }

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4), 0 0 40px rgba(118, 75, 162, 0.3);
    ${css`animation: ${glowPulse} 2s ease-in-out infinite;`}

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.a`
  color: rgba(102, 126, 234, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 1.5rem;
  display: inline-block;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  background: rgba(81, 207, 102, 0.15);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #51cf66;
  border: 1px solid rgba(81, 207, 102, 0.3);
`;

interface LoginFormProps {
  onLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.login({
        username: formData.username,
        password: formData.password
      });

      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onLoginSuccess(response.data.user);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <TopNavigation>
        <Logo>MindChat</Logo>
        <NavLinks>
          <NavLink href="#">
            <Home size={16} />
            Home
          </NavLink>
          <NavLink href="#">
            <Info size={16} />
            About
          </NavLink>
          <NavLink href="#">
            <FileText size={16} />
            Features
          </NavLink>
          <NavLink href="#">
            <Phone size={16} />
            Contact
          </NavLink>
          <NavLink href="#">
            <UserPlus size={16} />
            Sign Up
          </NavLink>
        </NavLinks>
      </TopNavigation>

      <MainContent>
        <LoginCard>
          <WelcomeText>
            <Title>Welcome to MindChat</Title>
            <Subtitle>Your AI Mental Health Companion</Subtitle>
          </WelcomeText>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="username">Username</Label>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputGroup>

            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </LoginButton>
          </Form>
          
          <ForgotPassword href="#">
            Forgot Password?
          </ForgotPassword>
        </LoginCard>
      </MainContent>
    </LoginContainer>
  );
};

export default LoginForm;
