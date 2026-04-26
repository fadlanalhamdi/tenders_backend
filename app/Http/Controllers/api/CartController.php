<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }
        
        $cart = Cart::where('user_id', $request->user()->id)
                    ->with('product')
                    ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'items' => $cart,
                'count' => $cart->sum('quantity')
            ]
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }
        
        try {
            $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);
            
            $cart = Cart::where('user_id', $request->user()->id)
                        ->where('product_id', $request->product_id)
                        ->first();
            
            if ($cart) {
                $cart->quantity += $request->quantity;
                $cart->save();
            } else {
                $cart = Cart::create([
                    'user_id' => $request->user()->id,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Product added to cart'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

     //============================================
    // UPDATE METHOD - INI YANG PENTING
    // ============================================
    public function update(Request $request, $id)
    {
        Log::info('Cart update called', ['id' => $id, 'user_id' => $request->user()?->id, 'quantity' => $request->quantity]);
        
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }
        
        try {
            $cart = Cart::where('user_id', $request->user()->id)
                        ->where('id', $id)
                        ->first();
            
            if (!$cart) {
                return response()->json(['success' => false, 'error' => 'Cart item not found'], 404);
            }
            
            $quantity = $request->quantity;
            
            if ($quantity <= 0) {
                $cart->delete();
                return response()->json(['success' => true, 'message' => 'Item removed']);
            } else {
                $cart->quantity = $quantity;
                $cart->save();
                return response()->json([
                    'success' => true,
                    'message' => 'Quantity updated',
                    'data' => $cart
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Cart update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        Log::info('Cart delete called', ['id' => $id, 'user_id' => $request->user()?->id]);
        
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }
        
        try {
            $cart = Cart::where('user_id', $request->user()->id)
                        ->where('id', $id)
                        ->first();
            
            if ($cart) {
                $cart->delete();
                return response()->json(['success' => true, 'message' => 'Item removed']);
            }
            
            return response()->json(['success' => false, 'error' => 'Item not found'], 404);
        } catch (\Exception $e) {
            Log::error('Cart delete error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function count(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }
        
        $count = Cart::where('user_id', $request->user()->id)->sum('quantity');
        
        return response()->json([
            'success' => true,
            'data' => ['count' => $count]
        ]);
    }
}