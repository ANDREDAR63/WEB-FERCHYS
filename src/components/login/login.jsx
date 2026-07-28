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

  const manejarEnvio = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', correo);
  };

  return (
    <section className="acceso-usuarios">
      {/* Opcional: Si en algún momento necesitas mostrar el logo aquí, puedes usarlo así: */}
      {/* <img src={obtenerImagen('logo')} alt="Logo Ferchys" className="login__logo" /> */}

      <h2>Ingresa a tu cuenta</h2>

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
          placeholder="************" 
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required 
        />

        {/* Botón para enviar los datos */}
        <button type="submit">Iniciar Sesión</button>
      </form>

      {/* Enlace para usuarios nuevos usando NavLink hacia el inicio o registro */}
      <p>
        ¿Aún no tienes una cuenta? <NavLink to="/registration">Regístrate aquí</NavLink>


      {/* Enlace para recuperar contraseña, si es necessario*/}  
      <p>
        ¿Olvidaste tu contraseña? <NavLink to="/recuperar-contraseña">Recuperala aquí </NavLink>

      </p>
      </p>
    </section>
  );
}