<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        $query = Promotion::with('product');

        if ($request->user()?->role !== 'admin') {
            $query->whereDate('start_date', '<=', now())
                ->whereDate('end_date', '>=', now());
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'nullable|exists:products,id',
            'name' => 'required|string|max:100',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        return response()->json(Promotion::create($validated)->load('product'), 201);
    }

    public function show(Promotion $promotion)
    {
        return $promotion->load('product');
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|nullable|exists:products,id',
            'name' => 'sometimes|required|string|max:100',
            'discount_percentage' => 'sometimes|numeric|min:0|max:100',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        $promotion->update($validated);

        return response()->json($promotion->load('product'));
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return response()->json(null, 204);
    }
}
