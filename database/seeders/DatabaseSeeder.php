<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Option 1: Seeders individuels
        // $this->call([
        //     RoleSeeder::class,
        //     DepartementSeeder::class,
        //     FiliereSeeder::class,
        //     SessionConcoursSeeder::class,
        //     AdminSeeder::class,
        // ]);

        // Option 2: Seeder complet avec données de test
        $this->call(TestDataSeeder::class);
    }
}
