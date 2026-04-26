<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    protected $fillable = [
        'name', 'price', 'discount', 'start_date', 'end_date', 'image_url', 'status'
    ];
    
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'price' => 'decimal:2',
    ];
    
    // Accessor untuk harga promo
    public function getPromoPriceAttribute()
    {
        return $this->price * (100 - $this->discount) / 100;
    }
}