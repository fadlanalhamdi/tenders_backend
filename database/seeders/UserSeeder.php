<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'username' => 'customer1',
                'email' => 'customer1@example.com',
                'password' => Hash::make('customer123'),
                'full_name' => 'Customer Satu',
                'phone' => '081234567890',
                'address' => 'Jl. Contoh No. 1',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'azizha',
                'email' => 'azizha@example.com',
                'password' => Hash::make('azizha123'),
                'full_name' => 'Azizha Nur',
                'phone' => '081234567891',
                'address' => 'Jl. Hangtuah No. 2',
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}