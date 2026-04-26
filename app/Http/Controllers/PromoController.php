<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('status', 'active');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $products = $query->orderBy('is_popular', 'desc')
                         ->orderBy('created_at', 'desc')
                         ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function store(Request $request)
    {
        // Debug log untuk cek user yang login
        Log::info('Store product called by user: ' . (auth()->user() ? auth()->user()->id : 'Not authenticated'));
        Log::info('Request data: ', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        try {
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'original_price' => $request->original_price,
                'category' => $request->category,
                'image_url' => $request->image_url ?? '/images/default-product.png',
                'stock' => $request->stock ?? 99,
                'is_popular' => $request->is_popular ?? false,
                'is_new' => $request->is_new ?? false,
                'spice_level' => $request->spice_level ?? 0,
                'status' => 'active',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating product: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Database error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function categories()
    {
        $categories = [
            ['name' => 'Semua', 'value' => 'all', 'icon' => '/images/all-icon.png', 'count' => Product::where('status', 'active')->count()],
            ['name' => 'Chicken Tender', 'value' => 'tender', 'icon' => '/images/chicken-tender-icon.png', 'count' => Product::where('category', 'tender')->where('status', 'active')->count()],
            ['name' => 'Hot Mozzville', 'value' => 'mozzville', 'icon' => '/images/mozzville-icon.png', 'count' => Product::where('category', 'mozzville')->where('status', 'active')->count()],
            ['name' => 'Sides', 'value' => 'sides', 'icon' => '/images/sides-icon.png', 'count' => Product::where('category', 'sides')->where('status', 'active')->count()],
            ['name' => 'Beverages', 'value' => 'beverages', 'icon' => '/images/drinks-icon.png', 'count' => Product::where('category', 'beverages')->where('status', 'active')->count()],
            ['name' => 'Sauce', 'value' => 'sauce', 'icon' => '/images/sauce-icon.png', 'count' => Product::where('category', 'sauce')->where('status', 'active')->count()],
        ];

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}