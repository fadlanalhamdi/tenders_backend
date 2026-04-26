<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }

        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function show(Request $request, $id)
    {
        if (!$request->user()) {
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }

        $order = Order::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->with('items.product')
            ->first();

        if (!$order) {
            return response()->json(['success' => false, 'error' => 'Order not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function store(Request $request)
    {
        // Log request untuk debugging
        Log::info('=== ORDER STORE REQUEST ===');
        Log::info('Request data:', $request->all());

        if (!$request->user()) {
            Log::error('User not authenticated');
            return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
        }

        try {
            DB::beginTransaction();

            $user = $request->user();

            // Validasi items
            if (!$request->has('items') || empty($request->items)) {
                DB::rollBack();
                Log::error('No items in order');
                return response()->json(['success' => false, 'error' => 'Items are required'], 422);
            }

            // Generate order number
            $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            Log::info('Order number: ' . $orderNumber);

            // Siapkan data order
            $orderData = [
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'total_amount' => $request->total_amount ?? 0,
                'status' => 'pending',
                'shipping_method' => $request->shipping_method ?? 'delivery',
            ];

            // Tambahkan payment_method jika ada
            if ($request->has('payment_method')) {
                $orderData['payment_method'] = substr($request->payment_method, 0, 100);
            }

            // Tambahkan shipping_address jika ada
            if ($request->has('shipping_address') && $request->shipping_address) {
                $orderData['shipping_address'] = json_encode($request->shipping_address);
            }

            // Tambahkan notes jika ada
            if ($request->has('notes')) {
                $orderData['notes'] = $request->notes;
            }

            Log::info('Order data to save:', $orderData);

            // Create order
            $order = Order::create($orderData);
            Log::info('Order created with ID: ' . $order->id);

            // Create order items
            foreach ($request->items as $item) {
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ];
                Log::info('Creating order item:', $orderItemData);
                OrderItem::create($orderItemData);
            }

            // Clear cart items
            $productIds = collect($request->items)->pluck('product_id')->toArray();
            Log::info('Clearing cart items for products: ' . json_encode($productIds));

            Cart::where('user_id', $user->id)
                ->whereIn('product_id', $productIds)
                ->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}