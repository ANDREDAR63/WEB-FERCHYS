import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import './dashboard.css';

function paymentInfo(order) {
  const approved = order.payments?.find((payment) => payment.status === 'approved');
  if (approved) return { label: 'Pagado', detail: approved.paymentMethod?.name || 'Pago aprobado', className: 'dashboard-alert--ok' };
  return { label: 'Cobro contra entrega', detail: 'No hay pago aprobado', className: 'dashboard-alert--critical' };
}

function deliveredAt(order) {
  const history = [...(order.statusHistory || [])].reverse().find((item) => item.new_status === 'delivered');
  return history?.created_at || null;
}

export default function CourierDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [lastDelivered, setLastDelivered] = useState(null);

  async function loadOrders() {
    try {
      setOrders(await apiRequest('/orders'));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const data = await apiRequest('/orders');
        if (active) {
          setOrders(data);
          setError('');
        }
      } catch (err) {
        if (active) setError(err.message);
      }
    };

    refresh();
    const interval = setInterval(refresh, 30000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  async function confirmDelivery(order) {
    setLoadingId(order.id);
    try {
      const updatedOrder = await apiRequest(`/orders/${order.id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'delivered' }) });
      const deliveredHistory = deliveredAt(updatedOrder) || new Date().toISOString();
      setLastDelivered({ id: order.id, at: deliveredHistory });
      await loadOrders();
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
            <h1>Repartos</h1>
            <p>Pedidos listos para entrega y confirmación de recepción.</p>
          </div>
        </div>

        {error && <p className="dashboard-error">{error}</p>}
        {lastDelivered && <p className="dashboard-confirmation">Pedido #{lastDelivered.id} entregado correctamente a las {new Date(lastDelivered.at).toLocaleString()}.</p>}

        <section className="dashboard-panel dashboard-section">
          <h2>Cola de entregas</h2>
          {orders.length === 0 ? <p className="dashboard-empty">No hay pedidos listos para entregar.</p> : <div className="dashboard-table-wrap"><table className="dashboard-table"><thead><tr><th>Pedido</th><th>Cliente y contacto</th><th>Dirección</th><th>Detalle</th><th>Pago</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{orders.map((order) => { const payment = paymentInfo(order); return <tr key={order.id}><td>#{order.id}<br /><span className="dashboard-muted">${order.total}</span></td><td><strong>{order.user?.name || 'Cliente'}</strong><br /><span className="dashboard-muted">{order.user?.phone || 'Teléfono no registrado'}</span><br /><span className="dashboard-muted">{order.user?.email || ''}</span></td><td>{order.address?.full_address || 'Dirección no registrada'}<br /><span className="dashboard-muted">{order.address?.city || ''}</span></td><td><details className="dashboard-recipe"><summary>{order.items?.length || 0} producto(s)</summary><ul>{order.items?.map((item) => <li key={item.id}>{item.quantity} x {item.product?.name || 'Producto'} (${item.unit_price})</li>)}</ul></details></td><td><span className={`dashboard-alert ${payment.className}`}>{payment.label}</span><br /><span className="dashboard-muted">{payment.detail}</span></td><td><span className="status">Listo para entrega</span></td><td><button type="button" disabled={loadingId === order.id} onClick={() => confirmDelivery(order)}>{loadingId === order.id ? 'Confirmando...' : 'Marcar entregado'}</button></td></tr>; })}</tbody></table></div>}
        </section>

        <section className="dashboard-panel dashboard-section">
          <h2>Seguimiento de entrega</h2>
          <p className="dashboard-muted">Los cambios de estado quedan registrados en el historial del pedido. El sistema actual usa <strong>shipped</strong> como pedido listo/en ruta y <strong>delivered</strong> como entrega confirmada.</p>
          {lastDelivered && <p className="dashboard-muted">Última entrega confirmada: pedido #{lastDelivered.id}, <time dateTime={lastDelivered.at}>{new Date(lastDelivered.at).toLocaleString()}</time>.</p>}
        </section>
      </div>
    </section>
  );
}
