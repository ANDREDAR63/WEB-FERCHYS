const GUEST_CART_KEY = 'ferchys-carrito';

export function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
  } catch {
    return [];
  }
}

export function writeGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function itemQuantity(item) {
  return Number(item?.quantity ?? item?.cantidad ?? 0);
}

export function upsertGuestItem(items, product, quantity) {
  const existingItem = items.find((item) => item.product_id === product.id);
  if (quantity <= 0) return items.filter((item) => item.product_id !== product.id);
  if (existingItem) {
    return items.map((item) => item.product_id === product.id ? { ...item, quantity, cantidad: quantity } : item);
  }
  return [...items, { id: `guest-${product.id}`, product_id: product.id, quantity, cantidad: quantity, product }];
}