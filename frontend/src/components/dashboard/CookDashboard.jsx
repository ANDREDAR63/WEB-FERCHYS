import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import './dashboard.css';

const statusLabels = { pending: 'Pendiente', preparing: 'En preparación', shipped: 'Listo para entrega' };

function sortOrders(orders) {
  return [...orders].sort((first, second) => new Date(first.created_at) - new Date(second.created_at));
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Sin fecha';
}

function getRequirements(order) {
  const requirements = new Map();

  order.items?.forEach((item) => {
    item.product?.ingredients?.forEach((ingredient) => {
      const required = Number(ingredient.pivot?.quantity_required || 0) * Number(item.quantity || 0);
      const current = requirements.get(ingredient.id) || {
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        currentStock: Number(ingredient.current_stock || 0),
        required: 0,
      };
      current.required += required;
      requirements.set(ingredient.id, current);
    });
  });

  return [...requirements.values()];
}

function isInsufficient(order) {
  return getRequirements(order).some((ingredient) => ingredient.required > ingredient.currentStock);
}

export default function CookDashboard() {
  const [orders, setOrders] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  async function loadData() {
    try {
      const [orderData, ingredientData] = await Promise.all([apiRequest('/orders'), apiRequest('/ingredients')]);
      setOrders(sortOrders(orderData));
      setIngredients(ingredientData);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const [orderData, ingredientData] = await Promise.all([apiRequest('/orders'), apiRequest('/ingredients')]);
        if (!active) return;
        setOrders(sortOrders(orderData));
        setIngredients(ingredientData);
        setError('');
      } catch (err) {
        if (active) setError(err.message);
      }
    };

    refresh();
    const interval = setInterval(refresh, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  async function updateStatus(order) {
    const nextStatus = order.status === 'pending' ? 'preparing' : 'shipped';
    setLoadingId(order.id);
    try {
      await apiRequest(`/orders/${order.id}/status`, { method: 'PUT', body: JSON.stringify({ status: nextStatus }) });
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-shell">
        <div className="dashboard-heading">
          <div>
            <h1>Cocina</h1>
            <p>Cola de preparación e inventario actualizado.</p>
          </div>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <section className="dashboard-panel dashboard-section">
          <h2>Cola de pedidos</h2>
          {orders.length === 0 ? <p className="dashboard-empty">No hay pedidos pagados pendientes de preparación.</p> : (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead><tr><th>Pedido</th><th>Cliente</th><th>Creado</th><th>Productos y receta</th><th>Estado</th><th>Insumos</th><th>Acción</th></tr></thead>
                <tbody>{orders.map((order) => {
                  const requirements = getRequirements(order);
                  const insufficient = isInsufficient(order);
                  return <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.name || 'Cliente'}</td>
                    <td><time dateTime={order.created_at}>{formatDate(order.created_at)}</time></td>
                    <td><details className="dashboard-recipe"><summary>{order.items?.length || 0} producto(s)</summary>{order.items?.map((item) => <div className="dashboard-recipe-item" key={item.id}><strong>{item.quantity} x {item.product?.name || 'Producto'}</strong>{item.product?.ingredients?.length ? <ul>{item.product.ingredients.map((ingredient) => <li key={ingredient.id}>{ingredient.name}: {ingredient.pivot?.quantity_required} {ingredient.unit} por unidad</li>)}</ul> : <span className="dashboard-muted">Receta sin insumos registrados.</span>}</div>)}</details></td>
                    <td><span className="status">{statusLabels[order.status] || order.status}</span></td>
                    <td>{insufficient ? <span className="dashboard-alert dashboard-alert--critical">Stock insuficiente</span> : <span className="dashboard-alert dashboard-alert--ok">Disponible</span>}<details className="dashboard-recipe"><summary>Ver consumo</summary><ul>{requirements.map((ingredient) => <li key={ingredient.id}>{ingredient.name}: {ingredient.required} {ingredient.unit} de {ingredient.currentStock} disponibles</li>)}</ul></details></td>
                    <td><button type="button" disabled={loadingId === order.id} onClick={() => updateStatus(order)}>{loadingId === order.id ? 'Actualizando...' : (order.status === 'pending' ? 'Iniciar preparación' : 'Marcar entregado a repartidor')}</button></td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="dashboard-panel dashboard-section">
          <h2>Insumos disponibles</h2>
          <p className="dashboard-muted">El stock se consulta desde el inventario central. La reposición y el descuento automático requieren una operación habilitada para este rol en la API.</p>
          {ingredients.length === 0 ? <p className="dashboard-empty">No hay ingredientes registrados.</p> : <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Ingrediente</th><th>Unidad</th><th>Stock actual</th><th>Stock mínimo</th><th>Estado</th></tr></thead><tbody>{ingredients.map((ingredient) => { const low = Number(ingredient.current_stock) <= Number(ingredient.minimum_stock); return <tr key={ingredient.id}><td>{ingredient.name}</td><td>{ingredient.unit}</td><td className={low ? 'stock-low' : ''}>{ingredient.current_stock}</td><td>{ingredient.minimum_stock}</td><td>{low ? <span className="dashboard-alert dashboard-alert--critical">Stock bajo</span> : <span className="dashboard-alert dashboard-alert--ok">Disponible</span>}</td></tr>; })}</tbody></table></div>}
        </section>
      </div>
    </section>
  );
}
