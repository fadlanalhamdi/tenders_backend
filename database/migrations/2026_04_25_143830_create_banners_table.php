<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image');
            $table->string('link')->nullable();
            $table->integer('order')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
        
        // Insert default banners
        DB::table('banners')->insert([
            ['title' => 'Coming Soon', 'image' => '/images/tenders-banner-1.jpg', 'order' => 1, 'status' => 'active'],
            ['title' => 'Big Sale Promo', 'image' => '/images/tenders-banner-2.jpg', 'order' => 2, 'status' => 'active'],
            ['title' => 'Free Delivery', 'image' => '/images/tenders-banner-3.jpg', 'order' => 3, 'status' => 'active'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};