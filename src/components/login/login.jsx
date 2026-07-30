import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { correo, clave });
    navigate('/');
  };

  return (
    <section className="acceso-usuarios">
      <h2>Ingresa a tu cuenta</h2>

      <form onSubmit={manejarEnvio}>
        <label htmlFor="correo">Correo electrónico:</label>
        <input
          type="email"
          id="correo"
          name="correo"
          placeholder="ejemplo@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label htmlFor="clave">Contraseña:</label>
        <input
          type="password"
          id="clave"
          name="clave"
          placeholder="************"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        <button type="submit">Iniciar Sesión</button>
      </form>

      <p>
        ¿Aún no tienes una cuenta?{' '}
        <NavLink to="/registration">Regístrate aquí</NavLink>
      </p>

      <p>
        ¿Olvidaste tu contraseña?{' '}
        <NavLink to="/recuperar-contraseña">Recupérala aquí</NavLink>
      </p>
    </section>
  );
}