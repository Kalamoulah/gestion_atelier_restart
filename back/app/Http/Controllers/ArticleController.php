<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoriRessource;
use App\Http\Resources\FournisseurResource;
use App\Models\Article;
use App\Models\ArticleFournisseur;
use App\Models\Categories;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use App\Http\Resources\dataCollection;
use Nette\Schema\Message;
use \Illuminate\Http\Response;


class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $article = ArticleResource::collection(Article::all());
    //     // $article = Article::all();
    //     $fournisseur = FournisseurResource::collection(Fournisseur::all());
    //     $categorie = CategoriRessource::collection(Categories::all());
    //     return response()->json([
    //         "message" => "all data",
    //         'data' => [
    //             "form" => [
    //                 "fournisseurs" => $fournisseur,
    //                 "categories" => $categorie
    //             ],
    //             "article" => $article
    //         ],
    //         "success" => true
    //     ]);
    // }


    public function index()
    {
        $datas = Article::with('fournisseurs')->get();
       $article = $datas->map(function ($article) {
            return [
                'id' => $article->id,
                'libelle' => $article->libelle,
                'prix' => number_format($article->prix, 2),
                'stock' => $article->stock,
                'categorie' => $article->categorie->libelle,
                'path_url' => $article->path_url,
                'reference' => $article->reference,
                'fournisseurs' => $article->fournisseurs->pluck('id')->toArray(),
            ]; 
        });
        $fournisseur = FournisseurResource::collection(Fournisseur::all());
        $categorie = CategoriRessource::collection(Categories::all());
        return response()->json([
            "message" => "all data",
            'data' => [
                "form" => [
                    "fournisseurs" => $fournisseur,
                    "categories" => $categorie
                ],
                "article" => $article
            ],
            "success" => true
        ]);
    }


    public function getAllCategory()
    {
        $data = CategoriRessource::collection(Categories::all());
        return dataCollection::toApiResponse("liste des categorie", $data, true);
    }

    public function searchFournisseurs(Request $request)
    {
        $term = $request->input('term');
        $fournisseurs = Fournisseur::where('nom', 'like', '%' . $term . '%')->get();
        return dataCollection::toApiResponse("voici les fourniseurs", [$fournisseurs], true);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(ArticleRequest $request)
    {
        // return response()->json($request->fournisseur);
        $arrayFounisseur = explode(',', $request->fournisseur);

        $data = $request->validated();
        if ($request->hasFile('path_url')) {

            $imagePath = $request->file('path_url')->store('images', 'public');
        } else {
            return dataCollection::toApiResponse("image not found", [], false);
        }

        // $fournisseur = Fournisseur::where('libelle', $data['fournisseur'])->first();
        $categorie = Categories::where('libelle', $data['categorie'])->first();

        if ($categorie) {
            $categorie_id = $categorie->id;
        }

        $article = new Article([
            'libelle' => $data['libelle'],
            'prix' => $data['prix'],
            'stock' => $data['stock'],
            'categories_id' => $categorie_id,
            'reference' => $data['reference'],
            'path_url' => $imagePath,
        ]);
        $article->save();

        
        foreach ($arrayFounisseur as $key) {
            ArticleFournisseur::create([
                "article_id" => $article->id,
                "fournisseur_id" => $key
            ]);
        }
        return dataCollection::toApiResponse("article insérer", [$article], true);
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
    public function update(Request $request, string $id)
    {

        $idExist = Article::where('id', $id)->first();

        // return response()->json($request);


        if (!$idExist) {
            return response()->json([
                "message" => "cette article n'existe pas",
                "data" => []
            ]);
        }
        if ($request->hasFile('path_url')) {

            $imagePath = $request->file('path_url')->store('images', 'public');
        } else {
            return dataCollection::toApiResponse("image not found", [], false);
        }

        $idCategorie = Categories::where('libelle', $request->categorie)->first();



        if ($idCategorie) {
            $categorie_id = $idCategorie->id;
        }

        $idExist->update([
            "libelle" => $request->libelle,
            "prix" => $request->prix,
            "stock" => $request->stock,
            "categories_id" => $categorie_id,
            // "categories_id" => $request->categorie,
            "path_url" => $imagePath,
            "reference" => $request->reference
        ]);
        return response()->json([
            "message" => "categorie modifier",
            "data" => [$idExist],
            'statut' => Response::HTTP_OK
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $article = Article::find($id);
        $articleDelete = $article->delete();
        return dataCollection::toApiResponse("article supprimées avec succès", [$articleDelete], true);
    }
}