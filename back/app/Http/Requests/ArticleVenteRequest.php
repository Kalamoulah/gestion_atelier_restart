<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleVenteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'libelle' => 'required|unique:articles', 
            'categorie' => 'required',
            'path_url' => 'required',
            'promo'=> 'numeric',
            'confection'=>'required|array|distinct|min:1',
            // 'confection.*' => 'required|exists:articles,id'
        ];
    }
}
