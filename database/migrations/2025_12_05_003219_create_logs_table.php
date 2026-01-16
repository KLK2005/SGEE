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
        Schema::create('logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('utilisateur_id')->constrained('utilisateurs');
    $table->string('action');
    $table->string('table_concernee');
    $table->integer('id_element');
    $table->string('adresse_ip');
    $table->timestamp('date_action');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};
