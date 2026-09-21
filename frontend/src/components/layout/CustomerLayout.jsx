import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import NavbarClient from '../navbar/NavbarClient';
import Footer from '../footer/footer';
import { useAuth } from '../../context/auth';
import './layout.css';

const CustomerLayout = () => {
  const { user } = useAuth();

  return (
    <div className="layout-container">
      {user?.role === 'client' ? <NavbarClient /> : <Navbar />}
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
