<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Original Chicken Tender',
                'description' => 'Chicken tender juicy crispy dengan bumbu original',
                'price' => 25000,
                'original_price' => 30000,
                'category' => 'tender',
                'image_url' => '/images/original-tender.png',
                'stock' => 99,
                'is_popular' => true,
                'spice_level' => 0,
            ],
            [
                'name' => 'Nashville Hot Tender',
                'description' => 'Pedas khas Nashville level 1',
                'price' => 28000,
                'original_price' => 33000,
                'category' => 'tender',
                'image_url' => '/images/nashville-tender.png',
                'stock' => 85,
                'is_popular' => true,
                'spice_level' => 1,
            ],
            [
                'name' => 'Hot Mozzville Original',
                'description' => 'Mozzarella melt dengan chicken tender',
                'price' => 32000,
                'original_price' => 38000,
                'category' => 'mozzville',
                'image_url' => '/images/mozzville.png',
                'stock' => 45,
                'is_popular' => true,
                'spice_level' => 0,
            ],
            [
                'name' => 'Crispy Fries',
                'description' => 'Kentang goreng crispy',
                'price' => 15000,
                'original_price' => 18000,
                'category' => 'sides',
                'image_url' => '/images/fries.png',
                'stock' => 200,
                'is_popular' => false,
                'spice_level' => 0,
            ],
            [
                'name' => 'Lemon Tea',
                'description' => 'Teh lemon segar',
                'price' => 8000,
                'original_price' => 10000,
                'category' => 'beverages',
                'image_url' => '/images/lemon-tea.png',
                'stock' => 100,
                'is_popular' => false,
                'spice_level' => 0,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert(array_merge($product, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}