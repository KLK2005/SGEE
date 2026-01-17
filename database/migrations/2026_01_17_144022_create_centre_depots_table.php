<?php

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
        Schema::create('centre_depots', function (Blueprint $table) {
            $table->id();
            $table->string('nom_centre');
            $table->string('code_centre')->unique();
            $table->string('adresse');
            $table->string('ville');
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->string('horaires')->nullable(); // Ex: "Lun-Ven 8h-17h"
            $table->text('services')->nullable(); // Services disponibles
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('centre_depots');
    }
};
