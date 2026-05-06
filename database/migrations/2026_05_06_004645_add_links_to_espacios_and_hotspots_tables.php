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
        Schema::table('espacios', function (Blueprint $table) {
            $table->string('google_maps_link')->nullable();
            $table->string('instagram_link')->nullable();
            $table->string('facebook_link')->nullable();
        });

        Schema::table('hotspots', function (Blueprint $table) {
            $table->foreignId('target_espacio_id')->nullable()->constrained('espacios')->nullOnDelete();
            $table->string('tipo')->default('info'); // 'info' o 'enlace'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('espacios', function (Blueprint $table) {
            $table->dropColumn(['google_maps_link', 'instagram_link', 'facebook_link']);
        });

        Schema::table('hotspots', function (Blueprint $table) {
            $table->dropConstrainedForeignId('target_espacio_id');
            $table->dropColumn('tipo');
        });
    }
};
