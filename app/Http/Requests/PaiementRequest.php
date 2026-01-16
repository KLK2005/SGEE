<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaiementRequest extends FormRequest
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
            'enrolement_id' => ['nullable', 'exists:enrolements,id'],
            'montant' => ['required', 'numeric', 'min:1'],
            'mode_paiement' => ['required', 'string', 'in:espece,cheque,virement,mobile_money,carte'],
            'reference_transaction' => ['nullable', 'string', 'max:255'],
            'date_paiement' => ['nullable', 'date'],
            'statut_paiement' => ['nullable', 'string', 'in:en_attente,valide,rejete'],
            'preuve_paiement' => ['nullable', 'file', 'max:5120'],
        ];
    }
}
