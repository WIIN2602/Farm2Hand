import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'farmer@farm2hand.com',
    name: 'นายสมชาย ใจดี',
    role: 'farmer',
    phone: '081-234-5678',
    location: 'จ.เชียงใหม่, อ.แม่ริม',
    farmName: 'สวนออร์แกนิคสมชาย',
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    email: 'customer@farm2hand.com',
    name: 'นางสาวมาลี สุขใจ',
    role: 'customer',
    phone: '082-345-6789',
    location: 'กรุงเทพมหานคร',
    isVerified: true,
    createdAt: new Date('2023-02-20'),
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('farm2hand_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('farm2hand_user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('ไม่พบผู้ใช้งานนี้ในระบบ');
      }

      // In a real app, you would verify the password here
      // For demo purposes, we'll accept any password
      if (credentials.password.length < 6) {
        throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      }

      // Store user data
      localStorage.setItem('farm2hand_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Validate data
      if (data.password !== data.confirmPassword) {
        throw new Error('รหัสผ่านไม่ตรงกัน');
      }

      if (data.password.length < 6) {
        throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      }

      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        location: data.location,
        farmName: data.farmName,
        isVerified: false,
        createdAt: new Date(),
        avatar: data.role === 'farmer' 
          ? 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
          : 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300'
      };

      // Add to mock users (in real app, this would be sent to server)
      mockUsers.push(newUser);

      // Store user data
      localStorage.setItem('farm2hand_user', JSON.stringify(newUser));
      dispatch({ type: 'AUTH_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('farm2hand_user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!state.user) return;

    dispatch({ type: 'AUTH_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...state.user, ...data };
      
      // Update in mock users array
      const userIndex = mockUsers.findIndex(u => u.id === state.user!.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }

      // Store updated user data
      localStorage.setItem('farm2hand_user', JSON.stringify(updatedUser));
      dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};