import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import { filiereService } from '../../services/filiereService'
import toast from 'react-hot-toast'
import { CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function Enrolement() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState({})

  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  // Fetch existing candidat data
  const { data: candidatData, isLoading: loadingCandidat } = useQuery({
    queryKey: ['my-candidat'],
    queryFn: () => candidatService.getAll({ utilisateur_id: user?.id }),
  })

  // Fetch filieres
  const { data: filieresData } = useQuery({
    queryKey: ['filieres'],
    queryFn: () => filiereService.getAll(),
  })

  const candidat = candidatData?.data?.[0]
  const filieres = filieresData?.data || []

  // Create candidat mutation
  const createCandidatMutation = useMutation({
    mutationFn: candidatService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-candidat'])
      toast.success('Informations enregistrées !')
      setStep(2)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    },
  })

  // Create enrolement mutation
  const createEnrolementMutation = useMutation({
    mutationFn: enrolementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-candidat'])
      toast.success('Enrôlement soumis avec succès !')
      setStep(3)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la soumission')
    },
  })

  const onSubmitStep1 = (data) => {
    createCandidatMutation.mutate({
      ...data,
      utilisateur_id: user?.id,
    })
  }

  const onSubmitStep2 = () => {
    if (!candidat) return
    
    createEnrolementMutation.mutate({
      candidat_id: candidat.id,
      ...uploadedFiles,
    })
  }

  const handleFileChange = (field, file) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }))
  }

  if (loadingCandidat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If already enrolled, show status
  if (candidat?.enrolement) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrôlement soumis</h2>
          <p className="text-gray-600 mb-4">
            Votre dossier d'enrôlement a été soumis avec succès.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-500">Numéro de dossier</p>
            <p className="text-xl font-bold text-primary-600">{candidat.numero_dossier}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Statut</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
              candidat.enrolement.statut_enrolement === 'valide' 
                ? 'bg-green-100 text-green-800'
                : candidat.enrolement.statut_enrolement === 'rejete'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {candidat.enrolement.statut_enrolement === 'valide' ? 'Validé' :
               candidat.enrolement.statut_enrolement === 'rejete' ? 'Rejeté' : 'En attente'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Enrôlement</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-20 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && !candidat && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  className="input-field"
                  defaultValue={user?.nom}
                  {...register('nom', { required: 'Requis' })}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
              </div>
              <div>
                <label className="label">Prénom</label>
                <input
                  type="text"
                  className="input-field"
                  defaultValue={user?.prenom}
                  {...register('prenom', { required: 'Requis' })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date de naissance</label>
                <input type="date" className="input-field" {...register('date_naissance', { required: 'Requis' })} />
              </div>
              <div>
                <label className="label">Lieu de naissance</label>
                <input type="text" className="input-field" {...register('lieu_naissance', { required: 'Requis' })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Sexe</label>
                <select className="input-field" {...register('sexe', { required: 'Requis' })}>
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="label">Nationalité</label>
                <input type="text" className="input-field" {...register('nationalite', { required: 'Requis' })} />
              </div>
            </div>

            <div>
              <label className="label">Téléphone</label>
              <input type="tel" className="input-field" {...register('telephone', { required: 'Requis' })} />
            </div>

              <div>
                <label className="label">Filière souhaitée</label>
                <select className="input-field" {...register('filiere_id', { required: 'Requis' })}>
                  <option value="">Sélectionner une filière</option>
                  {filieres.map((f) => (
                    <option key={f.id} value={f.id}>{f.nom_filiere || f.nom}</option>
                  ))}
                </select>
              </div>

            <button type="submit" className="btn-primary w-full" disabled={createCandidatMutation.isPending}>
              {createCandidatMutation.isPending ? 'Enregistrement...' : 'Continuer'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Documents Upload */}
      {(step === 2 || (step === 1 && candidat && !candidat.enrolement)) && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Documents requis</h2>
          <div className="space-y-4">
            {['photo_identite', 'acte_naissance', 'diplome', 'certificat_nationalite'].map((doc) => (
              <div key={doc} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-400 transition-colors">
                <label className="cursor-pointer block">
                  <div className="flex items-center gap-3">
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-700">
                        {doc === 'photo_identite' && 'Photo d\'identité'}
                        {doc === 'acte_naissance' && 'Acte de naissance'}
                        {doc === 'diplome' && 'Diplôme ou attestation'}
                        {doc === 'certificat_nationalite' && 'Certificat de nationalité'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {uploadedFiles[doc] ? uploadedFiles[doc].name : 'Cliquez pour téléverser'}
                      </p>
                    </div>
                    {uploadedFiles[doc] && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500 ml-auto" />
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(doc, e.target.files[0])}
                  />
                </label>
              </div>
            ))}

            <button
              onClick={onSubmitStep2}
              className="btn-primary w-full"
              disabled={createEnrolementMutation.isPending || Object.keys(uploadedFiles).length < 2}
            >
              {createEnrolementMutation.isPending ? 'Soumission...' : 'Soumettre mon enrôlement'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="card text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrôlement soumis !</h2>
          <p className="text-gray-600">
            Votre dossier est en cours de traitement. Vous recevrez un email de confirmation.
          </p>
        </div>
      )}
    </div>
  )
}
