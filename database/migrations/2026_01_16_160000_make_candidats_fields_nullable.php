<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modifier les colonnes pour les rendre nullable
        DB::statement('ALTER TABLE candidats MODIFY pays VARCHAR(100) NULL');
        DB::statement('ALTER TABLE candidats MODIFY ville VARCHAR(100) NULL');
        DB::statement('ALTER TABLE candidats MODIFY quartier VARCHAR(100) NULL');
        DB::statement('ALTER TABLE candidats MODIFY concours_id BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE candidats MODIFY centre_exam_id BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE candidats MODIFY centre_depot_id BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE candidats MODIFY nom_pere VARCHAR(100) NULL');
        DB::statement('ALTER TABLE candidats MODIFY tel_pere VARCHAR(20) NULL');
        DB::statement('ALTER TABLE candidats MODIFY nom_mere VARCHAR(100) NULL');
        DB::statement('ALTER TABLE candidats MODIFY tel_mere VARCHAR(20) NULL');
        DB::statement('ALTER TABLE candidats MODIFY dernier_diplome VARCHAR(255) NULL');
        DB::statement('ALTER TABLE candidats MODIFY etablissement_origine VARCHAR(255) NULL');
    }

    public function down(): void
    {
        // Revert changes if needed
    }
};
