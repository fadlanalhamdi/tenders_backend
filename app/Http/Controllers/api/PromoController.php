<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromoController extends Controller
{
    // Get all active promos
    public function index()
    {
        $promos = Promo::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $promos
        ]);
    }

    // Get single promo
    public function show($id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'success' => false,
                'error' => 'Promo not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $promo
        ]);
    }

    // Create new promo
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount' => 'required|integer|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        $promo = Promo::create([
            'name' => $request->name,
            'price' => $request->price,
            'discount' => $request->discount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'image_url' => $request->image_url ?? '/images/default-product.png',
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Promo created successfully',
            'data' => $promo
        ], 201);
    }

    // Update promo
    public function update(Request $request, $id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'success' => false,
                'error' => 'Promo not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount' => 'required|integer|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }

        $promo->update([
            'name' => $request->name,
            'price' => $request->price,
            'discount' => $request->discount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'image_url' => $request->image_url ?? '/images/default-product.png',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Promo updated successfully',
            'data' => $promo
        ]);
    }

    // Delete promo (soft delete - set status inactive)
    public function destroy($id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'success' => false,
                'error' => 'Promo not found'
            ], 404);
        }

        $promo->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Promo deleted successfully'
        ]);
    }
}