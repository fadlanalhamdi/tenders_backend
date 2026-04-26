<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('rating')->default(5);
            $table->text('comment');
            $table->string('avatar')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
        
        // Insert default testimonials
        DB::table('testimonials')->insert([
            ['name' => 'Ahmad R.', 'rating' => 5, 'comment' => 'Chicken tender-nya crispy banget! Level 3 bikin nagih. Recommended!', 'status' => 'active'],
            ['name' => 'Sarah M.', 'rating' => 5, 'comment' => 'Hot Mozzville-nya lumer dan cheese pull-nya puas! Bakal balik lagi.', 'status' => 'active'],
            ['name' => 'Budi W.', 'rating' => 4, 'comment' => 'Enak banget, cuma antreannya lumayan. Tapi worth it!', 'status' => 'active'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};