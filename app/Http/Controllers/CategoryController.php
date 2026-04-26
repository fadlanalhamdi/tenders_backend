<?php
// app/Http/Controllers/Api/CategoryController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Get all categories with product count
    public function index()
    {
        $categories = [
            ['name' => 'Semua', 'value' => 'all', 'icon' => '/images/all-icon.png'],
            ['name' => 'Chicken Tender', 'value' => 'tender', 'icon' => '/images/chicken-tender-icon.png'],
            ['name' => 'Hot Mozzville', 'value' => 'mozzville', 'icon' => '/images/mozzville-icon.png'],
            ['name' => 'Sides', 'value' => 'sides', 'icon' => '/images/sides-icon.png'],
            ['name' => 'Beverages', 'value' => 'beverages', 'icon' => '/images/drinks-icon.png'],
            ['name' => 'Sauce', 'value' => 'sauce', 'icon' => '/images/sauce-icon.png'],
        ];
        
        // Add product count for each category
        foreach ($categories as &$category) {
            if ($category['value'] == 'all') {
                $category['count'] = Product::where('status', 'active')->count();
            } else {
                $category['count'] = Product::where('category', $category['value'])
                                           ->where('status', 'active')
                                           ->count();
            }
        }
        
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}