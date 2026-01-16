import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { CloudArrowUpIcon, CheckCircleIcon, DocumentIcon } from '@heroicons/react/24/outline'

export default function Enrolement() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch mon candidat
  const { data: candidatResponse, isLoading: loadingCandidat, refetch: refetchCandidat } = useQuery({
    queryKey: ['mon-candidat'],
    queryFn: async () => (await api.get('/mon-candidat')).data,
  })

  // Fetch filieres
  const { data: filieresResponse } = useQuery({
    queryKey: ['filieres'],
    queryFn: async () => (await api.get('/filieres')).data,
  })

  const candidat = candidatResponse?.data
  const filieres = filieresResponse?.data || []

  // Determine initial step based on candidat status
  useEffect(() => {
    if (candidat) {
      if (candidat.enrolement) {
        setStep(3) // Already enrolled
      } else {
        setStep(2) // Has candidat, needs to submit enrollment
      }
    } else {
      setStep(1) // New user, needs to fill info
    }
  }, [candidat])

  // Create candidat
  const createCandidatMutation = useMutation({
    mutationFn: async (data) => (await api.post('/candidats', data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(['mon-candidat'])
      toast.success('Informations enregistrées!')
      refetchCandidat()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    },
  })

  // Create enrolement
  const createEnrolementMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/enrolements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mon-candidat'])
      toast.success('Enrôlement soumis avec succès!')
      refetchCandidat()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la soumission')
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
      toast.error('Veuillez d\'abord remplir vos informations')
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('candidat_id', candidat.id)
      
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 5MB)')
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

  // If already enrolled
  if (candidat?.enrolement || step === 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enrôlement soumis</h2>
          <p className="text-gray-600 mb-4">Votre dossier a été soumis avec succès.</p>
          
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

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500">Filière</p>
                <p className="text-lg font-semibold">{candidat.filiere?.nom_filiere || '-'}</p>
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
                     candidat.enrolement.statut_enrolement === 'rejete' ? 'Rejeté' : 'En attente'}
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
                <input type="text" className="input-field" {...register('nom', { required: 'Requis' })} />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
              </div>
              <div>
                <label className="label">Prénom *</label>
                <input type="text" className="input-field" {...register('prenom', { required: 'Requis' })} />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date de naissance *</label>
                <input type="date" className="input-field" {...register('date_naissance', { required: 'Requis' })} />
              </div>
              <div>
                <label className="label">Lieu de naissance *</label>
                <input type="text" className="input-field" {...register('lieu_naissance', { required: 'Requis' })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Sexe *</label>
                <select className="input-field" {...register('sexe', { required: 'Requis' })}>
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="label">Nationalité *</label>
                <input type="text" className="input-field" defaultValue="Congolaise" {...register('nationalite', { required: 'Requis' })} />
              </div>
            </div>

            <div>
              <label className="label">Téléphone *</label>
              <input type="tel" className="input-field" placeholder="+243 XXX XXX XXX" {...register('telephone', { required: 'Requis' })} />
            </div>

            <div>
              <label className="label">Filière souhaitée *</label>
              <select className="input-field" {...register('filiere_id', { required: 'Requis' })}>
                <option value="">Sélectionner une filière</option>
                {filieres.map((f) => (
                  <option key={f.id} value={f.id}>{f.nom_filiere}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Dernier diplôme</label>
              <input type="text" className="input-field" placeholder="Ex: Diplôme d'État" {...register('dernier_diplome')} />
            </div>

            <div>
              <label className="label">Établissement d'origine</label>
              <input type="text" className="input-field" {...register('etablissement_origine')} />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={createCandidatMutation.isPending}>
              {createCandidatMutation.isPending ? 'Enregistrement...' : 'Continuer'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Documents */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Documents requis</h2>
          <p className="text-gray-500 text-sm mb-4">Formats: PDF, JPG, PNG (max 5MB)</p>
          
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
              { key: 'diplome', label: 'Diplôme ou attestation', required: false },
              { key: 'certificat_nationalite', label: 'Certificat de nationalité', required: false }
            ].map((doc) => (
              <div 
                key={doc.key} 
                className={`border-2 border-dashed rounded-lg p-4 ${
                  uploadedFiles[doc.key] ? 'border-green-400 bg-green-50' : 'border-gray-300'
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
                      <p className="font-medium">{doc.label} {doc.required && <span className="text-red-500">*</span>}</p>
                      <p className="text-sm text-gray-500">
                        {uploadedFiles[doc.key] ? uploadedFiles[doc.key].name : 'Cliquez pour téléverser'}
                      </p>
                    </div>
                    {uploadedFiles[doc.key] && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
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

            <button
              onClick={onSubmitStep2}
              className="btn-primary w-full mt-4"
              disabled={isSubmitting || !uploadedFiles.photo_identite || !uploadedFiles.acte_naissance}
            >
              {isSubmitting ? 'Soumission...' : 'Soumettre mon enrôlement'}
            </button>
            
            {(!uploadedFiles.photo_identite || !uploadedFiles.acte_naissance) && (
              <p className="text-sm text-orange-600 text-center">
                Photo d'identité et acte de naissance requis
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
