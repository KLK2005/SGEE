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
        Schema::create('centre_examens', function (Blueprint $table) {
            $table->id();
            $table->string('nom_centre');
            $table->string('code_centre')->unique();
            $table->string('adresse');
            $table->string('ville');
            $table->string('telephone')->nullable();
            $table->integer('capacite')->default(0); // Nombre de places
            $table->text('equipements')->nullable(); // Description des équipements
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('centre_examens');
    }
};
