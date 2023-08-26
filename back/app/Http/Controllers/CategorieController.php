<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriRequest;
use App\Http\Resources\CategoriRessource;
use App\Http\Resources\dataCollection;
use App\Models\Categories;
use Illuminate\Http\Request;
use \Illuminate\Http\Response;
use Illuminate\Support\Str;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {

    //     $data =  CategoriRessource::collection(Categories::paginate(4));

    //         return ['data' => $data->items(), 'meta' => $data->toArray()];
    // }


    public function index()
    {
        $paginatedData = Categories::paginate(4);

        // Transformer les données avec la ressource CategoriRessource
        $data = CategoriRessource::collection($paginatedData)->items();

        // Récupérer les métadonnées sans duplication des données
        $meta = $paginatedData->toArray();
        unset($meta['data']); // Supprimer la clé 'data' pour éviter la duplication

        return ['data' => $data, 'meta' => $meta];
    }


    public function store(CategoriRequest $request)
    {
        $data = $request->validated();
        $categories = Categories::firstOrCreate($data);
        return response()->json([
            "message" => "categori inserer",
            "data" => new CategoriRessource($categories),
            "statut" => Response::HTTP_CREATED
        ]);
    }

    public function search(Request $request)
    {
        $libelle = $request->libelle;
        $length = Str::length($libelle);
        if ($length >= 3) {
            $categories = Categories::where('libelle', $libelle)
                ->first();
            if (!$categories) {
                // return response()->json([
                //     'message' => "lobjet n'existe pas",
                //     "data" => [],
                // ]);
                return dataCollection::toApiResponse("l'objet existe pas", [], false);

            }
            $cat = new CategoriRessource($categories);
            // return response()->json([
            //     'message' => "l'objet existe deja",
            //     'data' => [new CategoriRessource($categories)]
            // ]);
            return dataCollection::toApiResponse("l'objet existe deja", [$cat], true);
        }

        // return response()->json([
        //     "message" => "Le libellé doit avoir au moins 3 caractères.",
        //     "data" => [null],
        //     'statut'=>  Response::HTTP_NOT_FOUND
        // ]);
        return dataCollection::toApiResponse("Le libellé doit avoir au moins 3 caractères", [], true);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categories = Categories::find($id);
        if ($categories) {
            return response()->json([
                'message' => "les données du categorie avec l'id ",
                'data' => new CategoriRessource($categories),
                'statut' => Response::HTTP_OK
            ]);
        }
        return response()->json([
            "message" => "cette categorie  n'existe pas",
            "data" => [],
            'statut' => Response::HTTP_NOT_FOUND
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $idExist = Categories::find($id);
        if (!$idExist) {
            return response()->json([
                "message" => "cette categories n'existe pas",
                "data" => []
            ]);
        }
        $dataModify = Categories::where('id', $id)->update(["libelle" => $request->libelle]);
        return response()->json([
            "message" => "categorie modifier",
            "data" => [$dataModify],
            'statut' => Response::HTTP_OK
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */

    // public function destroy(Request $request)
    // {

    //     $idsCategorie = $request->ids;
    //     if (empty($idsCategorie)) {
    //         return response()->json(
    //             [
    //                 'message' => "données vide",
    //                 "data" => []
    //             ]
    //         );
    //     }
    //     $CategorieDelete = Categories::whereIn('id', $idsCategorie)->delete();

    //     return response()->json(
    //         [
    //             'message' => "categories supprimé",
    //             'data' => [$CategorieDelete]
    //         ]
    //     );
    // }

    public function destroy(Request $request, $id)
    {
        $idsCategorie = $request->ids;
        if (empty($idsCategorie)) {
            if (!empty($id)) {
                $idsCategorie[] = $id;
            } else {
                return dataCollection::toApiResponse("Données vides", [], false);
            }
        }
        $CategorieDelete = Categories::whereIn('id', $idsCategorie)->delete();
        return dataCollection::toApiResponse("Catégories supprimées avec succès", [$CategorieDelete], true);
    }


}