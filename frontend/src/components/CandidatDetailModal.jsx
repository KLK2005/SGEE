import { useState } from 'react'
import {
  XMarkIcon,
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

export default function CandidatDetailModal({ candidat, onClose, onValidate, onReject, onDownloadFiche }) {
  const [activeTab, setActiveTab] = useState('info')

  const tabs = [
    { id: 'info', name: 'Informations personnelles', icon: UserIcon },
    { id: 'academic', name: 'Parcours académique', icon: AcademicCapIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'enrolement', name: 'Enrôlement', icon: CheckCircleIcon },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      valide: 'bg-green-100 text-green-800',
      rejete: 'bg-red-100 text-red-800',
      en_attente: 'bg-yellow-100 text-yellow-800',
      en_cours: 'bg-blue-100 text-blue-800',
      nouveau: 'bg-gray-100 text-gray-800',
    }
    const labels = {
      valide: 'Validé', rejete: 'Rejeté', en_attente: 'En attente',
      en_cours: 'En cours', nouveau: 'Nouveau',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.nouveau}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-primary-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {candidat.nom} {candidat.prenom}
            </h2>
            <p className="text-sm text-gray-600 mt-1">N° {candidat.numero_dossier}</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(candidat.enrolement?.statut_enrolement || candidat.statut_candidat)}
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary-600" />
                    Identité
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-900">{candidat.nom} {candidat.prenom}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sexe</p>
                      <p className="font-medium text-gray-900">{candidat.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="font-medium text-gray-900">{candidat.date_naissance || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lieu de naissance</p>
                      <p className="font-medium text-gray-900">{candidat.lieu_naissance || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nationalité</p>
                      <p className="font-medium text-gray-900">{candidat.nationalite || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-primary-600" />
                    Contact
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{candidat.telephone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{candidat.email || '-'}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mt-6">
                    <MapPinIcon className="w-5 h-5 text-primary-600" />
                    Adresse
                  </h3>
                  <div className="space-y-3 pl-7">
                    <div>
                      <p className="text-sm text-gray-500">Pays</p>
                      <p className="font-medium text-gray-900">{candidat.pays || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ville</p>
                      <p className="font-medium text-gray-900">{candidat.ville || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quartier</p>
                      <p className="font-medium text-gray-900">{candidat.quartier || '-'}</p>
                    </div>
                    {candidat.adresse_complete && (
                      <div>
                        <p className="text-sm text-gray-500">Adresse complète</p>
                        <p className="font-medium text-gray-900">{candidat.adresse_complete}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900">Filière choisie</h3>
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="font-semibold text-primary-900">{candidat.filiere?.nom_filiere || '-'}</p>
                    <p className="text-sm text-primary-700 mt-1">
                      {candidat.filiere?.departement?.nom_departement || '-'}
                    </p>
                    <p className="text-sm text-primary-600 mt-1">
                      Niveau: {candidat.filiere?.niveau || '-'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900">Niveau d'études</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Niveau actuel</p>
                      <p className="font-medium text-gray-900">{candidat.niveau_etude || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dernier diplôme</p>
                      <p className="font-medium text-gray-900">{candidat.dernier_diplome || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Établissement d'origine</p>
                      <p className="font-medium text-gray-900">{candidat.etablissement_origine || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {(candidat.serie_bac || candidat.mention_bac || candidat.annee_obtention) && (
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Baccalauréat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {candidat.serie_bac && (
                      <div>
                        <p className="text-sm text-gray-500">Série</p>
                        <p className="font-medium text-gray-900">{candidat.serie_bac}</p>
                      </div>
                    )}
                    {candidat.mention_bac && (
                      <div>
                        <p className="text-sm text-gray-500">Mention</p>
                        <p className="font-medium text-gray-900">{candidat.mention_bac}</p>
                      </div>
                    )}
                    {candidat.annee_obtention && (
                      <div>
                        <p className="text-sm text-gray-500">Année d'obtention</p>
                        <p className="font-medium text-gray-900">{candidat.annee_obtention}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Documents téléversés</h3>
              {candidat.documents && candidat.documents.length > 0 ? (
                <div className="space-y-3">
                  {candidat.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.type_document.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-500">
                            Uploadé le {doc.date_upload ? new Date(doc.date_upload).toLocaleDateString('fr-FR') : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doc.statut_verification === 'valide' ? 'bg-green-100 text-green-700' :
                          doc.statut_verification === 'rejete' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.statut_verification === 'valide' ? 'Validé' :
                           doc.statut_verification === 'rejete' ? 'Rejeté' : 'En attente'}
                        </span>
                        {doc.fichier && (
                          <a
                            href={`http://127.0.0.1:8000/storage/${doc.fichier}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Voir
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Aucun document téléversé</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'enrolement' && (
            <div className="space-y-6">
              {candidat.enrolement ? (
                <>
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg text-gray-900">Statut de l'enrôlement</h3>
                      {getStatusBadge(candidat.enrolement.statut_enrolement)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date d'enrôlement</p>
                        <p className="font-medium text-gray-900">
                          {candidat.enrolement.date_enrolement ? 
                            new Date(candidat.enrolement.date_enrolement).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Session</p>
                        <p className="font-medium text-gray-900">
                          {candidat.enrolement.session?.annee || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {candidat.paiements && candidat.paiements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-4">Paiements</h3>
                      <div className="space-y-3">
                        {candidat.paiements.map((paiement) => (
                          <div key={paiement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">
                                {Number(paiement.montant).toLocaleString()} FCFA
                              </p>
                              <p className="text-sm text-gray-500">
                                {paiement.date_paiement ? new Date(paiement.date_paiement).toLocaleDateString('fr-FR') : '-'}
                                {' • '}{paiement.mode_paiement?.replace('_', ' ')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              paiement.statut_paiement === 'valide' ? 'bg-green-100 text-green-700' :
                              paiement.statut_paiement === 'rejete' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {paiement.statut_paiement === 'valide' ? 'Payé' :
                               paiement.statut_paiement === 'rejete' ? 'Rejeté' : 'En attente'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Aucun enrôlement enregistré</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex gap-2">
            {candidat.enrolement?.statut_enrolement === 'en_attente' && (
              <>
                <button
                  onClick={() => onValidate(candidat.enrolement.id)}
                  className="btn-primary flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Valider l'enrôlement
                </button>
                <button
                  onClick={() => onReject(candidat.enrolement.id)}
                  className="btn-secondary text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                >
                  <XCircleIcon className="w-5 h-5" />
                  Rejeter
                </button>
              </>
            )}
            {candidat.enrolement && (
              <button
                onClick={() => onDownloadFiche(candidat.enrolement.id)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Télécharger la fiche
              </button>
            )}
          </div>
          <button onClick={onClose} className="btn-secondary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
