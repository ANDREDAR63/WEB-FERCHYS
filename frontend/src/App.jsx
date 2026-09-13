import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';
import Hero from './components/hero/hero';
import Catalogo from './components/catalogo/catalogo';
import About from './components/about/about';
import Contacto from './components/contacto/contacto';
import Login from './components/login/login';
import Registration from './components/registration/registration';
import PasswordRecovery from './components/passwordrecovery/passwordrecovery';
import ShoppingCart from './components/shopping_cart/shopping_cart';
import RoleRoute from './routes/RoleRoute';
import { AdminDashboard, OrdersDashboard } from './components/dashboard/Dashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/PasswordRecovery" element={<PasswordRecovery />} />
        <Route path="/recuperar-contraseña" element={<PasswordRecovery />} />
        <Route path="/carrito" element={<ShoppingCart />} />
        <Route element={<RoleRoute roles={['admin']} />}><Route path="/dashboard/admin" element={<AdminDashboard />} /></Route>
        <Route element={<RoleRoute roles={['cook']} />}><Route path="/dashboard/cocinero" element={<OrdersDashboard mode="cook" />} /></Route>
        <Route element={<RoleRoute roles={['courier']} />}><Route path="/dashboard/repartidor" element={<OrdersDashboard mode="courier" />} /></Route>
      </Routes>
    </Layout>
  );
}

export default App;
