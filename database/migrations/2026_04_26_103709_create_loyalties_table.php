<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('loyalties', function (Blueprint $table) {
        $table->id();
        $table->string('level');       // Classic, Silver, Gold, Platinum
        $table->string('criteria');    // Beli 5 porsi, dll
        $table->string('points');      // 1 Porsi = 10 Poin
        $table->text('benefits');      // Simpan sebagai string (nanti di-explode di front)
        $table->string('color');       // Kode Hex Warna
        $table->integer('count')->default(0);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalties');
    }
};
