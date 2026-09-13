<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Order::with('items.product', 'statusHistory', 'address', 'user');

        if ($user->role === 'client') {
            $query->where('user_id', $user->id);
        } elseif ($user->role === 'cook') {
            $query->whereIn('status', ['pending', 'preparing']);
        } elseif ($user->role === 'courier') {
            $query->where('status', 'shipped')
                ->where(function ($orders) use ($user) {
                    $orders->where('courier_id', $user->id)->orWhereNull('courier_id');
                });
        } elseif ($user->role !== 'admin') {
            abort(403, 'Rol no autorizado.');
        }

        return $query->latest()->get();
    }

    public function show(Request $request, Order $order)
    {
        if ($request->user()->role === 'client') {
            $this->authorizeOwner($request, $order);
        }

        return $order->load('items.product', 'payments', 'statusHistory', 'address');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
        ]);

        $cart = Cart::where('user_id', $request->user()->id)
            ->with('items.product')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => ['El carrito está vacío.'],
            ]);
        }

        $order = DB::transaction(function () use ($request, $cart, $validated) {
            $total = $cart->items->sum(fn ($item) => $item->quantity * $item->product->price);

            $order = Order::create([
                'user_id' => $request->user()->id,
                'address_id' => $validated['address_id'],
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->product->price,
                ]);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'previous_status' => null,
                'new_status' => 'pending',
            ]);

            $cart->items()->delete();

            return $order;
        });

        return response()->json($order->load('items.product'), 201);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,shipped,delivered,cancelled',
        ]);

        $role = $request->user()->role;
        $allowed = match ($role) {
            'cook' => ['pending' => ['preparing'], 'preparing' => ['shipped']],
            'courier' => ['shipped' => ['delivered']],
            'admin' => [
                'pending' => ['preparing', 'cancelled'],
                'preparing' => ['shipped', 'cancelled'],
                'shipped' => ['delivered', 'cancelled'],
            ],
            default => [],
        };

        if (! in_array($validated['status'], $allowed[$order->status] ?? [], true)) {
            abort(422, 'La transición de estado no está permitida para este rol.');
        }

        DB::transaction(function () use ($order, $validated) {
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'previous_status' => $order->status,
                'new_status' => $validated['status'],
            ]);

            $order->update(['status' => $validated['status']]);
        });

        return response()->json($order->load('statusHistory'));
    }

    private function authorizeOwner(Request $request, Order $order): void
    {
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            abort(403, 'No tienes permiso para ver este pedido.');
        }
    }
}
