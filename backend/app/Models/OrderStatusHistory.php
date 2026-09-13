<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatusHistory extends Model
{
    public $timestamps = false;

    protected $fillable = ['order_id', 'previous_status', 'new_status', 'changed_at'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
