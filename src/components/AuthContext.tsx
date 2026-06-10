import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | { email: string, uid?: string } | null;
  loading: boolean;
  loginWithEmailOtp: (email: string) => void;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  loginWithEmailOtp: () => {},
  setAuthToken: () => {},
  logout: () => {} 
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<{ email: string, uid?: string } | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(localStorage.getItem('website_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for custom user
    const savedUser = localStorage.getItem('custom_auth_email');
    if (savedUser) {
      setCustomUser({ email: savedUser, uid: 'custom-' + savedUser });
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // We will store the firebase user regardless, but only EXPOSE it later if sessionToken is present
      setFirebaseUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem('website_token', token);
    setSessionToken(token);
    if (auth.currentUser) {
      setFirebaseUser(auth.currentUser);
    }
  };

  const loginWithEmailOtp = (email: string) => {
    localStorage.setItem('custom_auth_email', email);
    setCustomUser({ email, uid: 'custom-' + email });
    setSessionToken(localStorage.getItem('website_token'));
  };

  const logout = async () => {
    localStorage.removeItem('custom_auth_email');
    localStorage.removeItem('website_token');
    setSessionToken(null);
    setCustomUser(null);
    setFirebaseUser(null);
    if (firebaseUser || auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Only consider active if they have the token
  const hasWebsiteToken = !!sessionToken;
  const activeUser = hasWebsiteToken ? (customUser || firebaseUser) : null;

  return (
    <AuthContext.Provider value={{ user: activeUser, loading, loginWithEmailOtp, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
