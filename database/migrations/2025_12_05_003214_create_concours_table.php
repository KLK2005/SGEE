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
        Schema::create('concours', function (Blueprint $table) {
    $table->id();
    $table->foreignId('filiere_id')->constrained('filieres');
    $table->foreignId('session_id')->constrained('sessions_academiques');
    $table->foreignId('centre_exam_id')->constrained('centre_exam');
    $table->string('nom_concours');
    $table->string('type_concours');
    $table->date('date_concours');
    $table->time('heure_debut');
    $table->time('heure_fin');
    $table->integer('frais_inscription');
    $table->integer('nombre_places');
    $table->string('statut');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concours');
    }
};
