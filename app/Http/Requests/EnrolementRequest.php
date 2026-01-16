<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnrolementRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'candidat_id' => ['required', 'exists:candidats,id'],
            'concours_id' => ['nullable', 'exists:concours,id'],
            'session_id' => ['nullable', 'exists:sessions_academiques,id'],
            'centre_depot_id' => ['nullable', 'exists:centre_depot,id'],
            'date_enrolement' => ['nullable', 'date'],
            'statut_enrolement' => ['nullable', 'string', 'in:en_attente,valide,rejete'],
        ];
    }
}
