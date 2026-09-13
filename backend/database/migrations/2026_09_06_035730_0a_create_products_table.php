<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->foreignId('category_id')->constrained()->cascadeOnUpdate();
            $table->string('image_url', 255)->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index('active');
        });

        DB::statement('ALTER TABLE products ADD CONSTRAINT chk_price_positive CHECK (price > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
