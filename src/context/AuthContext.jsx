import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  microsoftProvider,
  appleProvider,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from '../firebase';
import { updateProfile } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          photo: currentUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser({
        id: result.user.uid,
        name: name,
        email: result.user.email
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      setUser({
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      setUser({
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) return { success: false, message: 'No user is logged in.' };
    
    try {
      const userId = auth.currentUser.uid;
      // Note: In a real app, you'd call a Cloud Function to delete user data from Firestore/Database
      // Here we still clear local data for consistency with previous logic
      localStorage.removeItem(`trackit-expenses-${userId}`);
      localStorage.removeItem(`trackit-recurring-${userId}`);
      
      await auth.currentUser.delete();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, signup, signin, signInWithGoogle, signInWithMicrosoft, signInWithApple, logout, deleteAccount, isAuthenticated: !!user, loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
