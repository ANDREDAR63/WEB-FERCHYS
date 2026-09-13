<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    public function store(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'No tienes permiso sobre este pedido.');
        }

        $validated = $request->validate([
            'payment_method_id' => 'required|exists:payment_methods,id',
        ]);

        if ($order->payments()->where('status', 'approved')->exists()) {
            throw ValidationException::withMessages([
                'order' => ['Este pedido ya tiene un pago aprobado.'],
            ]);
        }

        $payment = DB::transaction(function () use ($order, $validated) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method_id' => $validated['payment_method_id'],
                'amount' => $order->total,
                'status' => 'approved',
            ]);

            $order->update(['status' => 'preparing']);

            $order->statusHistory()->create([
                'previous_status' => 'pending',
                'new_status' => 'preparing',
            ]);

            return $payment;
        });

        return response()->json($payment->load('paymentMethod'), 201);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            abort(403, 'No tienes permiso sobre este pedido.');
        }

        return $order->payments()->with('paymentMethod')->get();
    }
}
