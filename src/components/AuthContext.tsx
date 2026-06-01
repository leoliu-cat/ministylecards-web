import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | { email: string, uid?: string } | null;
  loading: boolean;
  loginWithEmailOtp: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  loginWithEmailOtp: () => {}, 
  logout: () => {} 
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<{ email: string, uid?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for custom user
    const savedUser = localStorage.getItem('custom_auth_email');
    if (savedUser) {
      setCustomUser({ email: savedUser, uid: 'custom-' + savedUser });
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmailOtp = (email: string) => {
    localStorage.setItem('custom_auth_email', email);
    setCustomUser({ email, uid: 'custom-' + email });
  };

  const logout = async () => {
    localStorage.removeItem('custom_auth_email');
    setCustomUser(null);
    if (firebaseUser) {
      await signOut(auth);
    }
  };

  const activeUser = customUser || firebaseUser; // Priority to custom if both exist (though unlikely)

  return (
    <AuthContext.Provider value={{ user: activeUser, loading, loginWithEmailOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
