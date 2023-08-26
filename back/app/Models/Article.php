<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory,  SoftDeletes;

    protected $guarded = [
        'id'
    ];
    
    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categories::class, 'categories_id');
    }
    public function fournisseurs(): BelongsToMany
    {
        return $this->belongsToMany(Fournisseur::class, 'article_fournisseurs');
    }
}
