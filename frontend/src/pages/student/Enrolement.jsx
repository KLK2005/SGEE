import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { CloudArrowUpIcon, CheckCircleIcon, DocumentIcon, ChevronLeftIcon, ChevronRightIcon, BuildingLibraryIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Enrolement() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEcole, setSelectedEcole] = useState(null)
  const [currentEcoleIndex, setCurrentEcoleIndex] = useState(0)
  const [selectedDepartement, setSelectedDepartement] = useState(null)
  const [selectedFiliere, setSelectedFiliere] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  // Fetch écoles
  const { data: ecolesResponse } = useQuery({
    queryKey: ['ecoles'],
    queryFn: async () => (await api.get('/ecoles')).data,
  })

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

  // Fetch departements
  const { data: departementsResponse } = useQuery({
    queryKey: ['departements'],
    queryFn: async () => (await api.get('/departements')).data,
  })

  // Fetch concours
  const { data: concoursResponse } = useQuery({
    queryKey: ['concours'],
    queryFn: async () => (await api.get('/concours')).data,
  })

  const ecoles = ecolesResponse?.data || []
  const candidat = candidatResponse?.data
  const filieres = filieresResponse?.data || []
  const departements = departementsResponse?.data || []
  const concours = concoursResponse?.data || []

  // Filtrer les départements, filières et concours de l'école sélectionnée
  const ecoleDepartements = selectedEcole 
    ? departements.filter(d => d.ecole_id === selectedEcole.id)
    : []
  
  const ecoleFilieres = selectedEcole && selectedDepartement
    ? filieres.filter(f => f.ecole_id === selectedEcole.id && f.departement_id === selectedDepartement.id)
    : selectedEcole
    ? filieres.filter(f => f.ecole_id === selectedEcole.id)
    : []
  
  const ecoleConcours = selectedEcole
    ? concours.filter(c => c.ecole_id === selectedEcole.id)
    : []

  // Determine initial step based on candidat status
  useEffect(() => {
    if (candidat) {
      if (candidat.enrolement) {
        setStep(4) // Already enrolled
      } else {
        setStep(2) // Has candidat, needs to select school
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

  const handleSelectEcole = (ecole) => {
    setSelectedEcole(ecole)
    setStep(3)
  }

  const onSubmitStep3 = async (data) => {
    if (!selectedEcole) {
      toast.error('Veuillez sélectionner une école')
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('candidat_id', candidat.id)
      formData.append('ecole_id', selectedEcole.id)
      formData.append('departement_id', data.departement_id)
      formData.append('filiere_id', data.filiere_id)
      formData.append('niveau', data.niveau)
      
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

  const nextEcole = () => {
    if (currentEcoleIndex < ecoles.length - 1) {
      setCurrentEcoleIndex(currentEcoleIndex + 1)
    }
  }

  const prevEcole = () => {
    if (currentEcoleIndex > 0) {
      setCurrentEcoleIndex(currentEcoleIndex - 1)
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
  if (candidat?.enrolement || step === 4) {
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Enrôlement</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        {[
          { num: 1, label: 'Informations' },
          { num: 2, label: 'Sélectionner École' },
          { num: 3, label: 'Documents' },
          { num: 4, label: 'Confirmation' }
        ].map((s, index) => (
          <div key={s.num} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.num ? <CheckCircleIcon className="w-6 h-6" /> : s.num}
              </div>
              <span className="text-xs mt-1 text-gray-500 whitespace-nowrap">{s.label}</span>
            </div>
            {index < 3 && (
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
                <input type="text" className="input-field" defaultValue="Camerounaise" {...register('nationalite', { required: 'Requis' })} />
              </div>
            </div>

            <div>
              <label className="label">Téléphone *</label>
              <input type="tel" className="input-field" placeholder="+237 XXX XXX XXX" {...register('telephone', { required: 'Requis' })} />
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

      {/* Step 2: Select School */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Sélectionner une école</h2>
          
          {ecoles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune école disponible</p>
          ) : (
            <div className="space-y-4">
              {/* School Slider */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg p-8 min-h-[500px] flex flex-col justify-between">
                  {ecoles[currentEcoleIndex] && (
                    <div className="space-y-6">
                      {/* Logo */}
                      {ecoles[currentEcoleIndex].logo_url && (
                        <div className="flex justify-center">
                          <img
                            src={ecoles[currentEcoleIndex].logo_url}
                            alt={ecoles[currentEcoleIndex].nom_ecole}
                            className="w-40 h-40 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* School Name */}
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {ecoles[currentEcoleIndex].nom_ecole}
                        </h3>
                        {ecoles[currentEcoleIndex].type_ecole && (
                          <p className="text-lg text-purple-600 font-semibold">
                            {ecoles[currentEcoleIndex].type_ecole}
                          </p>
                        )}
                      </div>

                      {/* School Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {ecoles[currentEcoleIndex].ville && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase">Ville</p>
                            <p className="font-semibold text-gray-900">{ecoles[currentEcoleIndex].ville}</p>
                          </div>
                        )}
                        
                        {ecoles[currentEcoleIndex].telephone && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500 uppercase">Téléphone</p>
                            <p className="font-semibold text-gray-900">{ecoles[currentEcoleIndex].telephone}</p>
                          </div>
                        )}
                        
                        {ecoles[currentEcoleIndex].email && (
                          <div className="bg-white rounded-lg p-3 col-span-2">
                            <p className="text-xs text-gray-500 uppercase">Email</p>
                            <p className="font-semibold text-gray-900 truncate">{ecoles[currentEcoleIndex].email}</p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {ecoles[currentEcoleIndex].description && (
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-gray-700 text-center italic">
                            "{ecoles[currentEcoleIndex].description}"
                          </p>
                        </div>
                      )}

                      {/* School Programs Info */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white rounded-lg p-3">
                          <AcademicCapIcon className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                          <p className="text-xs text-gray-500">Départements</p>
                          <p className="font-bold text-lg text-gray-900">{ecoleDepartements.length}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <BuildingLibraryIcon className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                          <p className="text-xs text-gray-500">Filières</p>
                          <p className="font-bold text-lg text-gray-900">{ecoleFilieres.length}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <CheckCircleIcon className="w-6 h-6 mx-auto text-green-600 mb-1" />
                          <p className="text-xs text-gray-500">Concours</p>
                          <p className="font-bold text-lg text-gray-900">{ecoleConcours.length}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevEcole}
                  disabled={currentEcoleIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextEcole}
                  disabled={currentEcoleIndex === ecoles.length - 1}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  École {currentEcoleIndex + 1} sur {ecoles.length}
                </div>
                <div className="flex gap-1">
                  {ecoles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentEcoleIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentEcoleIndex ? 'bg-primary-600 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <button
                onClick={() => handleSelectEcole(ecoles[currentEcoleIndex])}
                className="btn-primary w-full py-3 text-lg font-semibold"
              >
                Sélectionner cette école
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: School Details & Documents */}
      {step === 3 && selectedEcole && (
        <div className="space-y-4">
          {/* School Info Card */}
          <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-4">
              {selectedEcole.logo_url && (
                <img
                  src={selectedEcole.logo_url}
                  alt={selectedEcole.nom_ecole}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEcole.nom_ecole}</h2>
                <p className="text-gray-600">{selectedEcole.type_ecole}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedEcole.ville} • {selectedEcole.telephone}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Form */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-6">Informations du concours</h2>
            <form onSubmit={handleSubmit(onSubmitStep3)} className="space-y-6">
              
              {/* Département Selection */}
              <div>
                <label className="label flex items-center gap-2">
                  <span>Département *</span>
                  {ecoleDepartements.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {ecoleDepartements.length} disponible(s)
                    </span>
                  )}
                </label>
                <select 
                  className="input-field" 
                  {...register('departement_id', { required: 'Requis' })}
                  onChange={(e) => {
                    const dept = ecoleDepartements.find(d => d.id === parseInt(e.target.value))
                    setSelectedDepartement(dept)
                  }}
                >
                  <option value="">Sélectionner un département</option>
                  {ecoleDepartements.map((d) => (
                    <option key={d.id} value={d.id}>{d.nom_departement}</option>
                  ))}
                </select>
                {errors.departement_id && <p className="text-red-500 text-sm">{errors.departement_id.message}</p>}
                {ecoleDepartements.length === 0 && (
                  <p className="text-orange-600 text-sm mt-1">Aucun département disponible pour cette école</p>
                )}
              </div>

              {/* Filière Selection */}
              <div>
                <label className="label flex items-center gap-2">
                  <span>Filière *</span>
                  {ecoleFilieres.length > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {ecoleFilieres.length} disponible(s)
                    </span>
                  )}
                </label>
                <select 
                  className="input-field" 
                  {...register('filiere_id', { required: 'Requis' })}
                  onChange={(e) => {
                    const fil = ecoleFilieres.find(f => f.id === parseInt(e.target.value))
                    setSelectedFiliere(fil)
                  }}
                >
                  <option value="">Sélectionner une filière</option>
                  {ecoleFilieres.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom_filiere} {f.niveau && `(${f.niveau})`}
                    </option>
                  ))}
                </select>
                {errors.filiere_id && <p className="text-red-500 text-sm">{errors.filiere_id.message}</p>}
                {ecoleFilieres.length === 0 && (
                  <p className="text-orange-600 text-sm mt-1">Veuillez d'abord sélectionner un département</p>
                )}
              </div>

              {/* Niveau Selection */}
              <div>
                <label className="label">Niveau *</label>
                <select className="input-field" {...register('niveau', { required: 'Requis' })}>
                  <option value="">Sélectionner un niveau</option>
                  <option value="L1">Licence 1</option>
                  <option value="L2">Licence 2</option>
                  <option value="L3">Licence 3</option>
                  <option value="M1">Master 1</option>
                  <option value="M2">Master 2</option>
                </select>
                {errors.niveau && <p className="text-red-500 text-sm">{errors.niveau.message}</p>}
              </div>

              {/* Concours Info */}
              {ecoleConcours.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Concours disponibles</h3>
                  <div className="space-y-2">
                    {ecoleConcours.slice(0, 3).map((c) => (
                      <div key={c.id} className="text-sm text-blue-800">
                        <p className="font-medium">{c.nom_concours}</p>
                        {c.date_concours && (
                          <p className="text-xs text-blue-600">
                            📅 {new Date(c.date_concours).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    ))}
                    {ecoleConcours.length > 3 && (
                      <p className="text-xs text-blue-600 pt-2">+{ecoleConcours.length - 3} autres concours</p>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DocumentIcon className="w-5 h-5" />
                  Documents requis
                </h3>
                <p className="text-gray-500 text-sm mb-4">Formats: PDF, JPG, PNG (max 5MB)</p>

                <div className="space-y-4">
                  {[
                    { key: 'photo_identite', label: 'Photo d\'identité', required: true },
                    { key: 'acte_naissance', label: 'Acte de naissance', required: true },
                    { key: 'diplome', label: 'Diplôme ou attestation', required: false },
                    { key: 'certificat_nationalite', label: 'Certificat de nationalité', required: false }
                  ].map((doc) => (
                    <div 
                      key={doc.key} 
                      className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                        uploadedFiles[doc.key] ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
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
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEcole(null)
                    setStep(2)
                  }}
                  className="btn-secondary flex-1"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={isSubmitting || !uploadedFiles.photo_identite || !uploadedFiles.acte_naissance}
                >
                  {isSubmitting ? 'Soumission...' : 'Soumettre mon enrôlement'}
                </button>
              </div>
              
              {(!uploadedFiles.photo_identite || !uploadedFiles.acte_naissance) && (
                <p className="text-sm text-orange-600 text-center">
                  ⚠️ Photo d'identité et acte de naissance requis
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
