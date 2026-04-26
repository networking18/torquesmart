import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'operador';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Modo demo: restaurar usuario mock
      const mockUser = {
        id: '1',
        nombre: 'Usuario Demo',
        email: 'demo@torquesmart.com',
        rol: 'admin' as const
      };
      setUser(mockUser);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Para desarrollo, permitir login con cualquier email/password
      if (email && password) {
        const mockUser = {
          id: '1',
          nombre: 'Usuario Demo',
          email: email,
          rol: 'admin' as const
        };
        
        localStorage.setItem('token', 'mock-token');
        setUser(mockUser);
        console.log('Login exitoso (modo demo)');
      } else {
        throw new Error('Email y password son requeridos');
      }
    } catch (error: any) {
      const message = error.message || 'Error al iniciar sesión';
      console.error('Error de login:', message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
