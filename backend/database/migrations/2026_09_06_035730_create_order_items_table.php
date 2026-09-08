<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('product_id')->constrained()->cascadeOnUpdate();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 10, 2)->comment('Snapshot del precio al momento de la compra');

            $table->index('order_id');
        });

        DB::statement('ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0)');
        DB::statement('ALTER TABLE order_items ADD CONSTRAINT chk_unit_price_non_negative CHECK (unit_price >= 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
