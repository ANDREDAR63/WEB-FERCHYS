<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::query()->select(['id', 'name', 'email', 'role', 'active'])->latest()->get();
    }
}