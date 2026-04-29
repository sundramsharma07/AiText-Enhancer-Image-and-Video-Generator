import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const USER_KEY = 'pen_ai_user';
const TOKEN_KEY = 'pen_ai_token';

export const AuthProvider = ({ children }) => {
  // Load from localStorage immediately — no network needed on page refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // If we already have user data from localStorage, loading is false immediately
  const [loading, setLoading] = useState(() => {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    const hasUser = !!localStorage.getItem(USER_KEY);
    // Only need to show loading spinner if token exists but user data is missing
    return hasToken && !hasUser;
  });

  useEffect(() => {
    // Only do the network call if we have a token but no cached user
    if (token && !user) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
            localStorage.setItem(USER_KEY, JSON.stringify(data));
          } else {
            // Token expired or invalid — clean up
            logout();
          }
        } catch (error) {
          console.error("Auth Error:", error);
          logout();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []); // Run only once on mount

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    // Cache both user and token so next load is instant
    localStorage.setItem(TOKEN_KEY, userToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Keep backward compat: also remove old 'token' key if present
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
