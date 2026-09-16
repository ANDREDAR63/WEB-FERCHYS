import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function RoleRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="dashboard-loading">Cargando sesión...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}