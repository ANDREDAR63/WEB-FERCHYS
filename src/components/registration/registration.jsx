import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './registration.css'; // Reutilizamos los mismos estilos limpios de tu tarjeta

export default function Registration() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  // Estados para controlar los mensajes de alerta o éxito
  const [registradoExitoso, setRegistradoExitoso] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Base de datos simulada (ejemplo de correos que ya existen)
  const correosExistentes = ['ferchys@postres.com', 'admin@correo.com', 'cliente@prueba.com'];

  const manejarRegistro = (e) => {
    e.preventDefault();
    setErrorMensaje(''); // Limpiamos errores previos

    // 1. Validar si las contraseñas coinciden
    if (clave !== confirmarClave) {
      setErrorMensaje('⚠️ Las contraseñas no coinciden. Por favor, revísalas.');
      return;
    }

    // 2. Validar si el usuario ya se encuentra registrado
    if (correosExistentes.includes(correo.trim().toLowerCase())) {
      setErrorMensaje('⚠️ Este correo electrónico ya se encuentra registrado. Intenta iniciar sesión.');
      return;
    }

    // Si todo está correcto, procedemos con el registro exitoso
    console.log('Usuario registrado con éxito:', { nombre, correo, telefono, direccion });
    setRegistradoExitoso(true);
  };

  return (
    <section className="acceso-usuarios">
      {registradoExitoso ? (
        <div className="mensaje-exito" style={{ textAlign: 'center', background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 8px 25px rgba(128, 79, 93, 0.1)' }}>
          <h2 style={{ color: 'var(--color-primario)', marginBottom: '1rem' }}>¡Felicidades! 🎉</h2>
          <p>Te has registrado correctamente en Ferchy's Postres.</p>
          <p style={{ fontSize: '0.9rem', color: '#804F5D', marginTop: '0.5rem' }}>Ya puedes disfrutar de nuestros dulces momentos.</p>
          
          <NavLink to="/login" className="btn btn-primario" style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Iniciar Sesión
          </NavLink>
        </div>
      ) : (
        <>
          <h2>Crea tu cuenta en Ferchy's</h2>

          {/* Caja para mostrar alertas de error si ocurren */}
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

          <form onSubmit={manejarRegistro}>
            <label htmlFor="nombre">Nombre completo: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              placeholder="Tu nombre y apellido" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />

            <label htmlFor="telefono">Número de contacto: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="tel" 
              id="telefono" 
              name="telefono" 
              placeholder="Ej: 3001234567" 
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required 
            />

            <label htmlFor="direccion">Dirección de entrega: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              id="direccion" 
              name="direccion" 
              placeholder="Calle, número, barrio o apartamento" 
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required 
            />

            <label htmlFor="correo">Correo electrónico: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              placeholder="ejemplo@correo.com" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
            />

            <label htmlFor="clave">Contraseña: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="password" 
              id="clave" 
              name="clave" 
              placeholder="Mínimo 6 caracteres" 
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required 
            />

            <label htmlFor="confirmarClave">Confirmar contraseña: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="password" 
              id="confirmarClave" 
              name="confirmarClave" 
              placeholder="Repite tu contraseña" 
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
              required 
            />

            <button type="submit">Registrarse</button>
          </form>

          <p>
            ¿Ya tienes una cuenta? <NavLink to="/login">Inicia sesión aquí</NavLink>
          </p>
        </>
      )}
    </section>
  );
}