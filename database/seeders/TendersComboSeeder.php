<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TendersComboSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('combos')->insert([
            'name' => 'Happy Hour Combo',
            'description' => 'Chicken Tender 3pcs + Spicy Wings 2pcs',
            'price' => 25000,
            'is_active' => 1,
            'items' => json_encode([
                ['item' => 'Chicken Tender', 'quantity' => 3],
                ['item' => 'Spicy Wings', 'quantity' => 2]
            ]),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $this->command->info('✅ Happy Hour Combo berhasil masuk!');
        $this->command->info('📦 Menu: Chicken Tender 3pcs + Spicy Wings 2pcs');
        $this->command->info('💰 Harga: Rp 25.000');
    }
}