import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext();

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);   // true on first load
  const [authError, setAuthError]         = useState(null);
  const [authChecked, setAuthChecked]     = useState(false);

  // ── On mount: check if a valid session already exists ──────────────────────
  // We keep a JWT token in localStorage. On page refresh we ask the backend
  // "is this token still valid?" and get the user back.
  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const token = localStorage.getItem('dealert_token');

    if (!token) {
      // No token stored → definitely not logged in
      setIsAuthenticated(false);
      setUser(null);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }

    try {
      // Ask our own Next.js backend to verify the token
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);          // { id, username, email }
        setIsAuthenticated(true);
      } else {
        // Token expired or invalid
        localStorage.removeItem('dealert_token');
        setUser(null);
        setIsAuthenticated(false);

        if (res.status === 401) {
          setAuthError({ type: 'auth_required', message: 'Session expired. Please log in again.' });
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setAuthError({ type: 'unknown', message: 'Could not connect to server.' });
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  // ── Register ───────────────────────────────────────────────────────────────
  // Call this from your Register page.
  // Returns { success: true } or { success: false, message: '...' }
  const register = async ({ username, email, password }) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-login after successful registration
        localStorage.setItem('dealert_token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, message: 'Could not connect to server.' };
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  // Accepts either username or email + password.
  // Returns { success: true } or { success: false, message: '...' }
  const login = async ({ usernameOrEmail, password }) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('dealert_token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials.' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Could not connect to server.' };
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('dealert_token');
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
    setAuthError(null);
    // In Next.js, redirect to login page like this:
    window.location.href = '/login';
  };

  // ── Helper: get token for API calls ───────────────────────────────────────
  // Use this in any component that needs to call a protected API:
  //   const { getToken } = useAuth();
  //   fetch('/api/alerts', { headers: { Authorization: `Bearer ${getToken()}` } })
  const getToken = () => localStorage.getItem('dealert_token');

  return (
    <AuthContext.Provider
      value={{
        user,                  // { id, username, email } or null
        isAuthenticated,       // true / false
        isLoadingAuth,         // true while checking session on first load
        authError,             // { type, message } or null
        authChecked,           // true once the first auth check is done
        register,              // fn({ username, email, password })
        login,                 // fn({ usernameOrEmail, password })
        logout,                // fn()
        getToken,              // fn() → token string
        checkUserAuth,         // fn() — re-check session manually if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};