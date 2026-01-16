import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Paiements: React.FC = () => {
  const { user } = useAuth();
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      const response = await axios.get('/paiements');
      setPaiements(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQuitus = async (id: number) => {
    try {
      const response = await axios.get(`/paiements/${id}/download-quitus`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `quitus-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erreur lors du téléchargement', error);
    }
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Mes paiements</h2>
        {paiements.length === 0 ? (
          <p className="text-gray-600">Aucun paiement enregistré</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paiements.map((paiement: any) => (
                  <tr key={paiement.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{paiement.montant} FCFA</td>
                    <td className="px-6 py-4 whitespace-nowrap">{paiement.date_paiement}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded ${
                        paiement.statut_paiement === 'valide' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {paiement.statut_paiement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {paiement.statut_paiement === 'valide' && (
                        <button
                          onClick={() => downloadQuitus(paiement.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Télécharger quitus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Paiements;
