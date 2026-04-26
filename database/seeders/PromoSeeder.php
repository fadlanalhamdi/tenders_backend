<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PromoSeeder extends Seeder
{
    public function run()
    {
        DB::table('promos')->insert([
            [
                'name' => 'Original Chicken Tender',
                'price' => 25000,
                'discount' => 10,
                'start_date' => '2024-12-01',
                'end_date' => '2024-12-31',
                'image_url' => '/images/original-tender.png',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nashville Hot Tender',
                'price' => 28000,
                'discount' => 15,
                'start_date' => '2024-12-10',
                'end_date' => '2024-12-20',
                'image_url' => '/images/nashville-tender.png',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hot Mozzville Original',
                'price' => 32000,
                'discount' => 20,
                'start_date' => '2024-12-15',
                'end_date' => '2024-12-25',
                'image_url' => '/images/mozzville.png',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}