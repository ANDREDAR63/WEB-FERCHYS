<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredient_product', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnUpdate();
            $table->foreignId('ingredient_id')->constrained()->cascadeOnUpdate();
            $table->decimal('quantity_required', 10, 2);

            $table->primary(['product_id', 'ingredient_id']);
        });

        DB::statement('ALTER TABLE ingredient_product ADD CONSTRAINT chk_quantity_required_positive CHECK (quantity_required > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('ingredient_product');
    }
};
