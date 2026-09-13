import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault();
    setErrorMensaje('');

    // Expresión regular que valida los requisitos de seguridad de la contraseña
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{6,}$/;

    // Validación de seguridad de la contraseña al iniciar sesión
    if (!regexPassword.test(clave)) {
      setErrorMensaje('⚠️ La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial (como *, #, $, etc.).');
      return;
    }

    console.log('Iniciando sesión con:', { correo, clave });
    navigate('/');
  };

  return (
    <section className="acceso-usuarios">
      <h2>Ingresa a tu cuenta</h2>

      {errorMensaje && (
        <div style={{ 
          backgroundColor: '#ffe6ed', 
          color: '#804F5D', 
          padding: '0.8rem 1rem', 
          borderRadius: '12px', 
          marginBottom: '1rem', 
          fontSize: '0.9rem',
          border: '1px solid var(--color-primario)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '420px'
        }}>
          {errorMensaje}
        </div>
      )}

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
          placeholder="Mínimo 6 caracteres (mayúscula, minúscula, número y símbolo)"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        <button type="submit">Iniciar Sesión</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
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