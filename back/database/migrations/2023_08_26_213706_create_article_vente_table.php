<?php

use App\Models\Categories;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_ventes', function (Blueprint $table) {
            $table->id();
            $table->string('libelle')->unique();
            $table->float('prix')->default(0);
            $table->integer('stock');
            $table->foreignIdFor(Categories::class)->constrained();
            $table->float('promo')->nullable();
            $table->string('path_url')->nullable();
            $table->string('reference')->nullable();
            $table->float('cout');
            $table->string('marge')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_vente');
    }
};
