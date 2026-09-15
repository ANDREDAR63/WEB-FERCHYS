import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import '../dashboard/dashboard.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const manejarCierreSesion = async () => {
    await logout();
    navigate('/');
  };

  return (
    <main className="dashboard-layout">
      <button type="button" className="dashboard-logout" onClick={manejarCierreSesion}>
        Cerrar sesión
      </button>
      <Outlet />
    </main>
  );
};

export default DashboardLayout;
