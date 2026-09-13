<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
    public $timestamps = false;

    protected $fillable = ['product_id', 'name', 'discount_percentage', 'start_date', 'end_date'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
