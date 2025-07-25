
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast({ description: "Successfully signed in." });
    } catch (error: any) {
      console.error("Error signing in: ", error);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ description: "Successfully signed out." });
    } catch (error: any) {
       console.error("Error signing out: ", error);
       toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut: handleSignOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
