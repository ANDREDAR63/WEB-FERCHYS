import React, { useState, useEffect } from "react";
import "./DashboardCocinero.css";

const DashboardCocinero = () => {

  const [seccionActiva, setSeccionActiva] = useState("inicio");

const [perfil, setPerfil] = useState({
  nombre: "Juan Pérez",
  email: "juan.perez@example.com",
  telefono: "3001234567",
  cargo: "Cocinero Principal",
  horario: "8:00 AM - 5:00 PM",
});

useEffect(() => {
  const datosGuardados = localStorage.getItem("perfilCocinero");

  if (datosGuardados) {
    setPerfil(JSON.parse(datosGuardados));
  }
}, []);

// AQUÍ PEGA ESTE BLOQUE

const [pedidos, setPedidos] = useState([
  {
    id: 1,
    cliente: "Carlos",
    productos: ["Cheesecake", "Brownie"],
    hora: "10:30",
    estado: "Pendiente",
  },
  {
    id: 2,
    cliente: "María",
    productos: ["Tarta de Limón"],
    hora: "11:15",
    estado: "En preparación",
  },
]);

/* ==========================
   INVENTARIO
========================== */

const [inventario, setInventario] = useState([
  {
    id: 1,
    nombre: "Harina",
    cantidad: 25,
    unidad: "kg"
  },
  {
    id: 2,
    nombre: "Azúcar",
    cantidad: 18,
    unidad: "kg"
  },
  {
    id: 3,
    nombre: "Chocolate",
    cantidad: 12,
    unidad: "kg"
  },
  {
    id: 4,
    nombre: "Huevos",
    cantidad: 180,
    unidad: "unidades"
  },
  {
    id: 5,
    nombre: "Queso crema",
    cantidad: 15,
    unidad: "kg"
  },
  {
    id: 6,
    nombre: "Mantequilla",
    cantidad: 9,
    unidad: "kg"
  }
]);

const [busqueda, setBusqueda] = useState("");

const [nuevoProducto, setNuevoProducto] = useState({
    nombre:"",
    cantidad:"",
    unidad:"kg"
});

const [mostrarModal,setMostrarModal]=useState(false);

const [productoEditar,setProductoEditar]=useState(null);

  const prepararPedido = (id) => {

    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === id
          ? { ...pedido, estado: "En preparación" }
          : pedido
      )
    );

  };

const marcarListo = (id) => {

  setPedidos((prev) =>
    prev.map((pedido) =>
      pedido.id === id
        ? { ...pedido, estado: "Listo para entregar" }
        : pedido
    )
  );

};

/* ==========================
   ACTUALIZAR PERFIL
========================== */

const actualizarPerfil = (e) => {
  const { name, value } = e.target;

  let nuevoValor = value;

  if (name === "telefono") {
    // Solo números y máximo 10 dígitos
    nuevoValor = value.replace(/\D/g, "").slice(0, 10);
  }

  setPerfil((prev) => ({
    ...prev,
    [name]: nuevoValor,
  }));
};

// ==========================
// GUARDAR CAMBIOS
// ==========================

const guardarCambios = () => {

  if (perfil.nombre.trim() === "") {
    alert("Debe ingresar el nombre.");
    return;
  }

  if (perfil.email.trim() === "") {
    alert("Debe ingresar el correo.");
    return;
  }

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!correoValido.test(perfil.email)) {
    alert("Ingrese un correo válido.");
    return;
  }

  if (perfil.telefono.trim() === "") {
    alert("Debe ingresar el teléfono.");
    return;
  }

  if (perfil.telefono.length !== 10) {
    alert("El teléfono debe tener exactamente 10 números.");
    return;
  }

  localStorage.setItem("perfilCocinero", JSON.stringify(perfil));

  alert("Cambios guardados correctamente.");

};

/* ==========================
   INVENTARIO
========================== */

// Abrir modal para agregar
const abrirModalAgregar = () => {

    setProductoEditar(null);

    setNuevoProducto({
        nombre: "",
        cantidad: "",
        unidad: "kg"
    });

    setMostrarModal(true);

};

