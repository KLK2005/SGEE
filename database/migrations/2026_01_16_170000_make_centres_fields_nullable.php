<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Centre depot
        DB::statement('ALTER TABLE centre_depot MODIFY responsable VARCHAR(100) NULL');
        DB::statement('ALTER TABLE centre_depot MODIFY telephone VARCHAR(20) NULL');
        
        // Centre exam
        DB::statement('ALTER TABLE centre_exam MODIFY adresse VARCHAR(255) NULL');
        DB::statement('ALTER TABLE centre_exam MODIFY capacite INT NULL');
        
        // Concours
        DB::statement('ALTER TABLE concours MODIFY heure_debut TIME NULL');
        DB::statement('ALTER TABLE concours MODIFY heure_fin TIME NULL');
    }

    public function down(): void
    {
        // Revert if needed
    }
};
