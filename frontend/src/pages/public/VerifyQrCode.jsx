import { useState } from 'react'
import { QrCodeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function VerifyQrCode() {
  const [qrData, setQrData] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!qrData.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_data: qrData }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, message: 'Erreur de connexion au serveur' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCodeIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vérification QR Code</h1>
          <p className="text-gray-500 mt-2">Collez le contenu du QR Code scanné</p>
        </div>

        <div className="space-y-4">
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
            rows="4"
            placeholder='{"type":"enrolement","enrolement_id":1,...}'
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
          />

          <button
            onClick={handleVerify}
            disabled={loading || !qrData.trim()}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Vérification...' : 'Vérifier l\'authenticité'}
          </button>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
              ) : (
                <XCircleIcon className="w-8 h-8 text-red-500" />
              )}
              <div>
                <p className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Document authentique' : 'Document non valide'}
                </p>
                <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.message}
                </p>
              </div>
            </div>
            
            {result.success && result.data && (
              <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                {result.data.candidat && (
                  <>
                    <p className="text-sm"><strong>Nom:</strong> {result.data.candidat.nom} {result.data.candidat.prenom}</p>
                    <p className="text-sm"><strong>N° Dossier:</strong> {result.data.candidat.numero_dossier}</p>
                  </>
                )}
                {result.data.type && (
                  <p className="text-sm"><strong>Type:</strong> {result.data.type === 'enrolement' ? 'Fiche d\'enrôlement' : 'Quitus de paiement'}</p>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          SGEE - Système de Gestion d'Enrôlement des Étudiants
        </p>
      </div>
    </div>
  )
}
