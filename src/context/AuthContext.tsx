import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (token: string, userId: string) => void; // הוספת userId כפרמטר
  logout: () => void;
  userId: string | null; // שמירת userId בקונטקסט
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // שחזור מצב התחברות מ-localStorage
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId'); // שחזור userId
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const login = (token: string, userId: string) => {
    localStorage.setItem('token', token); // שמירת ה-JWT ב-localStorage
    localStorage.setItem('userId', userId); // שמירת ה-userId ב-localStorage
    setIsLoggedIn(true);
    setUserId(userId); // עדכון userId בקונטקסט
  };

  const logout = () => {
    localStorage.removeItem('token'); // מחיקת ה-JWT
    localStorage.removeItem('userId'); // מחיקת ה-userId
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
