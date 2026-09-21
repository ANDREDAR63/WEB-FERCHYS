import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ferchys-user') || 'null'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('ferchys-token')));

  useEffect(() => {
    if (!localStorage.getItem('ferchys-token')) return;
    apiRequest('/me')
      .then((currentUser) => {
        setUser(currentUser);
        localStorage.setItem('ferchys-user', JSON.stringify(currentUser));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const result = await apiRequest('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('ferchys-token', result.token);
    localStorage.setItem('ferchys-user', JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  }

  async function register(data) {
    const result = await apiRequest('/register', { method: 'POST', body: JSON.stringify(data) });
    return result.user;
  }

  async function logout() {
    if (localStorage.getItem('ferchys-token')) {
      await apiRequest('/logout', { method: 'POST' }).catch(() => null);
    }
    localStorage.removeItem('ferchys-token');
    localStorage.removeItem('ferchys-user');
    setUser(null);
  }

  function clearSession() {
    localStorage.removeItem('ferchys-token');
    localStorage.removeItem('ferchys-user');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, clearSession }}>{children}</AuthContext.Provider>;
}