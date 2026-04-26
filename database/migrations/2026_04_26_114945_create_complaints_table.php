<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->enum('complaint_type', [
                'keluhan', 'saran', 'kritik', 'pujian', 
                'laporkan_gagal_pesan', 'laporkan_pelayanan', 
                'laporkan_kualitas_makanan'
            ])->default('keluhan');
            $table->integer('rating')->default(0);
            $table->text('message');
            $table->enum('status', ['pending', 'read', 'responded', 'resolved'])->default('pending');
            $table->text('admin_response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};