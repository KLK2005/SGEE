<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ajouter ecole_id à departements
        if (Schema::hasTable('departements') && !Schema::hasColumn('departements', 'ecole_id')) {
            Schema::table('departements', function (Blueprint $table) {
                $table->foreignId('ecole_id')->nullable()->constrained('ecoles')->onDelete('cascade');
            });
        }

        // Ajouter ecole_id à filieres
        if (Schema::hasTable('filieres') && !Schema::hasColumn('filieres', 'ecole_id')) {
            Schema::table('filieres', function (Blueprint $table) {
                $table->foreignId('ecole_id')->nullable()->constrained('ecoles')->onDelete('cascade');
            });
        }

        // Ajouter ecole_id à concours
        if (Schema::hasTable('concours') && !Schema::hasColumn('concours', 'ecole_id')) {
            Schema::table('concours', function (Blueprint $table) {
                $table->foreignId('ecole_id')->nullable()->constrained('ecoles')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('departements') && Schema::hasColumn('departements', 'ecole_id')) {
            Schema::table('departements', function (Blueprint $table) {
                $table->dropForeignIdFor('ecoles');
            });
        }

        if (Schema::hasTable('filieres') && Schema::hasColumn('filieres', 'ecole_id')) {
            Schema::table('filieres', function (Blueprint $table) {
                $table->dropForeignIdFor('ecoles');
            });
        }

        if (Schema::hasTable('concours') && Schema::hasColumn('concours', 'ecole_id')) {
            Schema::table('concours', function (Blueprint $table) {
                $table->dropForeignIdFor('ecoles');
            });
        }
    }
};
