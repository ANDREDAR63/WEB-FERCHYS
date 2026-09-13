const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('ferchys-token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options, 
    headers: {
      Accept: 'application/json',
      ...(options.body && !(options.headers && options.headers['Content-Type'] === false) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || Object.values(data?.errors || {})[0]?.[0] || 'No se pudo completar la solicitud.');
  }

  return data;
}