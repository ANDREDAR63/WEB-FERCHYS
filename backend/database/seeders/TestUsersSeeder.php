<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrador Ferchys',
                'email' => 'admin@ferchys.com',
                'password' => 'Ferchy123!',
                'role' => 'admin',
                'phone' => '3000000001',
            ],
            [
                'name' => 'Cocinero Ferchys',
                'email' => 'cook@ferchys.com',
                'password' => 'Ferchy123!',
                'role' => 'cook',
                'phone' => '3000000002',
            ],
            [
                'name' => 'Repartidor Ferchys',
                'email' => 'courier@ferchys.com',
                'password' => 'Ferchy123!',
                'role' => 'courier',
                'phone' => '3000000003',
            ],
            [
                'name' => 'Cliente Ferchys',
                'email' => 'client@ferchys.com',
                'password' => 'Ferchy123!',
                'role' => 'client',
                'phone' => '3000000004',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role' => $user['role'],
                    'phone' => $user['phone'],
                    'active' => true,
                ]
            );
        }
    }
}
