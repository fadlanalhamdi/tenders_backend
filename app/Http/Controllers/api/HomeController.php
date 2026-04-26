<?php
// app/Http/Controllers/Api/HomeController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Banner;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    // Get all data for homepage
    public function index()
    {
       // Ambil banner dari database
        $banners = Banner::where('status', 'active')
                         ->orderBy('order')
                         ->get();
        
        // Jika tidak ada banner, gunakan default
        if ($banners->isEmpty()) {
            $banners = collect([
                ['id' => 1, 'image' => '/images/tenders-banner-1.jpg', 'title' => 'Coming Soon'],
                ['id' => 2, 'image' => '/images/tenders-banner-2.jpg', 'title' => 'Big Sale Promo'],
                ['id' => 3, 'image' => '/images/tenders-banner-3.jpg', 'title' => 'Free Delivery'],
            ]);
        }
        
       

        
        
        // Get popular products
        $popularProducts = Product::where('status', 'active')
                                 ->where('is_popular', true)
                                 ->orderBy('created_at', 'desc')
                                 ->limit(8)
                                 ->get();
        
        // Get new products
        $newProducts = Product::where('status', 'active')
                             ->where('is_new', true)
                             ->orderBy('created_at', 'desc')
                             ->limit(4)
                             ->get();
        
        // Get testimonials
        $testimonials = Testimonial::where('status', 'active')
                                   ->orderBy('created_at', 'desc')
                                   ->get();
        
        // If no testimonials, use default
        if ($testimonials->isEmpty()) {
            $testimonials = collect([
                ['id' => 1, 'name' => 'Ahmad R.', 'rating' => 5, 'comment' => 'Chicken tender-nya crispy banget! Level 3 bikin nagih. Recommended!', 'date' => '2 hari lalu'],
                ['id' => 2, 'name' => 'Sarah M.', 'rating' => 5, 'comment' => 'Hot Mozzville-nya lumer dan cheese pull-nya puas! Bakal balik lagi.', 'date' => '5 hari lalu'],
                ['id' => 3, 'name' => 'Budi W.', 'rating' => 4, 'comment' => 'Enak banget, cuma antreannya lumayan. Tapi worth it!', 'date' => '1 minggu lalu'],
            ]);
        }
        
        // Get store info
        $storeInfo = [
            'operational_hours' => '15.00 - Sold Out',
            'address' => 'Jl. Hangtuah (Depan Plaza Kado), Pekanbaru, Riau',
            'phone' => '+62 813 7823 7282',
            'delivery_partners' => ['GoFood', 'ShopeeFood']
        ];
        
        return response()->json([
            'success' => true,
            'data' => [
                'banners' => $banners,
                'popular_products' => $popularProducts,
                'new_products' => $newProducts,
                'testimonials' => $testimonials,
                'store_info' => $storeInfo
            ]
        ]);
    }
}