<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Jika admin, tampilkan semua order
        // Jika customer, tampilkan hanya order miliknya
        if ($user && $user->role === 'admin') {
            $orders = Order::with('items.product')
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $orders = Order::with('items.product')
                ->where('user_id', $user?->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        // Tambahkan customer_name jika tidak ada
        foreach ($orders as $order) {
            if (!$order->customer_name && $order->user) {
                $order->customer_name = $order->user->full_name ?? $order->user->username;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

     // Di method update, pastikan notifikasi dibuat
public function update(Request $request, $id)
{
    try {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json(['success' => false, 'error' => 'Order not found'], 404);
        }
        
        $oldStatus = $order->status;
        $newStatus = $request->status;
        
        $order->status = $newStatus;
        $order->save();
        
        // Kirim notifikasi ke customer jika status berubah
        if ($oldStatus !== $newStatus && $order->user_id) {
            $notificationMessages = [
                'processing' => [
                    'title' => '🔄 Pesanan Diproses',
                    'message' => 'Pesanan Anda sedang diproses oleh tim kami.'
                ],
                'completed' => [
                    'title' => '✅ Pesanan Selesai',
                    'message' => 'Pesanan Anda telah selesai. Terima kasih telah berbelanja!'
                ],
                'cancelled' => [
                    'title' => '❌ Pesanan Dibatalkan',
                    'message' => 'Pesanan Anda telah dibatalkan.'
                ]
            ];
            
            $notif = $notificationMessages[$newStatus] ?? [
                'title' => 'Status Pesanan Diperbarui',
                'message' => "Status pesanan Anda berubah menjadi " . ucfirst($newStatus)
            ];
            
            Notification::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'title' => $notif['title'],
                'message' => $notif['message'],
                'type' => 'order',
                'is_read' => false,
            ]);
            
            Log::info("Notification created for user {$order->user_id}, order {$order->id}, status: {$newStatus}");
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
        
    } catch (\Exception $e) {
        Log::error('Order update failed: ' . $e->getMessage());
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}

// Tambahkan method untuk mendapatkan jumlah notifikasi belum dibaca
public function unreadCount(Request $request)
{
    $count = Notification::where('user_id', $request->user()->id)
                         ->where('is_read', false)
                         ->count();
    
    return response()->json([
        'success' => true,
        'data' => ['count' => $count]
    ]);
}
    
    // Get notifications for user
    public function getNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
                                     ->orderBy('created_at', 'desc')
                                     ->get();
        
        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }
    
    // Get unread count
    
    
    // Mark as read
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
                                    ->where('id', $id)
                                    ->first();
        
        if ($notification) {
            $notification->update(['is_read' => true]);
        }
        
        return response()->json(['success' => true]);
    }
    
    // Mark all as read
    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
                    ->where('is_read', false)
                    ->update(['is_read' => true]);
        
        return response()->json(['success' => true]);
    }

    public function show($id)
    {
        $order = Order::with('items.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'error' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    // Create new order
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = $request->user();

            $order = Order::create([
                'order_number' => $request->order_number ?? 'ORD-' . strtoupper(uniqid()),
                'user_id' => $user?->id ?? 1,
                'customer_name' => $request->customer_name ?? ($user?->full_name ?? $user?->username),
                'total_amount' => $request->total_amount,
                'status' => $request->status ?? 'pending',
                'shipping_method' => $request->shipping_method ?? 'pickup',
                'payment_method' => $request->payment_method,
                'source' => $request->source ?? 'offline',
                'notes' => $request->notes,
            ]);

            if ($request->has('items')) {
                foreach ($request->items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => $order
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function destroy($id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'error' => 'Order not found'
                ], 404);
            }

            OrderItem::where('order_id', $id)->delete();
            $order->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Order deletion failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}