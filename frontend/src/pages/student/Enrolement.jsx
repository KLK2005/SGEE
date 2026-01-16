import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import { candidatService } from '../../services/candidatService'
import { enrolementService } from '../../services/enrolementService'
import { filiereService } from '../../services/filiereService'
import toast from 'react-hot-toast'
import { CloudArrowUpIcon, CheckCircleIcon, DocumentIcon } from '@heroicons/react/24/outline'

export default function Enrolement() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch existing candidat data for current user
  const { data: candidatData, isLoading: loadingCandidat, refetch: refetchCandidat } = useQuery({
    queryKey: ['my-candidat', user?.id],
    queryFn: async () => {
      const response = await candidatService.getAll({ utilisateur_id: user?.id })
      return response
    },
    enabled: !!user?.id,
  })

  // Fetch filieres
  const { data: filieresData } = useQuery({
    queryKey: ['filieres'],
    queryFn: () => filiereService.getAll(),
  })

  const candidat = candidatData?.data?.[0] || null
  const filieres = filieresData?.data || []

  // Determine initial step based on candidat status
  useEffect(() => {
    if (candidat) {
      if (candidat.enrolement) {
        setStep(3) // Already enrolled
      } else {
        setStep(2) // Has candidat, needs documents
      }
    } else {
      setStep(1) // New user, needs to fill info
    }
  }, [candidat])

  // Create candidat mutation
  const createCandidatMutation = useMutation({
    mutationFn: candidatService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['my-candidat'])
      toast.success('Informations enregistrées avec succès!')
      refetchCandidat()
      setStep(2)
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de l\'enregistrement'
      toast.error(message)
    },
  })

  // Create enrolement mutation
  const createEnrolementMutation = useMutation({
    mutationFn: enrolementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-candidat'])
      toast.success('Enrôlement soumis avec succès!')
      refetchCandidat()
      setStep(3)
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.response?.data?.error || 'Erreur lors de la soumission'
      toast.error(message)
    },
  })

  const onSubmitStep1 = async (data) => {
    createCandidatMutation.mutate({
      ...data,
      email: user?.email,
    })
  }

  const onSubmitStep2 = async () => {
    if (!candidat) {
      toast.error('Veuillez d\'abord remplir vos informations personnelles')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create FormData with candidat_id and files
      const formData = new FormData()
      formData.append('candidat_id', candidat.id)
      
      // Add uploaded files
      Object.keys(uploadedFiles).forEach(key => {
        if (uploadedFiles[key]) {
          formData.append(key, uploadedFiles[key])
        }
      })

      await createEnrolementMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (field, file) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 5MB)')
        return
      }
      setUploadedFiles(prev => ({ ...prev, [field]: file }))
      toast.success(`${file.name} sélectionné`)
    }
  }

  if (loadingCandidat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If already enrolled, show status
  if (candidat?.enrolement || step === 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrôlement soumis</h2>
          <p className="text-gray-600 mb-4">
            Votre dossier d'enrôlement a été soumis avec succès.
          </p>
          
          {candidat && (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500">Numéro de dossier</p>
                <p className="text-xl font-bold text-primary-600">{candidat.numero_dossier}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="text-lg font-semibold">{candidat.nom} {candidat.prenom}</p>
              </div>

              {candidat.enrolement && (
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
                     candidat.enrolement.statut_enrolement === 'rejete' ? 'Rejeté' : 'En attente de validation'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Enrôlement</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: 'Informations' },
          { num: 2, label: 'Documents' },
          { num: 3, label: 'Confirmation' }
        ].map((s, index) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.num ? <CheckCircleIcon className="w-6 h-6" /> : s.num}
              </div>
              <span className="text-xs mt-1 text-gray-500">{s.label}</span>
            </div>
            {index < 2 && (
              <div className={`w-16 h-1 mx-2 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Votre nom"
                  {...register('nom', { required: 'Le nom est requis' })}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
              </div>
              <div>
                <label className="label">Prénom *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Votre prénom"
                  {...register('prenom', { required: 'Le prénom est requis' })}
                />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date de naissance *</label>
                <input 
                  type="date" 
                  className="input-field" 
                  {...register('date_naissance', { required: 'La date de naissance est requise' })} 
                />
                {errors.date_naissance && <p className="text-red-500 text-sm mt-1">{errors.date_naissance.message}</p>}
              </div>
              <div>
                <label className="label">Lieu de naissance *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ville de naissance"
                  {...register('lieu_naissance', { required: 'Le lieu de naissance est requis' })} 
                />
                {errors.lieu_naissance && <p className="text-red-500 text-sm mt-1">{errors.lieu_naissance.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Sexe *</label>
                <select className="input-field" {...register('sexe', { required: 'Le sexe est requis' })}>
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe.message}</p>}
              </div>
              <div>
                <label className="label">Nationalité *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Congolaise"
                  {...register('nationalite', { required: 'La nationalité est requise' })} 
                />
                {errors.nationalite && <p className="text-red-500 text-sm mt-1">{errors.nationalite.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Téléphone *</label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="+243 XXX XXX XXX"
                {...register('telephone', { required: 'Le téléphone est requis' })} 
              />
              {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>}
            </div>

            <div>
              <label className="label">Filière souhaitée *</label>
              <select className="input-field" {...register('filiere_id', { required: 'La filière est requise' })}>
                <option value="">Sélectionner une filière</option>
                {filieres.map((f) => (
                  <option key={f.id} value={f.id}>{f.nom_filiere || f.nom}</option>
                ))}
              </select>
              {errors.filiere_id && <p className="text-red-500 text-sm mt-1">{errors.filiere_id.message}</p>}
            </div>

            <div>
              <label className="label">Dernier diplôme obtenu</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ex: Baccalauréat, Licence..."
                {...register('dernier_diplome')} 
              />
            </div>

            <div>
              <label className="label">Établissement d'origine</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Nom de votre dernier établissement"
                {...register('etablissement_origine')} 
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={createCandidatMutation.isPending}
            >
              {createCandidatMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : 'Continuer'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Documents Upload */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Documents requis</h2>
          <p className="text-gray-500 text-sm mb-4">
            Téléversez les documents nécessaires pour compléter votre dossier (formats acceptés: PDF, JPG, PNG - max 5MB)
          </p>
          
          {candidat && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Candidat:</strong> {candidat.nom} {candidat.prenom} - N° {candidat.numero_dossier}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {[
              { key: 'photo_identite', label: 'Photo d\'identité', required: true },
              { key: 'acte_naissance', label: 'Acte de naissance', required: true },
              { key: 'diplome', label: 'Diplôme ou attestation de réussite', required: false },
              { key: 'certificat_nationalite', label: 'Certificat de nationalité', required: false }
            ].map((doc) => (
              <div 
                key={doc.key} 
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  uploadedFiles[doc.key] 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <label className="cursor-pointer block">
                  <div className="flex items-center gap-3">
                    {uploadedFiles[doc.key] ? (
                      <DocumentIcon className="w-8 h-8 text-green-500" />
                    ) : (
                      <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">
                        {doc.label} {doc.required && <span className="text-red-500">*</span>}
                      </p>
                      <p className="text-sm text-gray-500">
                        {uploadedFiles[doc.key] 
                          ? uploadedFiles[doc.key].name 
                          : 'Cliquez pour téléverser'}
                      </p>
                    </div>
                    {uploadedFiles[doc.key] && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                  />
                </label>
              </div>
            ))}

            <div className="pt-4">
              <button
                onClick={onSubmitStep2}
                className="btn-primary w-full"
                disabled={isSubmitting || createEnrolementMutation.isPending || !uploadedFiles.photo_identite || !uploadedFiles.acte_naissance}
              >
                {isSubmitting || createEnrolementMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Soumission en cours...
                  </span>
                ) : 'Soumettre mon enrôlement'}
              </button>
              
              {(!uploadedFiles.photo_identite || !uploadedFiles.acte_naissance) && (
                <p className="text-sm text-orange-600 mt-2 text-center">
                  Veuillez téléverser au moins la photo d'identité et l'acte de naissance
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
