<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleVenteRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ArticleVenteResource;
use App\Http\Resources\CategoriRessource;
use App\Http\Resources\dataCollection;
use App\Models\Article;
use App\Models\ArticleVente;
use App\Models\Categories;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleVenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paginatedData = ArticleVente::paginate(4);
        $data = ArticleVenteResource::collection($paginatedData)->items();
        $meta = $paginatedData->toArray();
        unset($meta['data']);
        return ['data' => $data, 'meta' => $meta];
    }

    public function all()
    {

        $articleVente = ArticleVente::with('articles')->get();
        $articleConf = ArticleResource::collection(Article::all());
        $categorieVente = Categories::where('type_article', "vente")->get();
        return response()->json([
            "message" => "all data",
            'data' => [
                "categories" => [
                    "categorie" => $articleConf,
                    "categorieVente"=> CategoriRessource::collection($categorieVente),
                ],
                "articleVente" => ArticleVenteResource::collection($articleVente),
            ],
            "success" => true
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(ArticleVenteRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $datas = $request->validated();

            $categorie = Categories::where('libelle', $datas['categorie'])->first();
            if (!$categorie) {
                response()->json("erreur categorie n'existe pas");
            }
            //calcul du cout de fabrication
            $coutDeFabrication = 0;
            $articleConfection = [];
            foreach ($datas['confection'] as $item) {
                $articleConfection = Article::where('libelle', $item['libelleConf'])->first();

                if ($articleConfection) {
                    if ($item['qte'] > $articleConfection->stock) {
                        return response()->json(['error' => "Stock insuffisant pour l'article {$articleConfection->libelle}"], 400);
                    }
                    $articleConfection->stock -= $item['qte'];
                    $articleConfection->save();
                    $coutDeFabrication += $item['qte'] * $articleConfection->prix;
                }
            }
            $minimumMarge = 500;
            $maximumMarge = $coutDeFabrication / 3;
            if (!($request->marge >= $minimumMarge && $request->marge <= $maximumMarge)) {
                return response()->json("erreur");
            }
            $prixDeVente = $coutDeFabrication + $request->marge;
            $nouvelArticle = ArticleVente::create([
                "libelle" => $datas['libelle'],
                "categories_id" => $categorie->id,
                "path_url" =>  $request->path_url,
                "reference" => $request->reference,
                "promo" => $request->promo,
                "marge" => $request->marge,
                'prix' => $prixDeVente,
                'cout' => $coutDeFabrication,
                'stock' => 1
            ]);
            foreach ($datas['confection'] as $confectionItem) {
                $nouvelArticle->articles()->attach($confectionItem['id'], ['quantity' => $confectionItem['qte']]);
            } 

            $response = array_merge($nouvelArticle->toArray(), [
                'categorie' => $categorie->libelle,
                'confection' => $datas['confection'],
            ]);
            return dataCollection::toApiResponse("article de vente insereré", $response, true);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //  
    }
    /**
     * Update the specified resource in storage.
     */

    public function update(ArticleVenteRequest $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $articleVente = ArticleVente::findOrFail($id);
            $newData = $request->validated();
       
            $coutDeFabrication = 0;
            foreach ($newData['confection'] as $confectionItem) {
                $articleConfection = Article::findOrFail($confectionItem['id']);

                if ($confectionItem['qte'] > $articleConfection->stock) {
                    return response()->json(['error' => "Stock insuffisant pour l'article {$articleConfection->libelle}"], 400);
                }

                $coutDeFabrication += $confectionItem['qte'] * $articleConfection->prix;
            }

            $minimumMarge = 500;
            $maximumMarge = $coutDeFabrication / 3;
            if (!($request->marge >= $minimumMarge && $request->marge  <= $maximumMarge)) {
                return response()->json(['error' => "Marge invalide"], 400);
            }

    
            $prixDeVente = $coutDeFabrication + $request->marge;
            $articleVente->update([
                "libelle" => $newData['libelle'],
                "categories_id" => $articleVente ->id,
                "reference" => $request->reference,
                "promo" => $request->promo,
                "marge" => $request->marge,
                "prix" => $prixDeVente,
                "cout" => $coutDeFabrication,
            ]);

            $articleVente->articles()->detach();
            foreach ($newData['confection'] as $confectionItem) {
                $articleVente->articles()->attach($confectionItem['id'], ['quantity' => $confectionItem['qte']]);
            }
            // Réponse de succès
            $response = array_merge($articleVente->toArray(), [
                'categorie' => $articleVente->categorie->libelle,
                'confection' => $newData['confection'],
            ]);

            return response()->json($response, 200);
        });
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}