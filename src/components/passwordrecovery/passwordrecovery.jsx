import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './passwordrecovery.css';

import postre1 from '../../assets/cheesecake_arandano.png';
import postre2 from '../../assets/cheesecake_baileys.png';
import postre3 from '../../assets/cheesecake_chocolate.png';

export default function PasswordRecovery() {
  const [correo, setCorreo] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);

  const imagenes = [postre1, postre2, postre3];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagenActual((prev) => (prev + 1) % imagenes.length);
    }, 3500);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  const correosExistentes = ['ferchys@postres.com', 'admin@correo.com', 'cliente@prueba.com'];

  const manejarRecuperacion = (e) => {
    e.preventDefault();
    setErrorMensaje('');

    if (!correosExistentes.includes(correo.trim().toLowerCase())) {
      setErrorMensaje('⚠️ No encontramos ninguna cuenta asociada a este correo electrónico.');
      return;
    }

    setCorreoEnviado(true);
  };

  return (
    <div className="recuperar-pagina-container" >
      
      <div 
        className="recuperar-card">
        
        {/* COLUMNA IZQUIERDA: CARRUSEL */}
        <div className="recuperar-carrusel">
          {imagenes.map ((img, index) => (
            <div
              key={index}
              className={`carrusel-slide ${index === imagenActual ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="carrusel-dots">
            {imagenes.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === imagenActual ? 'active' : ''}`}
                onClick={() => setImagenActual(index)}
              />
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="recuperar-contenido">
          {correoEnviado ? (
            <div className="mensaje-exito">
              <h2>¡Revisa tu bandeja! 📩</h2>
              <p>Hemos enviado un enlace de recuperación a <strong>{correo}</strong>.</p>
              <p className="texto-secundario">
                Sigue las instrucciones del correo para restablecer tu contraseña.
              </p>

              <div className="isla-spam">
                <span className="isla-icon">💡</span>
                <strong>¿No ves el mensaje en tu bandeja?</strong>
                <p>
                  Revisa tu carpeta de <strong>Correo no deseado (Spam)</strong> o promociones.
                </p>
              </div>

              <NavLink to="/login" className="btn-primario">
                Volver a Iniciar Sesión
              </NavLink>
            </div>
          ) : (
            <>
              <h2>Recuperar Contraseña</h2>
              <p className="subtitulo">
                Ingresa tu correo electrónico asociado para enviarte las instrucciones.
              </p>

              {errorMensaje && (
                <div className="mensaje-error">
                  {errorMensaje}
                </div>
              )}

              <form onSubmit={manejarRecuperacion}>
                <div className="campo-grupo">
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
                </div>

                <button type="submit" className="btn-primario">
                  Enviar enlace
                </button>
              </form>

              <p className="enlace-volver">
                ¿Recordaste tu contraseña?{' '}
                <NavLink to="/login">Vuelve al Login</NavLink>
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}