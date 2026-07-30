import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './DashboardCocinero.css';

const DashboardCocinero = () => {
    const [perfil] = useState({ name: 'Juan Pérez', email: 'juan.perez@example.com' });

    const [pedidos, setPedidos] = useState([
        { id: 1234, descripcion: 'Pedido #1234', status: 'Pendiente' },
        { id: 1235, descripcion: 'Pedido #1235', status: 'Listo para entregar' },
        { id: 1236, descripcion: 'Pedido #1236', status: 'Entregado' },
    ]);

    const handlePreparar = (id) => {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: 'En preparación' } : p));
    };

    const handleMarcarListo = (id) => {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: 'Listo para entregar' } : p));
    };

    return (
        <div className="dashboard-cocinero">    
            <aside className="dashboard-cocinero__sidebar">
                <div className="dashboard-cocinero__logo">
                    <h2>Ferchy's</h2>
                </div>
                <nav className="dashboard-cocinero__nav">
                    <ul>
                        <li>
                            <NavLink to="/dashboard-cocinero" className="dashboard-cocinero__nav-link">Inicio</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/perfil" className="dashboard-cocinero__nav-link">Perfil</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/pedidos" className="dashboard-cocinero__nav-link">Pedidos</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/inventario" className="dashboard-cocinero__nav-link">Inventario</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/estadisticas" className="dashboard-cocinero__nav-link">Estadísticas</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/recetas" className="dashboard-cocinero__nav-link">Recetas</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/configuracion" className="dashboard-cocinero__nav-link">Configuración</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard-cocinero/cerrar-sesion" className="dashboard-cocinero__nav-link">Cerrar sesión</NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-cocinero__content">
                <header className="dashboard-cocinero__header">
                    <h2>Panel de Control</h2>
                </header>

                <section className="dashboard-cocinero__welcome">
                    <h1>Dashboard del Cocinero</h1>
                    <p>Bienvenido al panel de control del cocinero.</p>
                </section>

                <section className="perfil">
                    <h2>Perfil del Cocinero</h2>
                    <p>Nombre: {perfil.name}</p>
                    <p>Email: {perfil.email}</p>
                </section>

                <section className="pedidos">
                    <h2>Pedidos Recientes</h2>
                    <ul>
                        {pedidos.map(p => (
                            <li key={p.id}>
                                {p.descripcion} - Estado: {p.status}
                                <div className="botones">
                                    <button
                                        className="btn-preparar"
                                        onClick={() => handlePreparar(p.id)}
                                        disabled={p.status === 'En preparación' || p.status === 'Entregado'}
                                    >
                                        Preparar
                                    </button>
                                    <button
                                        className="btn-listo"
                                        onClick={() => handleMarcarListo(p.id)}
                                        disabled={p.status === 'Listo para entregar' || p.status === 'Entregado'}
                                    >
                                        Marcar como listo
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="inventario">
                    <h2>Inventario</h2>
                    <ul>
                        <li>Azúcar - 15 kg</li>
                        <li>Chocolate - 10 kg</li>
                        <li>Frutas - 5 kg</li>
                        <li>Crema de leche - 5 litros</li>
                        <li>Gelatina sin sabor - 5 kg</li>
                        <li>Envases para postres - 100 unidades</li>
                    </ul>
                </section>

                <section className="estadisticas">
                    <h2>Estadísticas</h2>
                    <p>Pedidos completados este mes: 120</p>
                    <p>Pedidos pendientes: 5</p>
                    <p>Valoración promedio de los clientes: 4.8/5</p>
                    <ul>
                        <li>Postre más vendido: Cheesecake de frutos rojos</li>
                        <li>Postre menos vendido: Tarta de limón</li>
                    </ul>
                </section>

                <section className="recetas">
                    <h2>Recetas</h2>
                    <ul>
                        <li>Cheesecake de frutos rojos</li>
                        <li>Tarta de limón</li>
                        <li>Brownie de chocolate</li>
                    </ul>
                </section>

                <section className="configuracion">
                    <h2>Configuración</h2>
                    <p>Aquí puedes ajustar tus preferencias y configuraciones del panel de control.</p>
                </section>

                <section className="cerrar-sesion">
                    <h2>Cerrar sesión</h2>
                    <p>¿Estás seguro de que deseas cerrar sesión?</p>
                    <button className="btn-cerrar-sesion">Cerrar sesión</button>
                </section>
            </main>
        </div>
    );
};

export default DashboardCocinero;


