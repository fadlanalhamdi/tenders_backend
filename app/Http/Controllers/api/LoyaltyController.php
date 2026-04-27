<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Loyalty;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    public function index() {
        return response()->json(['success' => true, 'data' => Loyalty::all()]);
    }

    public function store(Request $request) {
        $data = Loyalty::create($request->all());
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(Request $request, $id) {
        $loyalty = Loyalty::findOrFail($id);
        $loyalty->update($request->all());
        return response()->json(['success' => true, 'data' => $loyalty]);
    }

    public function destroy($id) {
        Loyalty::destroy($id);
        return response()->json(['success' => true, 'message' => 'Tier berhasil dihapus']);
    }
}
