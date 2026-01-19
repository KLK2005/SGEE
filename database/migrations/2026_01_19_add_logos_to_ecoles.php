<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ecoles', function (Blueprint $table) {
            if (!Schema::hasColumn('ecoles', 'logo_path')) {
                $table->string('logo_path')->nullable()->after('nom_ecole');
            }
            if (!Schema::hasColumn('ecoles', 'couleur_principale')) {
                $table->string('couleur_principale')->nullable()->after('logo_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ecoles', function (Blueprint $table) {
            $table->dropColumn(['logo_path', 'couleur_principale']);
        });
    }
};
