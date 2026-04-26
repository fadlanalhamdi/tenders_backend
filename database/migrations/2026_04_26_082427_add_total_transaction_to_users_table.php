<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Kita tambahkan membership dulu, baru total_transaction
        if (!Schema::hasColumn('users', 'membership')) {
            $table->enum('membership', ['Classic', 'Silver', 'Gold', 'Platinum'])->default('Classic')->after('role');
        }

        if (!Schema::hasColumn('users', 'total_transaction')) {
            $table->decimal('total_transaction', 15, 2)->default(0)->after('membership');
        }
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['membership', 'total_transaction']);
    });
}
};
