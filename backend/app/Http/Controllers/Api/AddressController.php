<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->addresses;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:50',
            'full_address' => 'required|string|max:255',
            'city' => 'nullable|string|max:100',
            'is_default' => 'sometimes|boolean',
        ]);

        $address = $request->user()->addresses()->create($validated);

        return response()->json($address, 201);
    }
}
