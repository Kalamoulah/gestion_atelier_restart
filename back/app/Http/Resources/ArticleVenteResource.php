<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleVenteResource extends JsonResource
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
                "path_url" => $this->path_url,  
                "reference"=>$this->reference,
                "promo"=>$this->promo,
                "marge"=> $this->marge,
                "coutFabrication"=>$this->coutFabrication,
                "confection"=> $this->whenLoaded('articles', function(){
                    return $this->articles->map(function($article){
                        return [
                            'id'=>$article->id,
                            'libelle'=>$article->libelle,
                            'quantity'=>$article->pivot->quantity
                        ];
                    });
                })
            ];
        }
}
