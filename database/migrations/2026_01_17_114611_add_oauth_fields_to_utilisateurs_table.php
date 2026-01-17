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
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->string('oauth_provider')->nullable()->after('password');
            $table->string('oauth_provider_id')->nullable()->after('oauth_provider');
            $table->string('avatar')->nullable()->after('oauth_provider_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn(['oauth_provider', 'oauth_provider_id', 'avatar']);
        });
    }
};
