import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Sign Up with Email
  async signUp(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: null,
        favorites: [],
        cart: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      return { success: true, user };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign In with Email
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Update last login
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign In with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          favorites: [],
          cart: [],
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } else {
        // Update last login
        await setDoc(
          doc(db, 'users', user.uid),
          {
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      }

      return { success: true, user };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign Out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get Current User
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Auth State Observer
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Password Reset
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update User Email
  async updateUserEmail(newEmail: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateEmail(user, newEmail);
      await setDoc(
        doc(db, 'users', user.uid),
        { email: newEmail },
        { merge: true }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Update email error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update User Password
  async updateUserPassword(newPassword: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', userId));
      return adminDoc.exists();
    } catch (error) {
      console.error('Check admin error:', error);
      return false;
    }
  },
};
