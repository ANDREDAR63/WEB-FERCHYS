import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './registration.css';

const correosExistentes = ['ferchys@postres.com', 'admin@correo.com', 'cliente@prueba.com'];

export default function Registration() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    correo: '',
    clave: '',
    confirmarClave: '',
  });
  const [registradoExitoso, setRegistradoExitoso] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');

  // Base de datos simulada
  const correosExistentes = ['ferchys@postres.com', 'admin@correo.com', 'cliente@prueba.com'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
      return;
    }

    if (name === 'nombre') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarRegistro = (e) => {
    e.preventDefault();
    setErrorMensaje('');

    const { nombre, telefono, direccion, correo, clave, confirmarClave } = formData;

    // Expresión regular para validar seguridad de la contraseña
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{6,}$/;

    const validaciones = [
      {
        condicion: !nombre.trim() || !telefono.trim() || !direccion.trim() || !correo.trim() || !clave.trim() || !confirmarClave.trim(),
        mensaje: 'Todos los campos son obligatorios.',
      },
      {
        condicion: !regexPassword.test(clave),
        mensaje: '⚠️ La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial (como *, #, $, etc.).',
      },
      {
        condicion: clave !== confirmarClave,
        mensaje: 'Las contraseñas no coinciden. Por favor, revísalas.',
      },
      {
        condicion: correosExistentes.includes(correo.trim().toLowerCase()),
        mensaje: 'Este correo electrónico ya se encuentra registrado. Intenta iniciar sesión.',
      },
    ];

    const error = validaciones.find((item) => item.condicion);

    if (error) {
      setErrorMensaje(error.mensaje);
      return;
    }

    console.log('Usuario registrado con éxito:', { nombre, correo, telefono, direccion });
    setRegistradoExitoso(true);
  };

  return (
    <section className="acceso-usuarios">
      {registradoExitoso ? (
        <div className="mensaje-exito">
          <h2>¡Felicidades!</h2>
          <p>Te has registrado correctamente en Ferchy's Postres.</p>
          <p className="mensaje-exito__texto">Ya puedes disfrutar de nuestros dulces momentos.</p>

          <NavLink to="/login" className="btn btn-primario">
            Iniciar Sesión
          </NavLink>
        </div>
      ) : (
        <>
          <h2>Crea tu cuenta en Ferchy's</h2>

          {errorMensaje && <div className="mensaje-error">{errorMensaje}</div>}

          <form onSubmit={manejarRegistro}>
            <label htmlFor="nombre">
              Nombre completo: <span className="campo-obligatorio">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre y apellido"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <label htmlFor="telefono">
              Número de contacto: <span className="campo-obligatorio">*</span>
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              placeholder="Ej: 3001234567"
              value={formData.telefono}
              onChange={handleChange}
              maxLength={10}
              required
            />

            <label htmlFor="direccion">
              Dirección de entrega: <span className="campo-obligatorio">*</span>
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              placeholder="Calle, número, barrio o apartamento"
              value={formData.direccion}
              onChange={handleChange}
              required
            />

            <label htmlFor="correo">
              Correo electrónico: <span className="campo-obligatorio">*</span>
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={handleChange}
              required
            />

            <label htmlFor="clave">
              Contraseña: <span className="campo-obligatorio">*</span>
            </label>
            <input
              type="password"
              id="clave"
              name="clave"
              placeholder="Mínimo 6 caracteres (mayúscula, minúscula, número y símbolo)"
              value={formData.clave}
              onChange={handleChange}
              required
            />

            <label htmlFor="confirmarClave">
              Confirmar contraseña: <span className="campo-obligatorio">*</span>
            </label>
            <input
              type="password"
              id="confirmarClave"
              name="confirmarClave"
              placeholder="Repite tu contraseña"
              value={formData.confirmarClave}
              onChange={handleChange}
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