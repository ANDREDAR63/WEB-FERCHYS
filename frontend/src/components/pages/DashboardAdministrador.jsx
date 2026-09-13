import React, { useEffect, useState } from "react";
import "./DashboardAdministrador.css";

const DashboardAdministrador = () => {
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  const [perfil, setPerfil] = useState({
    nombre: "Administrador",
    email: "admin@ferchys.com",
    telefono: "3001234567",
    cargo: "Administrador",
    foto: "",
  });

  const [pedidos, setPedidos] = useState([
    {
      id: 1001,
      cliente: "Carlos Gómez",
      productos: "Cheesecake + Brownie",
      total: 32000,
      estado: "Pendiente",
      hora: "10:30 AM",
    },
    {
      id: 1002,
      cliente: "María López",
      productos: "Tarta de Limón",
      total: 25000,
      estado: "En preparación",
      hora: "11:15 AM",
    },
    {
      id: 1003,
      cliente: "Juan Rodríguez",
      productos: "Brownie + Café",
      total: 18000,
      estado: "Listo",
      hora: "12:00 PM",
    },
    {
      id: 1004,
      cliente: "Laura Martínez",
      productos: "Cheesecake",
      total: 22000,
      estado: "Entregado",
      hora: "12:30 PM",
    },
  ]);

  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: "Cheesecake",
      categoria: "Postres",
      precio: 22000,
      stock: 15,
      estado: "Disponible",
    },
    {
      id: 2,
      nombre: "Brownie",
      categoria: "Postres",
      precio: 12000,
      stock: 20,
      estado: "Disponible",
    },
    {
      id: 3,
      nombre: "Tarta de Limón",
      categoria: "Tartas",
      precio: 25000,
      stock: 8,
      estado: "Disponible",
    },
    {
      id: 4,
      nombre: "Galletas",
      categoria: "Repostería",
      precio: 8000,
      stock: 3,
      estado: "Poco stock",
    },
  ]);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Carlos Gómez",
      email: "carlos@gmail.com",
      rol: "Cliente",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "María López",
      email: "maria@gmail.com",
      rol: "Cliente",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Juan Pérez",
      email: "juan.perez@example.com",
      rol: "Cocinero",
      estado: "Activo",
    },
    {
      id: 4,
      nombre: "Laura Martínez",
      email: "laura@gmail.com",
      rol: "Cliente",
      estado: "Inactivo",
    },
  ]);

  const [cocineros] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@example.com",
      horario: "8:00 AM - 5:00 PM",
      pedidos: 12,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Andrés Gómez",
      email: "andres@ferchys.com",
      horario: "10:00 AM - 7:00 PM",
      pedidos: 8,
      estado: "Activo",
    },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    const perfilGuardado = localStorage.getItem("perfilAdministrador");

    if (perfilGuardado) {
      setPerfil(JSON.parse(perfilGuardado));
    }
  }, []);

  const cambiarEstadoPedido = (id, nuevoEstado) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === id
          ? { ...pedido, estado: nuevoEstado }
          : pedido
      )
    );
  };

  const cambiarEstadoUsuario = (id) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              estado:
                usuario.estado === "Activo" ? "Inactivo" : "Activo",
            }
          : usuario
      )
    );
  };

  const abrirNuevoProducto = () => {
    setProductoEditar(null);
    setNuevoProducto({
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
    });
    setMostrarModalProducto(true);
  };

  const editarProducto = (producto) => {
    setProductoEditar(producto);

    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    });

    setMostrarModalProducto(true);
  };

  const guardarProducto = (e) => {
    e.preventDefault();

    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.categoria ||
      !nuevoProducto.precio ||
      nuevoProducto.stock === ""
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (productoEditar) {
      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === productoEditar.id
            ? {
                ...producto,
                nombre: nuevoProducto.nombre,
                categoria: nuevoProducto.categoria,
                precio: Number(nuevoProducto.precio),
                stock: Number(nuevoProducto.stock),
                estado:
                  Number(nuevoProducto.stock) === 0
                    ? "Agotado"
                    : Number(nuevoProducto.stock) <= 5
                    ? "Poco stock"
                    : "Disponible",
              }
            : producto
        )
      );
    } else {
      const nuevo = {
        id: Date.now(),
        nombre: nuevoProducto.nombre,
        categoria: nuevoProducto.categoria,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        estado:
          Number(nuevoProducto.stock) === 0
            ? "Agotado"
            : Number(nuevoProducto.stock) <= 5
            ? "Poco stock"
            : "Disponible",
      };

      setProductos((prev) => [...prev, nuevo]);
    }

    setMostrarModalProducto(false);
  };

  const eliminarProducto = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );

    if (!confirmar) return;

    setProductos((prev) =>
      prev.filter((producto) => producto.id !== id)
    );
  };

  const actualizarPerfil = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      setPerfil((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, "").slice(0, 10),
      }));
      return;
    }

    setPerfil((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarPerfil = (e) => {
    e.preventDefault();

    if (!perfil.nombre.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (!perfil.email.trim()) {
      alert("El correo es obligatorio.");
      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.email);

    if (!emailValido) {
      alert("Ingresa un correo válido.");
      return;
    }

    if (perfil.telefono.length !== 10) {
      alert("El teléfono debe tener exactamente 10 números.");
      return;
    }

    localStorage.setItem(
      "perfilAdministrador",
      JSON.stringify(perfil)
    );

    alert("Perfil actualizado correctamente.");
  };

  const cambiarFoto = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onloadend = () => {
      setPerfil((prev) => {
        const actualizado = {
          ...prev,
          foto: lector.result,
        };

        localStorage.setItem(
          "perfilAdministrador",
          JSON.stringify(actualizado)
        );

        return actualizado;
      });
    };

    lector.readAsDataURL(archivo);
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideBusqueda =
      pedido.cliente
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      pedido.id.toString().includes(busqueda);

    const coincideEstado =
      filtroEstado === "Todos" ||
      pedido.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      usuario.email
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const ventasTotales = pedidos.reduce(
    (total, pedido) => total + pedido.total,
    0
  );

  const pedidosPendientes = pedidos.filter(
    (pedido) =>
      pedido.estado === "Pendiente" ||
      pedido.estado === "En preparación"
  ).length;

  const productosBajoStock = productos.filter(
    (producto) => producto.stock <= 5
  ).length;

  const clientes = usuarios.filter(
    (usuario) => usuario.rol === "Cliente"
  ).length;

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString("es-CO")}`;
  };

  return (
    <div className="dashboard-administrador">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>Ferchy's</h2>
          <span>Administración</span>
        </div>

        <div className="admin-perfil-mini">
          <div className="admin-avatar-mini">
            {perfil.foto ? (
              <img src={perfil.foto} alt="Administrador" />
            ) : (
              "A"
            )}
          </div>

          <div>
            <strong>{perfil.nombre}</strong>
            <small>Administrador</small>
          </div>
        </div>

        <nav className="admin-menu">

          <button
            className={seccionActiva === "inicio" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("inicio");
              setBusqueda("");
            }}
          >
            <span>📊</span>
            Inicio
          </button>

          <button
            className={seccionActiva === "pedidos" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("pedidos");
              setBusqueda("");
            }}
          >
            <span>🛒</span>
            Pedidos
          </button>

          <button
            className={seccionActiva === "productos" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("productos");
              setBusqueda("");
            }}
          >
            <span>🍰</span>
            Productos
          </button>

          <button
            className={seccionActiva === "inventario" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("inventario");
              setBusqueda("");
            }}
          >
            <span>📦</span>
            Inventario
          </button>

          <button
            className={seccionActiva === "usuarios" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("usuarios");
              setBusqueda("");
            }}
          >
            <span>👥</span>
            Usuarios
          </button>

          <button
            className={seccionActiva === "cocineros" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("cocineros");
              setBusqueda("");
            }}
          >
            <span>👨‍🍳</span>
            Cocineros
          </button>

          <button
            className={seccionActiva === "reportes" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("reportes");
              setBusqueda("");
            }}
          >
            <span>📈</span>
            Reportes
          </button>

          <button
            className={seccionActiva === "configuracion" ? "activo" : ""}
            onClick={() => {
              setSeccionActiva("configuracion");
              setBusqueda("");
            }}
          >
            <span>⚙️</span>
            Configuración
          </button>

        </nav>

        <div className="admin-sidebar-footer">
          <span>Ferchy's © 2026</span>
        </div>

      </aside>

      {/* CONTENIDO */}
      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>
              {seccionActiva === "inicio" && "Panel principal"}
              {seccionActiva === "pedidos" && "Gestión de pedidos"}
              {seccionActiva === "productos" && "Gestión de productos"}
              {seccionActiva === "inventario" && "Inventario"}
              {seccionActiva === "usuarios" && "Usuarios"}
              {seccionActiva === "cocineros" && "Cocineros"}
              {seccionActiva === "reportes" && "Reportes"}
              {seccionActiva === "configuracion" && "Configuración"}
            </h1>

            <p>
              Bienvenido, {perfil.nombre}
            </p>
          </div>

          <div className="admin-header-user">
            <div className="admin-header-avatar">
              {perfil.foto ? (
                <img src={perfil.foto} alt="Perfil" />
              ) : (
                "A"
              )}
            </div>

            <span>Administrador</span>
          </div>
        </header>

        {/* INICIO */}
        {seccionActiva === "inicio" && (
          <section>

            <div className="admin-stats">

              <div className="admin-stat-card">
                <div className="stat-icon">💰</div>
                <div>
                  <span>Ventas totales</span>
                  <strong>{formatearPrecio(ventasTotales)}</strong>
                  <small>Este periodo</small>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">🛍️</div>
                <div>
                  <span>Pedidos</span>
                  <strong>{pedidos.length}</strong>
                  <small>Total registrados</small>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">⏳</div>
                <div>
                  <span>Pendientes</span>
                  <strong>{pedidosPendientes}</strong>
                  <small>Requieren atención</small>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">👥</div>
                <div>
                  <span>Clientes</span>
                  <strong>{clientes}</strong>
                  <small>Usuarios registrados</small>
                </div>
              </div>

            </div>

            <div className="admin-dashboard-grid">

              <div className="admin-panel">
                <div className="panel-title">
                  <h2>Pedidos recientes</h2>

                  <button
                    onClick={() => setSeccionActiva("pedidos")}
                  >
                    Ver todos
                  </button>
                </div>

                <div className="admin-table-container">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>Pedido</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>

                      {pedidos.slice(0, 5).map((pedido) => (
                        <tr key={pedido.id}>
                          <td>#{pedido.id}</td>
                          <td>{pedido.cliente}</td>
                          <td>{formatearPrecio(pedido.total)}</td>
                          <td>
                            <span
                              className={`estado estado-${pedido.estado
                                .toLowerCase()
                                .replaceAll(" ", "-")}`}
                            >
                              {pedido.estado}
                            </span>
                          </td>
                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              </div>

              <div className="admin-panel resumen-panel">

                <div className="panel-title">
                  <h2>Resumen</h2>
                </div>

                <div className="resumen-item">
                  <span>Productos registrados</span>
                  <strong>{productos.length}</strong>
                </div>

                <div className="resumen-item">
                  <span>Productos bajo stock</span>
                  <strong>{productosBajoStock}</strong>
                </div>

                <div className="resumen-item">
                  <span>Cocineros activos</span>
                  <strong>
                    {cocineros.filter(
                      (c) => c.estado === "Activo"
                    ).length}
                  </strong>
                </div>

                <div className="resumen-item">
                  <span>Usuarios</span>
                  <strong>{usuarios.length}</strong>
                </div>

              </div>

            </div>

            <div className="admin-panel ventas-panel">

              <div className="panel-title">
                <h2>Ventas de la semana</h2>
              </div>

              <div className="grafica">

                <div className="barra">
                  <span>700K</span>
                  <div style={{ height: "75%" }}></div>
                  <small>Lun</small>
                </div>

                <div className="barra">
                  <span>520K</span>
                  <div style={{ height: "55%" }}></div>
                  <small>Mar</small>
                </div>

                <div className="barra">
                  <span>850K</span>
                  <div style={{ height: "90%" }}></div>
                  <small>Mié</small>
                </div>

                <div className="barra">
                  <span>620K</span>
                  <div style={{ height: "65%" }}></div>
                  <small>Jue</small>
                </div>

                <div className="barra">
                  <span>950K</span>
                  <div style={{ height: "100%" }}></div>
                  <small>Vie</small>
                </div>

                <div className="barra">
                  <span>780K</span>
                  <div style={{ height: "82%" }}></div>
                  <small>Sáb</small>
                </div>

                <div className="barra">
                  <span>450K</span>
                  <div style={{ height: "48%" }}></div>
                  <small>Dom</small>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* PEDIDOS */}
        {seccionActiva === "pedidos" && (
          <section>

            <div className="admin-toolbar">

              <input
                type="text"
                placeholder="Buscar por cliente o pedido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                value={filtroEstado}
                onChange={(e) =>
                  setFiltroEstado(e.target.value)
                }
              >
                <option>Todos</option>
                <option>Pendiente</option>
                <option>En preparación</option>
                <option>Listo</option>
                <option>Entregado</option>
                <option>Cancelado</option>
              </select>

            </div>

            <div className="admin-panel">

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Hora</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id}>

                        <td>#{pedido.id}</td>

                        <td>{pedido.cliente}</td>

                        <td>{pedido.productos}</td>

                        <td>{pedido.hora}</td>

                        <td>
                          {formatearPrecio(pedido.total)}
                        </td>

                        <td>
                          <span
                            className={`estado estado-${pedido.estado
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {pedido.estado}
                          </span>
                        </td>

                        <td>

                          <select
                            value={pedido.estado}
                            onChange={(e) =>
                              cambiarEstadoPedido(
                                pedido.id,
                                e.target.value
                              )
                            }
                          >
                            <option>Pendiente</option>
                            <option>En preparación</option>
                            <option>Listo</option>
                            <option>Entregado</option>
                            <option>Cancelado</option>
                          </select>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* PRODUCTOS */}
        {seccionActiva === "productos" && (
          <section>

            <div className="admin-toolbar">

              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <button
                className="btn-principal"
                onClick={abrirNuevoProducto}
              >
                + Nuevo producto
              </button>

            </div>

            <div className="admin-panel">

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id}>

                        <td>
                          <strong>{producto.nombre}</strong>
                        </td>

                        <td>{producto.categoria}</td>

                        <td>
                          {formatearPrecio(producto.precio)}
                        </td>

                        <td>{producto.stock}</td>

                        <td>
                          <span
                            className={`estado ${
                              producto.estado === "Disponible"
                                ? "estado-listo"
                                : producto.estado ===
                                  "Poco stock"
                                ? "estado-pendiente"
                                : "estado-cancelado"
                            }`}
                          >
                            {producto.estado}
                          </span>
                        </td>

                        <td className="acciones">

                          <button
                            className="btn-editar"
                            onClick={() =>
                              editarProducto(producto)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="btn-eliminar"
                            onClick={() =>
                              eliminarProducto(producto.id)
                            }
                          >
                            Eliminar
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* INVENTARIO */}
        {seccionActiva === "inventario" && (
          <section>

            <div className="admin-stats">

              <div className="admin-stat-card">
                <div className="stat-icon">📦</div>
                <div>
                  <span>Total productos</span>
                  <strong>{productos.length}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">⚠️</div>
                <div>
                  <span>Bajo stock</span>
                  <strong>{productosBajoStock}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">❌</div>
                <div>
                  <span>Agotados</span>
                  <strong>
                    {
                      productos.filter(
                        (p) => p.stock === 0
                      ).length
                    }
                  </strong>
                </div>
              </div>

            </div>

            <div className="admin-panel">

              <div className="panel-title">
                <h2>Control de inventario</h2>
              </div>

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>

                    {productos.map((producto) => (
                      <tr key={producto.id}>

                        <td>{producto.nombre}</td>

                        <td>{producto.categoria}</td>

                        <td>
                          <strong>{producto.stock}</strong>
                        </td>

                        <td>
                          <span
                            className={`estado ${
                              producto.stock === 0
                                ? "estado-cancelado"
                                : producto.stock <= 5
                                ? "estado-pendiente"
                                : "estado-listo"
                            }`}
                          >
                            {producto.stock === 0
                              ? "Agotado"
                              : producto.stock <= 5
                              ? "Poco stock"
                              : "Disponible"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn-editar"
                            onClick={() =>
                              editarProducto(producto)
                            }
                          >
                            Actualizar
                          </button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* USUARIOS */}
        {seccionActiva === "usuarios" && (
          <section>

            <div className="admin-toolbar">

              <input
                type="text"
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

            <div className="admin-panel">

              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>

                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id}>

                        <td>
                          <strong>{usuario.nombre}</strong>
                        </td>

                        <td>{usuario.email}</td>

                        <td>
                          <span className="rol">
                            {usuario.rol}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`estado ${
                              usuario.estado === "Activo"
                                ? "estado-listo"
                                : "estado-cancelado"
                            }`}
                          >
                            {usuario.estado}
                          </span>
                        </td>

                        <td>

                          <button
                            className={
                              usuario.estado === "Activo"
                                ? "btn-eliminar"
                                : "btn-editar"
                            }
                            onClick={() =>
                              cambiarEstadoUsuario(
                                usuario.id
                              )
                            }
                          >
                            {usuario.estado === "Activo"
                              ? "Desactivar"
                              : "Activar"}
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* COCINEROS */}
        {seccionActiva === "cocineros" && (
          <section>

            <div className="admin-panel">

              <div className="panel-title">
                <h2>Equipo de cocina</h2>
              </div>

              <div className="cocineros-grid">

                {cocineros.map((cocinero) => (
                  <div
                    className="cocinero-card"
                    key={cocinero.id}
                  >

                    <div className="cocinero-avatar">
                      👨‍🍳
                    </div>

                    <h3>{cocinero.nombre}</h3>

                    <p>{cocinero.email}</p>

                    <div className="cocinero-info">
                      <span>Horario</span>
                      <strong>{cocinero.horario}</strong>
                    </div>

                    <div className="cocinero-info">
                      <span>Pedidos asignados</span>
                      <strong>{cocinero.pedidos}</strong>
                    </div>

                    <span className="estado estado-listo">
                      {cocinero.estado}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </section>
        )}

        {/* REPORTES */}
        {seccionActiva === "reportes" && (
          <section>

            <div className="admin-stats">

              <div className="admin-stat-card">
                <div className="stat-icon">💰</div>
                <div>
                  <span>Ingresos</span>
                  <strong>
                    {formatearPrecio(ventasTotales)}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">🛒</div>
                <div>
                  <span>Pedidos</span>
                  <strong>{pedidos.length}</strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">🍰</div>
                <div>
                  <span>Productos</span>
                  <strong>{productos.length}</strong>
                </div>
              </div>

            </div>

            <div className="admin-panel">

              <div className="panel-title">
                <h2>Productos más vendidos</h2>
              </div>

              <div className="reporte-lista">

                <div>
                  <span>🥇 Cheesecake</span>
                  <strong>45 unidades</strong>
                </div>

                <div>
                  <span>🥈 Brownie</span>
                  <strong>38 unidades</strong>
                </div>

                <div>
                  <span>🥉 Tarta de Limón</span>
                  <strong>31 unidades</strong>
                </div>

                <div>
                  <span>🍪 Galletas</span>
                  <strong>24 unidades</strong>
                </div>

              </div>

            </div>

            <div className="admin-panel">

              <div className="panel-title">
                <h2>Pedidos por estado</h2>
              </div>

              <div className="reporte-lista">

                <div>
                  <span>🟡 Pendientes</span>
                  <strong>
                    {
                      pedidos.filter(
                        (p) => p.estado === "Pendiente"
                      ).length
                    }
                  </strong>
                </div>

                <div>
                  <span>🔵 En preparación</span>
                  <strong>
                    {
                      pedidos.filter(
                        (p) => p.estado === "En preparación"
                      ).length
                    }
                  </strong>
                </div>

                <div>
                  <span>🟢 Entregados</span>
                  <strong>
                    {
                      pedidos.filter(
                        (p) => p.estado === "Entregado"
                      ).length
                    }
                  </strong>
                </div>

                <div>
                  <span>🔴 Cancelados</span>
                  <strong>
                    {
                      pedidos.filter(
                        (p) => p.estado === "Cancelado"
                      ).length
                    }
                  </strong>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* CONFIGURACIÓN */}
        {seccionActiva === "configuracion" && (
          <section>

            <div className="configuracion-grid">

              <div className="admin-panel perfil-admin-panel">

                <div className="panel-title">
                  <h2>Perfil del administrador</h2>
                </div>

                <div className="foto-admin">

                  <div className="foto-admin-preview">

                    {perfil.foto ? (
                      <img
                        src={perfil.foto}
                        alt="Administrador"
                      />
                    ) : (
                      "A"
                    )}

                  </div>

                  <label className="btn-foto">
                    Cambiar foto

                    <input
                      type="file"
                      accept="image/*"
                      onChange={cambiarFoto}
                    />

                  </label>

                </div>

                <form
                  className="admin-form"
                  onSubmit={guardarPerfil}
                >

                  <label>
                    Nombre completo

                    <input
                      type="text"
                      name="nombre"
                      value={perfil.nombre}
                      onChange={actualizarPerfil}
                      required
                    />

                  </label>

                  <label>
                    Correo electrónico

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
                      maxLength="10"
                      required
                    />

                  </label>

                  <label>
                    Cargo

                    <input
                      type="text"
                      value={perfil.cargo}
                      disabled
                    />

                  </label>

                  <button
                    className="btn-principal guardar-btn"
                    type="submit"
                  >
                    Guardar cambios
                  </button>

                </form>

              </div>

              <div className="admin-panel seguridad-panel">

                <div className="panel-title">
                  <h2>Seguridad</h2>
                </div>

                <div className="seguridad-item">
                  <div>
                    <strong>Contraseña</strong>
                    <p>
                      Cambia la contraseña de administrador.
                    </p>
                  </div>

                  <button className="btn-editar">
                    Cambiar
                  </button>
                </div>

                <div className="seguridad-item">
                  <div>
                    <strong>Sesiones activas</strong>
                    <p>
                      Controla los dispositivos conectados.
                    </p>
                  </div>

                  <button className="btn-editar">
                    Ver sesiones
                  </button>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* MODAL PRODUCTO */}
      {mostrarModalProducto && (
        <div className="modal-overlay">

          <div className="admin-modal">

            <button
              className="modal-cerrar"
              onClick={() =>
                setMostrarModalProducto(false)
              }
            >
              ×
            </button>

            <h2>
              {productoEditar
                ? "Editar producto"
                : "Nuevo producto"}
            </h2>

            <form onSubmit={guardarProducto}>

              <label>
                Nombre del producto

                <input
                  type="text"
                  value={nuevoProducto.nombre}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      nombre: e.target.value,
                    })
                  }
                  required
                />

              </label>

              <label>
                Categoría

                <select
                  value={nuevoProducto.categoria}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      categoria: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">
                    Seleccionar categoría
                  </option>
                  <option>Postres</option>
                  <option>Tartas</option>
                  <option>Repostería</option>
                  <option>Bebidas</option>
                </select>

              </label>

              <label>
                Precio

                <input
                  type="number"
                  min="0"
                  value={nuevoProducto.precio}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      precio: e.target.value,
                    })
                  }
                  required
                />

              </label>

              <label>
                Stock

                <input
                  type="number"
                  min="0"
                  value={nuevoProducto.stock}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      stock: e.target.value,
                    })
                  }
                  required
                />

              </label>

              <div className="modal-botones">

                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() =>
                    setMostrarModalProducto(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-principal"
                >
                  {productoEditar
                    ? "Guardar cambios"
                    : "Crear producto"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default DashboardAdministrador;