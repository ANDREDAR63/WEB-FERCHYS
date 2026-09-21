import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/layout/CustomerLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Hero from './components/hero/hero';
import Catalogo from './components/catalogo/catalogo';
import About from './components/about/about';
import Contacto from './components/contacto/contacto';
import Login from './components/login/login';
import Registration from './components/registration/registration';
import PasswordRecovery from './components/passwordrecovery/passwordrecovery';
import ShoppingCart from './components/shopping_cart/shopping_cart';
import RoleRoute from './routes/RoleRoute';
import { AdminDashboard } from './components/dashboard/Dashboard';
import ClienteDashboard from './components/dashboard/ClienteDashboard';
import CookDashboard from './components/dashboard/CookDashboard';
import CourierDashboard from './components/dashboard/CourierDashboard';

function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Hero />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/PasswordRecovery" element={<PasswordRecovery />} />
        <Route path="/recuperar-contraseña" element={<PasswordRecovery />} />
        <Route path="/carrito" element={<ShoppingCart />} />
        <Route element={<RoleRoute roles={['client']} />}>
          <Route path="/dashboard/cliente" element={<ClienteDashboard />} />
        </Route>
      </Route>

      <Route element={<DashboardLayout />}>
        <Route element={<RoleRoute roles={['admin']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<RoleRoute roles={['cook']} />}>
          <Route path="/dashboard/cocinero" element={<CookDashboard />} />
        </Route>
        <Route element={<RoleRoute roles={['courier']} />}>
          <Route path="/dashboard/repartidor" element={<CourierDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
