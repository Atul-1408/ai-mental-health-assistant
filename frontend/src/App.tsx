import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LoginForm from './components/Auth/LoginForm';
import ModernDashboard from './components/Dashboard/ModernDashboard';
import ChatInterface from './components/Chat/ChatInterface';
import apiService from './services/api';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Global Styles
const GlobalStyle = createGlobalStyle<{ theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    overflow-x: hidden;
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.glassLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
    opacity: 0.5;
  }

  ::-webkit-scrollbar-thumb:hover {
    opacity: 0.7;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(ellipse at top, #1a1d29 0%, #0f1419 100%);
  color: white;
  font-size: 1.5rem;
  gap: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Navigation overlay for chat mode
const ChatNavOverlay = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: rgba(26, 29, 41, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

interface AppState {
  user: any;
  currentView: 'login' | 'dashboard' | 'chat';
  isLoading: boolean;
}

function ThemedApp() {
  const { theme } = useTheme();
  const [state, setState] = useState<AppState>({
    user: null,
    currentView: 'login',
    isLoading: true
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      if (apiService.isAuthenticated()) {
        const currentUser = apiService.getCurrentUser();
        setState({
          user: currentUser,
          currentView: 'dashboard',
          isLoading: false
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setState({
      user: userData,
      currentView: 'dashboard',
      isLoading: false
    });
  };

  const handleLogout = () => {
    apiService.logout();
    setState({
      user: null,
      currentView: 'login',
      isLoading: false
    });
  };

  const handleNavigateToChat = () => {
    setState(prev => ({ ...prev, currentView: 'chat' }));
  };

  const handleNavigateToDashboard = () => {
    setState(prev => ({ ...prev, currentView: 'dashboard' }));
  };

  if (state.isLoading) {
    return (
      <>
        <GlobalStyle theme={theme} />
        <LoadingContainer>
          <LoadingSpinner />
          <div>Loading MindChat...</div>
          <div style={{ fontSize: '1rem', opacity: 0.7 }}>Your AI Mental Health Companion</div>
        </LoadingContainer>
      </>
    );
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'login':
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return (
          <ModernDashboard 
            user={state.user} 
            onLogout={handleLogout}
            onNavigateToChat={handleNavigateToChat}
          />
        );
      case 'chat':
        return (
          <>
            <ChatNavOverlay>
              <NavButton onClick={handleNavigateToDashboard}>
                ← Back to Dashboard
              </NavButton>
              <NavButton onClick={handleLogout}>
                Logout
              </NavButton>
            </ChatNavOverlay>
            <ChatInterface user={state.user} />
          </>
        );
      default:
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <>
      <GlobalStyle theme={theme} />
      {renderCurrentView()}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
