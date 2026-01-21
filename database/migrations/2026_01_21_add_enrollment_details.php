<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ajouter les colonnes manquantes à la table enrolements
        if (Schema::hasTable('enrolements') && !Schema::hasColumn('enrolements', 'departement_id')) {
            Schema::table('enrolements', function (Blueprint $table) {
                $table->foreignId('departement_id')->nullable()->constrained('departements')->onDelete('set null');
                $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
                $table->foreignId('ecole_id')->nullable()->constrained('ecoles')->onDelete('set null');
                $table->string('niveau')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('enrolements')) {
            Schema::table('enrolements', function (Blueprint $table) {
                $table->dropForeignIdFor('departements');
                $table->dropForeignIdFor('filieres');
                $table->dropForeignIdFor('ecoles');
                $table->dropColumn('niveau');
            });
        }
    }
};
