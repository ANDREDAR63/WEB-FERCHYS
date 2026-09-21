<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Horneados' => 'Suspiros, alfajores y otros horneados artesanales',
            'Cheesecakes' => 'Cheesecakes de distintos sabores con base de galleta',
        ];

        foreach ($categories as $name => $description) {
            Category::firstOrCreate(['name' => $name], ['description' => $description]);
        }

        $horneados = Category::where('name', 'Horneados')->first();
        $cheesecakes = Category::where('name', 'Cheesecakes')->first();

        $products = [
            ['name' => 'Suspiros', 'description' => 'Deliciosos merengues para endulzar tu día.', 'price' => 3000, 'category_id' => $horneados->id],
            ['name' => 'Alfajores', 'description' => 'Dulce tradicional argentino elaborado con dos delicadas galletas rellenas de arequipe y coco.', 'price' => 5000, 'category_id' => $horneados->id],
            ['name' => 'Cheesecake de limón', 'description' => 'Postre con base de galleta dulce y relleno de sabor a limón natural.', 'price' => 7000, 'category_id' => $cheesecakes->id],
            ['name' => 'Cheesecake de maracuyá', 'description' => 'Postre con base de galleta dulce y relleno de sabor a maracuyá natural.', 'price' => 7000, 'category_id' => $cheesecakes->id],
            ['name' => 'Cheesecake de chocolate', 'description' => 'Postre con base de galleta oreo y sabor a chocolate para los mas amantes de el dulce.', 'price' => 7000, 'category_id' => $cheesecakes->id],
            ['name' => 'Cheesecake de arándano', 'description' => 'Postre con base de galleta dulce y relleno de sabor a arándano natural.', 'price' => 7000, 'category_id' => $cheesecakes->id],
            ['name' => 'Cheesecake de papayuela', 'description' => 'Postre con base de galleta dulce y relleno de sabor a papayuela natural.', 'price' => 7000, 'category_id' => $cheesecakes->id],
            ['name' => 'Cheesecake de red velvet', 'description' => 'Postre con base de torta red velvet y sabor a vainilla para los gustos mas refinados.', 'price' => 7000, 'category_id' => $cheesecakes->id],
            ['name' => 'Refractaria familiar de cheesecake', 'description' => 'Una refractaria que rinde 10-15 porciones para compartir un postre diferente.', 'price' => 40000, 'category_id' => $cheesecakes->id],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                [...$product, 'active' => true]
            );
        }
    }
}
