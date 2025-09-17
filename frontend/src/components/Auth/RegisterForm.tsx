import React, { useState } from 'react';
import styled from 'styled-components';
import { Lock, User, Mail, Eye, EyeOff } from 'lucide-react';
import { UserRegister } from '../../types';
import apiService from '../../services/api';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2d3748;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  &:invalid {
    border-color: #e53e3e;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: #a0aec0;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #4a5568;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 1rem;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #4299e1;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem 0;
  text-align: center;
  
  &:hover {
    color: #3182ce;
  }
`;

const PasswordRequirements = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.5rem;
`;

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<UserRegister>({
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await apiService.register(formData);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>Create Account</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Full Name (Optional)</Label>
          <InputWrapper>
            <InputIcon>
              <User size={18} />
            </InputIcon>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </InputWrapper>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="username">Username</Label>
          <InputWrapper>
            <InputIcon>
              <User size={18} />
            </InputIcon>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </InputWrapper>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputWrapper>
            <InputIcon>
              <Mail size={18} />
            </InputIcon>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </InputWrapper>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <InputWrapper>
            <InputIcon>
              <Lock size={18} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </InputWrapper>
          <PasswordRequirements>
            Password must be at least 6 characters long
          </PasswordRequirements>
        </InputGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </SubmitButton>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <span style={{ color: '#718096' }}>Already have an account? </span>
        <LinkButton onClick={onSwitchToLogin}>
          Sign In
        </LinkButton>
      </div>
    </FormContainer>
  );
};

export default RegisterForm;
