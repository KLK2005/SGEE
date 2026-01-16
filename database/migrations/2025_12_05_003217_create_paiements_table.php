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
       Schema::create('paiements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('candidat_id')->constrained('candidats');
    $table->foreignId('enrolement_id')->constrained('enrolements');
    $table->integer('montant');
    $table->string('mode_paiement');
    $table->string('reference_transaction');
    $table->date('date_paiement');
    $table->string('statut_paiement');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