// Guardar producto
const guardarProducto = () => {

    if (
        nuevoProducto.nombre.trim() === "" ||
        nuevoProducto.cantidad === ""
    ) {
        alert("Complete todos los campos.");
        return;
    }

    // EDITAR
    if (productoEditar) {

        setInventario((prev) =>
            prev.map((producto) =>
                producto.id === productoEditar.id
                    ? {
                        ...producto,
                        ...nuevoProducto,
                        cantidad: Number(nuevoProducto.cantidad)
                    }
                    : producto
            )
        );

    } else {

        // AGREGAR

        const nuevo = {

            id: Date.now(),

            nombre: nuevoProducto.nombre,

            cantidad: Number(nuevoProducto.cantidad),

            unidad: nuevoProducto.unidad

        };

        setInventario((prev) => [...prev, nuevo]);

    }

    setMostrarModal(false);

};

// Editar
const editarProducto = (producto) => {

    setProductoEditar(producto);

    setNuevoProducto({

        nombre: producto.nombre,

        cantidad: producto.cantidad,

        unidad: producto.unidad

    });

    setMostrarModal(true);

};

// Eliminar
const eliminarProducto = (id) => {

    if (window.confirm("¿Desea eliminar este producto?")) {

        setInventario((prev) =>
            prev.filter((producto) => producto.id !== id)
        );

    }

};

// ==========================
// ESTADO DEL INVENTARIO
// ==========================

const obtenerEstado = (cantidad) => {

  if (cantidad === 0) {
    return "Agotado";
  }

  if (cantidad <= 10) {
    return "Poco stock";
  }

  return "Disponible";

};

// ==========================
// RETURN
// ==========================

