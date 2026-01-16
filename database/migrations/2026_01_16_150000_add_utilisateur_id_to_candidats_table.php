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
        Schema::table('candidats', function (Blueprint $table) {
            if (!Schema::hasColumn('candidats', 'utilisateur_id')) {
                $table->foreignId('utilisateur_id')->nullable()->after('centre_depot_id')->constrained('utilisateurs')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidats', function (Blueprint $table) {
            if (Schema::hasColumn('candidats', 'utilisateur_id')) {
                $table->dropForeign(['utilisateur_id']);
                $table->dropColumn('utilisateur_id');
            }
        });
    }
};
