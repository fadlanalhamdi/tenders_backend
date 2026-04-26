<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComplaintController extends Controller
{
    // ========== UNTUK PELANGGAN (PUBLIC) ==========
    
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email',
                'phone' => 'nullable|string|max:20',
                'complaint_type' => 'required|string',
                'rating' => 'nullable|integer|min:0|max:5',
                'message' => 'required|string|min:3',
            ]);

            $complaint = Complaint::create([
                'user_id' => Auth::id(),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'complaint_type' => $request->complaint_type,
                'rating' => $request->rating ?? 0,
                'message' => $request->message,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengaduan berhasil dikirim',
                'data' => $complaint
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ========== UNTUK ADMIN ==========
    
    public function index(Request $request)
    {
        $complaints = Complaint::with('user')->orderBy('created_at', 'desc')->paginate(20);
        
        $stats = [
            'total' => Complaint::count(),
            'pending' => Complaint::where('status', 'pending')->count(),
            'responded' => Complaint::where('status', 'responded')->count(),
            'resolved' => Complaint::where('status', 'resolved')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $complaints,
            'stats' => $stats
        ]);
    }

    public function stats()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'total' => Complaint::count(),
                'pending' => Complaint::where('status', 'pending')->count(),
                'responded' => Complaint::where('status', 'responded')->count(),
                'resolved' => Complaint::where('status', 'resolved')->count(),
            ]
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);
        $complaint->status = $request->status;
        $complaint->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated'
        ]);
    }

    public function respond(Request $request, $id)
    {
        $request->validate([
            'admin_response' => 'required|string'
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->admin_response = $request->admin_response;
        $complaint->status = 'responded';
        $complaint->responded_at = now();
        $complaint->save();

        return response()->json([
            'success' => true,
            'message' => 'Response sent'
        ]);
    }

    public function destroy($id)
    {
        $complaint = Complaint::findOrFail($id);
        $complaint->delete();

        return response()->json([
            'success' => true,
            'message' => 'Complaint deleted'
        ]);
    }
}