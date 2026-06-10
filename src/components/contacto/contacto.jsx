import React, { useState } from 'react';
import './contacto.css';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: '', telefono: '', producto: '', fecha: '', mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const texto = `Hola Ferchy's! Me gustaría hacer un pedido:%0A%0A👤 *Nombre:* ${form.nombre}%0A📞 *Teléfono:* ${form.telefono}%0A🎂 *Producto:* ${form.producto}%0A📅 *Fecha:* ${form.fecha}%0A💬 *Mensaje:* ${form.mensaje}`;
    window.open(`https://wa.me/573024798502?text=${texto}`, '_blank');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <section className="contacto section-padding" id="contacto">
      <div className="container">
        <h2>Haz tu Pedido</h2>
        <p className="contacto__intro">
          ¿Tienes una ocasión especial? Cuéntanos y creamos algo único para ti.
          Respondemos en menos de 2 horas.
        </p>

        <div className="contacto__grid">
          {/* Info cards */}
          <div className="contacto__info">
            <div className="contacto__info-card">
              <span className="contacto__info-icon">💬</span>
              <div>
                <strong>WhatsApp</strong>
                <p>+57 302 479 8502</p>
              </div>
            </div>
            <div className="contacto__info-card">
              <span className="contacto__info-icon">📍</span>
              <div>
                <strong>Ubicación</strong>
                <p>Bogotá, Colombia</p>
              </div>
            </div>
            <div className="contacto__info-card">
              <span className="contacto__info-icon">🕐</span>
              <div>
                <strong>Horarios</strong>
                <p>Lun – Vi: 8am – 7pm</p>
              </div>
            </div>
            <div className="contacto__info-card">
              <span className="contacto__info-icon">🚚</span>
              <div>
                <strong>Domicilio</strong>
                <p>Consultar según zona</p>
              </div>
            </div>

            {/* Redes */}
            <div className="contacto__redes">
              <h4 className="contacto__redes-titulo">Síguenos</h4>
              <div className="contacto__redes-links">
                <a href="https://www.instagram.com/ferchyspostres?igsh=bTNudmp4dzdxZWo4" className="contacto__red" aria-label="Instagram"><FaInstagram />  Instagram </a>
                <a href="https://www.facebook.com/share/1RgeqKbXVP/" className="contacto__red" aria-label="Facebook"><FaFacebook />  Facebook </a>
                <a href="https://tiktok.com" className="contacto__red" aria-label="TikTok"><FaTiktok />  TikTok </a>
                <a href="https://wa.me/573024798502" className="contacto__red" aria-label="WhatsApp"><FaWhatsapp />  WhatsApp </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contacto__form-wrap">
            {enviado && (
              <div className="contacto__success">
                ✅ ¡Pedido enviado! Te respondemos pronto 🧁
              </div>
            )}
            <form className="contacto__form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Tu nombre *</label>
                  <input
                    id="nombre" name="nombre" type="text"
                    placeholder="María Pérez"
                    value={form.nombre} onChange={handleChange} required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono/ Celular *</label>
                  <input
                    id="telefono" name="telefono" type="tel"
                    placeholder="+57 300 000 0000"
                    value={form.telefono} onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="producto">¿Qué deseas? *</label>
                  <select id="producto" name="producto" value={form.producto} onChange={handleChange} required>
                    <option value="">Selecciona...</option>
                    <option>Refractaria cheesecake familiar</option>
                    <option>Alfajores</option>
                    <option>Suspiros</option>
                    <option>Cheesecake</option>
                    <option>Caja surtida</option>
                    <option>Otro / Consulta</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fecha">¿Cuándo lo necesitas? *</label>
                  <input
                    id="fecha" name="fecha" type="date"
                    value={form.fecha} onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="mensaje">Cuéntanos más</label>
                <textarea
                  id="mensaje" name="mensaje" rows="4"
                  placeholder="Número de personas, sabores, decoración..."
                  value={form.mensaje} onChange={handleChange}
                />
              </div>
              <button type="submit" className="contacto__submit">
                💬 Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
