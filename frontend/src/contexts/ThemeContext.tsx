import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    glass: string;
    glassLight: string;
  };
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    surface: 'rgba(255, 255, 255, 0.9)',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#667eea',
    text: '#1a202c',
    textSecondary: 'rgba(26, 32, 44, 0.7)',
    border: 'rgba(26, 32, 44, 0.2)',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    glass: 'rgba(255, 255, 255, 0.25)',
    glassLight: 'rgba(255, 255, 255, 0.1)'
  }
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: 'radial-gradient(ellipse at top, #1a1d29 0%, #0f1419 100%)',
    surface: 'rgba(255, 255, 255, 0.05)',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#667eea',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassLight: 'rgba(255, 255, 255, 0.02)'
  }
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(darkTheme);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('mindchat-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme === 'light' ? lightTheme : darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme.mode === 'light' ? darkTheme : lightTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('mindchat-theme', newTheme.mode);
  };

  const setTheme = (mode: 'light' | 'dark') => {
    const newTheme = mode === 'light' ? lightTheme : darkTheme;
    setCurrentTheme(newTheme);
    localStorage.setItem('mindchat-theme', mode);
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { lightTheme, darkTheme };
