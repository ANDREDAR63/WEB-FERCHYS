<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return User::query()->select(['id', 'name', 'email', 'role', 'active'])->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'client', 'cook', 'courier'])],
            'phone' => 'nullable|string|max:20',
            'active' => 'sometimes|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        return response()->json(User::create($validated)->only(['id', 'name', 'email', 'role', 'phone', 'active']), 201);
    }

    public function show(User $user)
    {
        return $user->only(['id', 'name', 'email', 'role', 'phone', 'active']);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($user)],
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'active' => 'sometimes|boolean',
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'phone', 'active']));
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'client', 'cook', 'courier'])],
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'phone', 'active']));
    }
}