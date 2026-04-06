
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

// ============================================
// CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google Provider
const googleProvider = new GoogleAuthProvider();

// ============================================
// PROVIDER
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email || 'No user');

      if (firebaseUser) {
        setUser(firebaseUser);

        // Check if admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // ============================================
  // SIGN UP
  // ============================================
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Creating account for:', email);

      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      console.log('User created in Firebase Auth:', firebaseUser.uid);

      // 2. Update display name
      await updateProfile(firebaseUser, { displayName });

      // 3. Save user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName,
        photoURL: null,
        favorites: [],
        cart: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      console.log('User saved to Firestore successfully');

      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);

      // Return user-friendly error messages
      let errorMessage = 'Failed to create account';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection';
          break;
        default:
          errorMessage = error.message || 'Failed to create account';
      }

      return { success: false, error: errorMessage };
    }
  };

  // ============================================
  // SIGN IN
  // ============================================
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Signing in:', email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update last login in Firestore
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLogin: serverTimestamp() },
        { merge: true }
      );

      console.log('Sign in successful');
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);

      let errorMessage = 'Failed to sign in';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Try again later';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection';
          break;
        default:
          errorMessage = error.message || 'Failed to sign in';
      }

      return { success: false, error: errorMessage };
    }
  };

  // ============================================
  // SIGN IN WITH GOOGLE
  // ============================================
  const signInWithGoogle = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      console.log('Signing in with Google...');

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      console.log('Google sign in successful:', firebaseUser.email);

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (!userDoc.exists()) {
        // New user - create Firestore document
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          favorites: [],
          cart: [],
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
        console.log('New Google user saved to Firestore');
      } else {
        // Existing user - update last login
        await setDoc(
          doc(db, 'users', firebaseUser.uid),
          { lastLogin: serverTimestamp() },
          { merge: true }
        );
        console.log('Existing Google user updated');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Google sign in error:', error);

      let errorMessage = 'Failed to sign in with Google';

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked. Allow popups for this site';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your connection';
          break;
        default:
          errorMessage = error.message || 'Failed to sign in with Google';
      }

      return { success: false, error: errorMessage };
    }
  };

  // ============================================
  // SIGN OUT
  // ============================================
  const signOut = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await firebaseSignOut(auth);
      console.log('Sign out successful');
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // RESET PASSWORD
  // ============================================
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
