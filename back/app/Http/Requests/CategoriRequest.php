<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoriRequest extends FormRequest
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
            'libelle'=> 'required|min:3|unique:categories'
        ];
    }

    public function messages(): array
    {
        return [
            'libelle.required'=> 'le champs libelle est obligatoire',
            'libelle.min'=> 'le taille du libelle doit etre superieur ou egal à 3',
            'libelle.unique'=> 'cette categorie existe deja'
        ];
    }
}
