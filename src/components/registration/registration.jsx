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

  const [registradoExitoso, setRegistradoExitoso] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Base de datos simulada
  const correosExistentes = ['ferchys@postres.com', 'admin@correo.com', 'cliente@prueba.com'];

  // Validación estricta solo para números en el teléfono
  const handleTelefonoChange = (e) => {
    const soloNumeros = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter que no sea número
    setTelefono(soloNumeros);
  };

  // Validación para permitir solo letras y espacios en el nombre
  const handleNombreChange = (e) => {
    const soloLetras = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNombre(soloLetras);
  };

  const manejarRegistro = (e) => {
    e.preventDefault();
    setErrorMensaje('');

    // Validación de longitud mínima de contraseña
    if (clave.length < 6) {
      setErrorMensaje('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Validar si las contraseñas coinciden
    if (clave !== confirmarClave) {
      setErrorMensaje('⚠️ Las contraseñas no coinciden. Por favor, revísalas.');
      return;
    }

    // Validar si el usuario ya se encuentra registrado
    if (correosExistentes.includes(correo.trim().toLowerCase())) {
      setErrorMensaje('⚠️ Este correo electrónico ya se encuentra registrado. Intenta iniciar sesión.');
      return;
    }

    // Registro exitoso
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
              onChange={handleNombreChange}
              required 
            />

            <label htmlFor="telefono">Número de contacto: <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              id="telefono" 
              name="telefono" 
              placeholder="Ej: 3001234567" 
              value={telefono}
              onChange={handleTelefonoChange} // Restringe a solo números automáticamente
              maxLength={10} // Límite estándar de dígitos
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