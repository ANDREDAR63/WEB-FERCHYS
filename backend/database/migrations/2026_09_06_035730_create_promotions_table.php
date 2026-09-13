<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->string('name', 100);
            $table->decimal('discount_percentage', 5, 2);
            $table->date('start_date');
            $table->date('end_date');
        });

        DB::statement('ALTER TABLE promotions ADD CONSTRAINT chk_discount_range CHECK (discount_percentage BETWEEN 0 AND 100)');
        DB::statement('ALTER TABLE promotions ADD CONSTRAINT chk_promotion_dates CHECK (end_date >= start_date)');
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
