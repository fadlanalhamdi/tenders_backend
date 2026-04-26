<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Combo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ComboController extends Controller
{
    // Get all combos (for user)
    public function index()
    {
        $combos = Combo::where('is_active', true)
                       ->orderBy('order')
                       ->orderBy('created_at', 'desc')
                       ->get();
        
        return response()->json([
            'success' => true,
            'data' => $combos
        ]);
    }
    
    // Get all combos for admin (including inactive)
    public function adminIndex()
    {
        $combos = Combo::orderBy('order')
                       ->orderBy('created_at', 'desc')
                       ->get();
        
        return response()->json([
            'success' => true,
            'data' => $combos
        ]);
    }
    
    // Get single combo
    public function show($id)
    {
        $combo = Combo::find($id);
        
        if (!$combo) {
            return response()->json([
                'success' => false,
                'error' => 'Combo not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $combo
        ]);
    }
    
    // Create new combo
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'items' => 'required|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'image_url' => 'nullable|string',
            'discount' => 'nullable|integer|min:0|max:100',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }
        
        $combo = Combo::create([
            'name' => $request->name,
            'description' => $request->description,
            'items' => $request->items,
            'price' => $request->price,
            'original_price' => $request->original_price,
            'image_url' => $request->image_url ?? '/images/combo-default.png',
            'discount' => $request->discount ?? 0,
            'is_active' => $request->is_active ?? true,
            'order' => $request->order ?? 0,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Combo created successfully',
            'data' => $combo
        ], 201);
    }
    
    // Update combo
    public function update(Request $request, $id)
    {
        $combo = Combo::find($id);
        
        if (!$combo) {
            return response()->json([
                'success' => false,
                'error' => 'Combo not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'items' => 'required|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'image_url' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first()
            ], 422);
        }
        
        $combo->update([
            'name' => $request->name,
            'description' => $request->description,
            'items' => $request->items,
            'price' => $request->price,
            'original_price' => $request->original_price,
            'image_url' => $request->image_url ?? '/images/combo-default.png',
            'discount' => $request->discount ?? 0,
            'is_active' => $request->is_active ?? $combo->is_active,
            'order' => $request->order ?? $combo->order,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Combo updated successfully',
            'data' => $combo
        ]);
    }
    
    // Delete combo (hard delete)
    public function destroy($id)
    {
        $combo = Combo::find($id);
        
        if (!$combo) {
            return response()->json([
                'success' => false,
                'error' => 'Combo not found'
            ], 404);
        }
        
        $combo->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Combo deleted successfully'
        ]);
    }
    
    // Toggle status
    public function toggleStatus($id)
    {
        $combo = Combo::find($id);
        
        if (!$combo) {
            return response()->json([
                'success' => false,
                'error' => 'Combo not found'
            ], 404);
        }
        
        $combo->is_active = !$combo->is_active;
        $combo->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Combo status updated',
            'data' => $combo
        ]);
    }
}