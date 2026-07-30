import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './login.css';

// Usamos el mismo método de Vite que ya tienes en el Hero para gestionar imágenes de manera segura
const imagenes = import.meta.glob('../../assets/*', { eager: true });

const obtenerImagen = (nombreArchivo) => {
  const ruta = Object.keys(imagenes).find(key => key.includes(nombreArchivo));
  return ruta ? imagenes[ruta].default : '';
};

export default function Login() {
  // Estados para capturar los datos del formulario de manera profesional
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    setErrorMensaje('');

    // Expresión regular que valida:
    // - Al menos una minúscula (?=.*[a-z])
    // - Al menos una mayúscula (?=.*[A-Z])
    // - Al menos un número (?=.*\d)
    // - Al menos un carácter especial o símbolo (?=.*[@$!%*?&#._-])
    // - Mínimo 6 caracteres ({6,})
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{6,}$/;

    // Validación de seguridad de la contraseña al iniciar sesión
    if (!regexPassword.test(clave)) {
      setErrorMensaje('⚠️ La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial (como *, #, $, etc.).');
      return;
    }

    console.log('Iniciando sesión con:', correo);
  };

  return (
    <section className="acceso-usuarios">
      {/* Opcional: Si en algún momento necesitas mostrar el logo aquí, puedes usarlo así: */}
      {/* <img src={obtenerImagen('logo')} alt="Logo Ferchys" className="login__logo" /> */}

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
        {/* Campo para el correo electrónico */}
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

        {/* Campo para la contraseña */}
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

        {/* Botón para enviar los datos */}
        <button type="submit">Iniciar Sesión</button>
      </form>

      {/* Enlaces para usuarios nuevos y recuperación de contraseña ordenados correctamente */}
      <p style={{ marginTop: '1rem' }}>
        ¿Aún no tienes una cuenta? <NavLink to="/registration">Regístrate aquí</NavLink>
      </p>

      <p>
        ¿Olvidaste tu contraseña? <NavLink to="/recuperar-contraseña">Recuperala aquí</NavLink>
      </p>
    </section>
  );
}