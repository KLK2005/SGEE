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
        Schema::table('enrolements', function (Blueprint $table) {
            $table->string('fiche_pdf_path')->nullable()->after('statut_enrolement');
        });
        
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('quitus_pdf_path')->nullable()->after('statut_paiement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrolements', function (Blueprint $table) {
            $table->dropColumn('fiche_pdf_path');
        });
        
        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn('quitus_pdf_path');
        });
    }
};
