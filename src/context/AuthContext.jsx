import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trackit-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('trackit-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('trackit-user');
    }
  }, [user]);

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('trackit-users') || '[]');
    const exists = users.find(u => u.email === email);
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = { id: Date.now().toString(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('trackit-users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  };

  const signin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('trackit-users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, message: 'Invalid email or password.' };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const deleteAccount = () => {
    if (!user) return { success: false, message: 'No user is logged in.' };
    
    const userId = user.id;
    const users = JSON.parse(localStorage.getItem('trackit-users') || '[]');
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('trackit-users', JSON.stringify(filteredUsers));
    
    // Clear user-specific data
    localStorage.removeItem(`trackit-expenses-${userId}`);
    localStorage.removeItem(`trackit-recurring-${userId}`);
    
    setUser(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, logout, deleteAccount, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