return (

  <div className="dashboard-cocinero">

    {/* Todo tu dashboard */}


  {/*==================== SIDEBAR ====================*/}

  <aside className="sidebar">

        <div className="logo">

          <h2>🍰 Ferchy's</h2>

          <p>Panel del Cocinero</p>

        </div>

        <ul className="menu">

          <li
            className={seccionActiva === "inicio" ? "activo" : ""}
            onClick={() => setSeccionActiva("inicio")}
          >
             Inicio
          </li>

          <li
            className={seccionActiva === "perfil" ? "activo" : ""}
            onClick={() => setSeccionActiva("perfil")}
          >
             Perfil
          </li>

          <li
            className={seccionActiva === "pedidos" ? "activo" : ""}
            onClick={() => setSeccionActiva("pedidos")}
          >
             Pedidos
          </li>

          <li
            className={seccionActiva === "inventario" ? "activo" : ""}
            onClick={() => setSeccionActiva("inventario")}
          >
             Inventario
          </li>

          <li
            className={seccionActiva === "estadisticas" ? "activo" : ""}
            onClick={() => setSeccionActiva("estadisticas")}
          >
             Estadísticas
          </li>

          <li
            className={seccionActiva === "recetas" ? "activo" : ""}
            onClick={() => setSeccionActiva("recetas")}
          >
             Recetas
          </li>

          <li
            className={seccionActiva === "configuracion" ? "activo" : ""}
            onClick={() => setSeccionActiva("configuracion")}
          >
             Configuración
          </li>

          <li
            className={seccionActiva === "cerrar" ? "activo" : ""}
            onClick={() => setSeccionActiva("cerrar")}
          >
             Cerrar sesión
          </li>

        </ul>

      </aside>

      {/*==================== CONTENIDO ====================*/}

     <main className="contenido">

        <header className="header">

          <div>

            <h1>Dashboard del Cocinero</h1>

            <p>
              Bienvenido al sistema de producción de Ferchy's Postres.
            </p>

          </div>

          <div className="usuario">

            <h3>{perfil.nombre}</h3>

            <span>{perfil.cargo}</span>

          </div>

        </header>

        {/*==================== INICIO ====================*/}

        {seccionActiva === "inicio" && (

          <>

            <div className="cards">

              <div className="card">

                <h2>{pedidos.length}</h2>

                <p>Pedidos del día</p>

              </div>

              <div className="card">

                <h2>

                  {
                    pedidos.filter(
                      p => p.estado === "Pendiente"
                    ).length
                  }

                </h2>

                <p>Pendientes</p>

              </div>

              <div className="card">

                <h2>

                  {
                    pedidos.filter(
                      p => p.estado === "En preparación"
                    ).length
                  }

                </h2>

                <p>Preparando</p>

              </div>

              <div className="card">

                <h2>

                  {
                    pedidos.filter(
                      p => p.estado === "Listo para entregar"
                    ).length
                  }

                </h2>

                <p>Listos</p>

              </div>

            </div>

                        {/* ==================== TABLA DE PEDIDOS ==================== */}

            <section className="panel">

              <h2>Pedidos Recientes</h2>

              <div className="tabla">

                <table>

                  <thead>

                    <tr>

                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th>Acciones</th>

                    </tr>

                  </thead>

                  <tbody>

                    {pedidos.map((pedido) => (

                      <tr key={pedido.id}>

                        <td>#{pedido.id}</td>

                        <td>{pedido.cliente}</td>

                        <td>

                          {pedido.productos.map((producto, index) => (

                            <div key={index}>
                              • {producto}
                            </div>

                          ))}

                        </td>

                        <td>{pedido.hora}</td>

                        <td>

                          <span
                            className={`estado ${pedido.estado
                              .replaceAll(" ", "-")
                              .toLowerCase()}`}
                          >

                            {pedido.estado}

                          </span>

                        </td>

                        <td>

                          <button
                            className="btn btn-preparar"
                            onClick={() => prepararPedido(pedido.id)}
                            disabled={
                              pedido.estado === "En preparación" ||
                              pedido.estado === "Listo para entregar"
                            }
                          >

                            Preparar

                          </button>

                          <button
                            className="btn btn-listo"
                            onClick={() => marcarListo(pedido.id)}
                            disabled={
                              pedido.estado === "Listo para entregar"
                            }
                          >

                            Marcar listo

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>

          </>

        )}

        {/* ==================== PERFIL ==================== */}

        {seccionActiva === "perfil" && (

          <section className="panel">

            <h2>Perfil del Cocinero</h2>

            <div className="perfil-card">

              <h3>{perfil.nombre}</h3>

              <p>
                <strong>Cargo:</strong> {perfil.cargo}
              </p>

              <p>
                <strong>Email:</strong> {perfil.email}
              </p>

              <p>
                <strong>Teléfono:</strong> {perfil.telefono}
              </p>

              <p>
                <strong>Horario:</strong> {perfil.horario}
              </p>

            </div>

          </section>

        )}

        {/* ==================== PEDIDOS ==================== */}

      

        {seccionActiva === "pedidos" && (

          <section className="panel">

            <h2>Gestión de Pedidos</h2>

            {pedidos.map((pedido) => (

              <div className="pedido-card" key={pedido.id}>

                <h3>Pedido #{pedido.id}</h3>

                <p>
                  <strong>Cliente:</strong> {pedido.cliente}
                </p>

                <p>
                  <strong>Hora:</strong> {pedido.hora}
                </p>

                <p>
                  <strong>Estado:</strong> {pedido.estado}
                </p>

                <ul>

                  {pedido.productos.map((producto, index) => (

                    <li key={index}>
                      {producto}
                    </li>

                  ))}

                </ul>

              </div>

            ))}

          </section>

        )}

       {/* ==================== INVENTARIO ==================== */}

{seccionActiva === "inventario" && (

<section className="panel">

    <div className="inventario-header">

        <h2>Inventario</h2>

        <button
            className="btn-agregar"
            onClick={abrirModalAgregar}
        >
            + Agregar producto
        </button>

    </div>

    <input
        type="text"
        placeholder="Buscar ingrediente..."
        value={busqueda}
        onChange={(e)=>setBusqueda(e.target.value)}
        className="input-busqueda"
    />

    <table>

        <thead>

            <tr>

                <th>Ingrediente</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Acciones</th>

            </tr>

        </thead>

        <tbody>

        {inventario
        .filter(item =>
            item.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase())
        )
        .map(item=>(

            <tr key={item.id}>

                <td>{item.nombre}</td>

                <td>{item.cantidad}</td>

                <td>{item.unidad}</td>

                <td>

                    <span
                        className={`estado-inventario ${obtenerEstado(item.cantidad)
                        .replace(" ","-")
                        .toLowerCase()}`}
                    >
                        {obtenerEstado(item.cantidad)}
                    </span>

                </td>

                <td>

                    <button
                        className="btn btn-preparar"
                        onClick={()=>editarProducto(item)}
                    >
                        Editar
                    </button>

                    <button
                        className="btn btn-cerrar"
                        onClick={()=>eliminarProducto(item.id)}
                    >
                        Eliminar
                    </button>

                </td>

            </tr>

        ))}

        </tbody>

    </table>

</section>

)}

                {/* ==================== ESTADÍSTICAS ==================== */}

        {seccionActiva === "estadisticas" && (

          <section className="panel">

            <h2>Estadísticas</h2>

            <div className="cards">

              <div className="card">

                <h2>120</h2>

                <p>Pedidos completados este mes</p>

              </div>

              <div className="card">

                <h2>4.9 ⭐</h2>

                <p>Calificación promedio</p>

              </div>

              <div className="card">

                <h2>95%</h2>

                <p>Entregas a tiempo</p>

              </div>

              <div className="card">

                <h2>18</h2>

                <p>Pedidos hoy</p>

              </div>

            </div>

          </section>

        )}

        {/* ==================== RECETAS ==================== */}

        {seccionActiva === "recetas" && (

          <section className="panel">

            <h2>Recetas Disponibles</h2>

            <div className="recetas-grid">

              <div className="receta-card">
                <h3> Cheesecake Oreo</h3>
                <p>Tiempo: 2 horas</p>
              </div>

              <div className="receta-card">
                <h3> Tarta de Limón</h3>
                <p>Tiempo: 1.5 horas</p>
              </div>

              <div className="receta-card">
                <h3> Brownie</h3>
                <p>Tiempo: 1 hora</p>
              </div>

              <div className="receta-card">
                <h3> Cheesecake Frutos Rojos</h3>
                <p>Tiempo: 2 horas</p>
              </div>

            </div>

          </section>

        )}

        {/* ==================== CONFIGURACIÓN ==================== */}

     {seccionActiva === "configuracion" && (

  <section className="panel">

    <h2>Configuración</h2>

    <div className="configuracion">

      <label>

        Nombre

        <input
  type="text"
  name="nombre"
  value={perfil.nombre}
  onChange={actualizarPerfil}
  required
/>

      </label>

      <label>

        Correo

        <input
  type="email"
  name="email"
  value={perfil.email}
  onChange={actualizarPerfil}
  required
/>

      </label>

      <label>

        Teléfono

  <input
  type="tel"
  name="telefono"
  value={perfil.telefono}
  onChange={actualizarPerfil}
  maxLength={10}
  inputMode="numeric"
  required
/>

      </label>

      <button
        className="btn-guardar"
        onClick={guardarCambios}
      >
        Guardar cambios
      </button>

    </div>

  </section>

)}

        {/* ==================== CERRAR SESIÓN ==================== */}

{seccionActiva === "cerrar" && (

  <section className="panel">

    <h2>Cerrar sesión</h2>

    <p>¿Seguro que deseas salir del sistema?</p>

    <button className="btn-cerrar">
      Cerrar sesión
    </button>

  </section>

)}

{mostrarModal && (

<div className="modal">

    <div className="modal-contenido">

        <h2>

            {productoEditar
                ? "Editar Producto"
                : "Nuevo Producto"}

        </h2>

        <input
            type="text"
            placeholder="Nombre"
            value={nuevoProducto.nombre}
            onChange={(e)=>
                setNuevoProducto({
                    ...nuevoProducto,
                    nombre:e.target.value
                })
            }
        />

        <input
            type="number"
            placeholder="Cantidad"
            value={nuevoProducto.cantidad}
            onChange={(e)=>
                setNuevoProducto({
                    ...nuevoProducto,
                    cantidad:e.target.value
                })
            }
        />

        <select
            value={nuevoProducto.unidad}
            onChange={(e)=>
                setNuevoProducto({
                    ...nuevoProducto,
                    unidad:e.target.value
                })
            }
        >

            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="L">L</option>
            <option value="ml">ml</option>
            <option value="unidades">unidades</option>

        </select>

        <div className="acciones-modal">

            <button
                className="btn-guardar"
                onClick={guardarProducto}
            >
                Guardar
            </button>

            <button
                className="btn-cerrar"
                onClick={()=>setMostrarModal(false)}
            >
                Cancelar
            </button>

        </div>

    </div>

</div>

)}

</main>

</div>

);

};

export default DashboardCocinero;