<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loyalty extends Model
{
    protected $fillable = ['level', 'criteria', 'points', 'benefits', 'color', 'count'];
}
