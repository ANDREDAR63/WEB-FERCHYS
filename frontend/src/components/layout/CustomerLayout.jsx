import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';
import './layout.css';

const CustomerLayout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
