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
        Schema::create('enrolements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('candidat_id')->constrained('candidats');
    $table->foreignId('concours_id')->constrained('concours');
    $table->foreignId('session_id')->constrained('sessions_academiques');
    $table->foreignId('centre_depot_id')->constrained('centre_depot');
    $table->foreignId('utilisateur_id')->constrained('utilisateurs');
    $table->date('date_enrolement');
    $table->string('statut_enrolement');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrolements');
    }
};
