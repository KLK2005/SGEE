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
        Schema::create('utilisateurs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('role_id')->constrained('roles');
    $table->string('nom');
    $table->string('prenom');
    $table->string('email')->unique();
    $table->string('telephone');
    $table->string('password');
    $table->string('photo_profil')->nullable();
    $table->string('statut')->default('actif');
    $table->timestamp('dernier_login')->nullable();
    $table->string('adresse_ip')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
