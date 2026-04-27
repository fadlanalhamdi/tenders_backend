<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    // Fungsi untuk mengambil data otomatis user tertentu sebelum prediksi
    public function getCustomerData($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan']);
        }

        // Hitung lama bergabung dalam bulan
        $joinDate = \Carbon\Carbon::parse($user->created_at);
        $lamaBergabung = $joinDate->diffInMonths(now());

        return response()->json([
            'success' => true,
            'data' => [
                'full_name' => $user->full_name,
                'membership' => $user->membership, // Classic, Silver, dll
                'total_transaction' => $user->total_transaction,
                'lama_bergabung' => $lamaBergabung
            ]
        ]);
    }
}
