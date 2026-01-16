import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  total_candidats: number;
  total_enrolements: number;
  total_paiements: number;
  montant_total: number;
  par_filiere?: Array<{ nom: string; count: number }>;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [departements, setDepartements] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchFilieres();
    fetchDepartements();
  }, []);

  const fetchStats = async () => {
    try {
      const [candidatsRes, enrolementsRes, paiementsRes] = await Promise.all([
        axios.get('/candidats'),
        axios.get('/enrolements'),
        axios.get('/paiements'),
      ]);

      const totalCandidats = candidatsRes.data.meta?.total || candidatsRes.data.data?.length || 0;
      const totalEnrolements = enrolementsRes.data.meta?.total || enrolementsRes.data.data?.length || 0;
      const paiements = paiementsRes.data.data || [];
      const montantTotal = paiements.reduce((sum: number, p: any) => sum + (p.montant || 0), 0);

      setStats({
        total_candidats: totalCandidats,
        total_enrolements: totalEnrolements,
        total_paiements: paiements.length,
        montant_total: montantTotal,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilieres = async () => {
    try {
      const response = await axios.get('/filieres');
      setFilieres(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des filières', error);
    }
  };

  const fetchDepartements = async () => {
    try {
      const response = await axios.get('/departements');
      setDepartements(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des départements', error);
    }
  };

  const exportListe = async (type: 'filiere' | 'departement', id: number) => {
    try {
      const endpoint = type === 'filiere' 
        ? `/candidats/export?filiere_id=${id}`
        : `/candidats/export?departement_id=${id}`;
      
      const response = await axios.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `liste_${type}_${id}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erreur lors de l\'export', error);
      alert('Erreur lors de l\'export');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">SGEE - Administration</h1>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                Tableau de bord
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span>Bonjour, {user?.prenom} {user?.nom}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Chargement des statistiques...</p>
            </div>
          ) : (
            <>
              {/* Statistiques générales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Total Candidats</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats?.total_candidats || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Enrôlements</h3>
                  <p className="text-3xl font-bold text-green-600">{stats?.total_enrolements || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Paiements</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats?.total_paiements || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Montant Total</h3>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats?.montant_total?.toLocaleString() || 0} FCFA
                  </p>
                </div>
              </div>

              {/* Gestion des filières */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Filières</h3>
                  <Link
                    to="/admin/filieres"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Gérer
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filieres.slice(0, 6).map((filiere) => (
                    <div key={filiere.id} className="border p-4 rounded">
                      <h4 className="font-medium">{filiere.nom_filiere}</h4>
                      <p className="text-sm text-gray-600">{filiere.departement?.nom_departement}</p>
                      <button
                        onClick={() => exportListe('filiere', filiere.id)}
                        className="mt-2 text-blue-600 text-sm hover:underline"
                      >
                        Exporter liste
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gestion des départements */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Départements</h3>
                  <Link
                    to="/admin/departements"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Gérer
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {departements.map((departement) => (
                    <div key={departement.id} className="border p-4 rounded">
                      <h4 className="font-medium">{departement.nom_departement}</h4>
                      <button
                        onClick={() => exportListe('departement', departement.id)}
                        className="mt-2 text-blue-600 text-sm hover:underline"
                      >
                        Exporter liste
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
