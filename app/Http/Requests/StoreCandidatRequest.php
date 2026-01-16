<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidatRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:M,F',
            'date_naissance' => 'required|date|before:today',
            'lieu_naissance' => 'required|string|max:255',
            'nationalite' => 'required|string|max:100',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:candidats,email',
            'dernier_diplome' => 'required|string|max:255',
            'etablissement_origine' => 'required|string|max:255',
            'filiere_id' => 'required|exists:filieres,id',
            'concours_id' => 'required|exists:concours,id',
            'centre_exam_id' => 'required|exists:centre_exam,id',
            'centre_depot_id' => 'required|exists:centre_depot,id',
            'adresse_complete' => 'required|string|max:500',
            'niveau_etude' => 'required|string|max:100',
            'serie_bac' => 'nullable|string|max:10',
            'mention_bac' => 'nullable|string|max:20',
            'option_bac' => 'nullable|string|max:100',
            'annee_obtention' => 'required|integer|min:1990|max:' . date('Y'),
            'langues_parlees' => 'nullable|string|max:255',
            'handicap' => 'required|boolean',
            'observations' => 'nullable|string|max:1000',
            'photo_identite' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'sexe.required' => 'Le sexe est obligatoire.',
            'sexe.in' => 'Le sexe doit être M ou F.',
            'date_naissance.required' => 'La date de naissance est obligatoire.',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit être valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'telephone.required' => 'Le téléphone est obligatoire.',
            'filiere_id.required' => 'La filière est obligatoire.',
            'filiere_id.exists' => 'La filière sélectionnée n\'existe pas.',
            'concours_id.required' => 'Le concours est obligatoire.',
            'concours_id.exists' => 'Le concours sélectionné n\'existe pas.',
            'centre_exam_id.required' => 'Le centre d\'examen est obligatoire.',
            'centre_exam_id.exists' => 'Le centre d\'examen sélectionné n\'existe pas.',
            'centre_depot_id.required' => 'Le centre de dépôt est obligatoire.',
            'centre_depot_id.exists' => 'Le centre de dépôt sélectionné n\'existe pas.',
            'photo_identite.required' => 'La photo d\'identité est obligatoire.',
            'photo_identite.image' => 'Le fichier doit être une image.',
            'photo_identite.mimes' => 'L\'image doit être au format JPEG, PNG ou JPG.',
            'photo_identite.max' => 'L\'image ne doit pas dépasser 2MB.',
            'annee_obtention.min' => 'L\'année d\'obtention ne peut pas être antérieure à 1990.',
            'annee_obtention.max' => 'L\'année d\'obtention ne peut pas être supérieure à l\'année actuelle.'
        ];
    }
}