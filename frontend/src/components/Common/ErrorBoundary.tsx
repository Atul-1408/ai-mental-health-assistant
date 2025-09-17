import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem auto;
  color: #e53e3e;
`;

const ErrorTitle = styled.h1`
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #718096;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ErrorDetails = styled.details`
  text-align: left;
  background: #f7fafc;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  
  summary {
    cursor: pointer;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }
  
  pre {
    color: #e53e3e;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
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

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to your error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle size={32} />
            </ErrorIcon>
            
            <ErrorTitle>Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We're sorry, but something unexpected happened. This error has been logged 
              and we'll look into it. Please try refreshing the page or go back to the homepage.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Error Details (Development)</summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </ErrorDetails>
            )}

            <ButtonGroup>
              <ActionButton variant="primary" onClick={this.handleReload}>
                <RefreshCw size={16} />
                Reload Page
              </ActionButton>
              <ActionButton variant="secondary" onClick={this.handleGoHome}>
                <Home size={16} />
                Go Home
              </ActionButton>
            </ButtonGroup>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
