<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BannerSeeder extends Seeder
{
    public function run()
    {
        DB::table('banners')->insert([
            [
                'title' => 'Coming Soon',
                'image' => '/images/tenders-banner-1.jpg',
                'link' => '/promo',
                'order' => 1,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Big Sale Promo',
                'image' => '/images/tenders-banner-2.jpg',
                'link' => '/promo',
                'order' => 2,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Free Delivery',
                'image' => '/images/tenders-banner-3.jpg',
                'link' => '/promo',
                'order' => 3,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
           
        ]);
    }
}