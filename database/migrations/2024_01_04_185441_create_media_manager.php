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
        Schema::create('media_managers', function (Blueprint $table) {
            // $table->id();
            // $table->timestamps();
            $table->string('media_managers_type')->index();
            $table->bigInteger('media_managers_id');
            $table->bigInteger('media_library_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_managers');
    }
};
