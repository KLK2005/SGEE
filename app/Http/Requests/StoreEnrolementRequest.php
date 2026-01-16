<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEnrolementRequest extends FormRequest
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
            'candidat_id' => 'required|exists:candidats,id',
            'concours_id' => 'required|exists:concours,id',
            'session_id' => 'required|exists:sessions_academiques,id',
            'centre_depot_id' => 'required|exists:centre_depot,id',
            'date_enrolement' => 'required|date',
            'statut_enrolement' => 'required|in:en_attente,valide,rejete,annule',
            'montant_inscription' => 'required|numeric|min:0',
            'documents_fournis' => 'nullable|json',
            'observations' => 'nullable|string|max:1000'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'candidat_id.required' => 'Le candidat est obligatoire.',
            'candidat_id.exists' => 'Le candidat sélectionné n\'existe pas.',
            'concours_id.required' => 'Le concours est obligatoire.',
            'concours_id.exists' => 'Le concours sélectionné n\'existe pas.',
            'session_id.required' => 'La session académique est obligatoire.',
            'session_id.exists' => 'La session académique sélectionnée n\'existe pas.',
            'centre_depot_id.required' => 'Le centre de dépôt est obligatoire.',
            'centre_depot_id.exists' => 'Le centre de dépôt sélectionné n\'existe pas.',
            'date_enrolement.required' => 'La date d\'enrôlement est obligatoire.',
            'date_enrolement.date' => 'La date d\'enrôlement doit être une date valide.',
            'statut_enrolement.required' => 'Le statut d\'enrôlement est obligatoire.',
            'statut_enrolement.in' => 'Le statut doit être : en_attente, valide, rejete ou annule.',
            'montant_inscription.required' => 'Le montant d\'inscription est obligatoire.',
            'montant_inscription.numeric' => 'Le montant doit être un nombre.',
            'montant_inscription.min' => 'Le montant ne peut pas être négatif.',
            'documents_fournis.json' => 'Les documents fournis doivent être au format JSON.',
            'observations.max' => 'Les observations ne peuvent pas dépasser 1000 caractères.'
        ];
    }
}