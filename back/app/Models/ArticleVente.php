<?php

namespace App\Models;

use App\Models\Categories;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArticleVente extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [
        'id'
    ];

    protected static function boot()
    {
        parent::boot();
        static::created(function ($articleVente) {
            foreach ($articleVente->articles as $confectionItem) {
                $articleVente->articles()->attach($confectionItem['id'], ['quantity' => $confectionItem['qte']]);
            }
        });
        static::deleting(function ($articleVente) {
            // $articleVente->articles()->detach(); 

            $articleVente->articles()->delete(); 
            // $articleVente->confectionVente()->delete();
        });

    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'categories_id');
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class, 'confection_vente', 'article_vente_id', 'article_id', )
            ->withPivot('quantity');
    }

    // public function confectionVente()
    // {
    //     return $this->hasMany(ConfectionVente::class, 'article_vente_id');
    // }
}