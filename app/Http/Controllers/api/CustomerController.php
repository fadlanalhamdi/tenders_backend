<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // 1. Ambil Semua Data Pelanggan
public function index()
{
    try {
        $customers = User::where('role', 'user')->orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'data' => $customers]);
    } catch (\Exception $e) {
        // Ini akan memberitahu kita apa yang salah di log Laravel
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
}
    // 2. Tambah Pelanggan Baru (POST)
    public function store(Request $request)
    {
        $user = User::create([
            'full_name' => $request->full_name,
            'username'  => $request->username ?? explode('@', $request->email)[0],
            'email'     => $request->email,
            'phone'     => $request->phone,
            'membership'=> $request->membership ?? 'Classic',
            'password'  => bcrypt('password123'), // Default password
            'role'      => 'user'
        ]);

        return response()->json(['success' => true, 'message' => 'Member Tenders Berhasil Ditambah!', 'data' => $user]);
    }

    // 3. Update Data Pelanggan (PUT)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());

        return response()->json(['success' => true, 'message' => 'Data Tenders Diperbarui!']);
    }

    // 4. Hapus Pelanggan (DELETE)
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Member Berhasil Dihapus!']);
    }
}
