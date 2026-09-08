<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index()
    {
        return Ingredient::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'unit' => 'required|string|max:20',
            'current_stock' => 'sometimes|numeric|min:0',
            'minimum_stock' => 'sometimes|numeric|min:0',
        ]);

        return response()->json(Ingredient::create($validated), 201);
    }

    public function show(Ingredient $ingredient)
    {
        return $ingredient->load('products');
    }

    public function update(Request $request, Ingredient $ingredient)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'unit' => 'sometimes|required|string|max:20',
            'current_stock' => 'sometimes|numeric|min:0',
            'minimum_stock' => 'sometimes|numeric|min:0',
        ]);

        $ingredient->update($validated);

        return response()->json($ingredient);
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();

        return response()->json(null, 204);
    }
}
