import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/lib/firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const adminStatus = await authService.isAdmin(firebaseUser.uid);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('ADMIN CHECK FAILED:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    return await authService.signUp(email, password, displayName);
  };

  const signIn = async (email: string, password: string) => {
    return await authService.signIn(email, password);
  };

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle();
  };

  const signOut = async () => {
    return await authService.signOut();
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  return {
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
};
