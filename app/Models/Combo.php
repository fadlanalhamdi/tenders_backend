<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{
    protected $fillable = [
        'name', 'description', 'items', 'price', 'original_price',
        'image_url', 'discount', 'is_active', 'order'

    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
    ];
    
    // Accessor untuk mendapatkan harga promo
    public function getPromoPriceAttribute()
    {
        return $this->price;
    }
    
    // Accessor untuk diskon persen
    public function getDiscountPercentAttribute()
    {
        if ($this->original_price && $this->original_price > 0) {
            return round((($this->original_price - $this->price) / $this->original_price) * 100);
        }
        return 0;
    }
}