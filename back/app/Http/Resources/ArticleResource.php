<?php

namespace App\Http\Resources;

use App\Http\Resources\CategoriRessource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "libelle"=>$this->libelle,
            "prix" => $this->prix,
            "stock"=> $this->stock,
            "categorie"=> $this->categorie->libelle,
            // "fournisseur_id"=> $this->fourniseur,
            "path_url" => $this->path_url,  
            "reference"=>$this->reference
        ];
    }
}
