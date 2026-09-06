<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('unit', 20)->comment('Valores posibles: gr, ml, unidades');
            $table->decimal('current_stock', 10, 2)->default(0);
            $table->decimal('minimum_stock', 10, 2)->default(5);
            $table->timestamps();
        });

        // CHECK constraints (equivalente a tus chk_stock_no_negativo / chk_stock_minimo)
        DB::statement('ALTER TABLE ingredients ADD CONSTRAINT chk_current_stock_non_negative CHECK (current_stock >= 0)');
        DB::statement('ALTER TABLE ingredients ADD CONSTRAINT chk_minimum_stock_non_negative CHECK (minimum_stock >= 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
