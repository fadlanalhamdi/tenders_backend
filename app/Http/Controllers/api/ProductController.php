<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $query = Product::query()->where('status', 'active');

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter popular products
        if ($request->has('popular') && $request->popular == 'true') {
            $query->where('is_popular', true);
        }

        // Filter new products
        if ($request->has('new') && $request->new == 'true') {
            $query->where('is_new', true);
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->orderBy('is_popular', 'desc')
                         ->orderBy('created_at', 'desc')
                         ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'original_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'image_url' => 'nullable|string',
            'is_popular' => 'boolean',
            'is_new' => 'boolean',
            'spice_level' => 'nullable|integer|min:0|max:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

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
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $product = Product::where('id', $id)->where('status', 'active')->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'original_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'image_url' => 'nullable|string',
            'is_popular' => 'boolean',
            'is_new' => 'boolean',
            'spice_level' => 'nullable|integer|min:0|max:3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        $product->update([
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
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified product (soft delete).
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'error' => 'Product not found'
            ], 404);
        }

        // Soft delete - set status to inactive
        $product->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get product statistics.
     */
    public function stats()
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();
        $lowStock = Product::where('stock', '>', 0)->where('stock', '<=', 20)->count();
        $outOfStock = Product::where('stock', 0)->count();
        
        // Products by category
        $categories = [
            'tender' => Product::where('category', 'tender')->count(),
            'mozzville' => Product::where('category', 'mozzville')->count(),
            'sides' => Product::where('category', 'sides')->count(),
            'beverages' => Product::where('category', 'beverages')->count(),
            'sauce' => Product::where('category', 'sauce')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'low_stock' => $lowStock,
                'out_of_stock' => $outOfStock,
                'by_category' => $categories
            ]
        ]);
    }
}