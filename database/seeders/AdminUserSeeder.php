<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Hapus atau comment yang lama
        // DB::table('users')->insert([...]);
        
        // Gunakan kolom yang benar: 'full_name' bukan 'name'
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@tenderspku.com'],
            [
                'username' => 'admin',
                'email' => 'admin@tenderspku.com',
                'password' => Hash::make('admin123'),
                'full_name' => 'Administrator',
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}