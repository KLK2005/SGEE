import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Filiere {
  id: number;
  nom_filiere: string;
}

interface Concours {
  id: number;
  nom_concours: string;
}

interface SessionAcademique {
  id: number;
  annee: string;
}

interface CentreDepot {
  id: number;
  nom: string;
}

const Enrolement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [concours, setConcours] = useState<Concours[]>([]);
  const [sessions, setSessions] = useState<SessionAcademique[]>([]);
  const [centresDepot, setCentresDepot] = useState<CentreDepot[]>([]);
  
  const [formData, setFormData] = useState({
    candidat_id: '',
    concours_id: '',
    session_id: '',
    centre_depot_id: '',
    date_enrolement: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [filieresRes, concoursRes, sessionsRes, centresRes] = await Promise.all([
        axios.get('/filieres'),
        axios.get('/concours'),
        axios.get('/sessions-academiques'),
        axios.get('/centre-depot'),
      ]).catch(() => {
        // Fallback si certaines routes ne sont pas disponibles
        return [
          { data: { data: [] } },
          { data: { data: [] } },
          { data: { data: [] } },
          { data: { data: [] } },
        ];
      });

      setFilieres(filieresRes.data.data || filieresRes.data || []);
      setConcours(concoursRes.data.data || concoursRes.data || []);
      setSessions(sessionsRes.data.data || sessionsRes.data || []);
      setCentresDepot(centresRes.data.data || centresRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await axios.post('/enrolements', formData);
      setMessage({ 
        type: 'success', 
        text: 'Enrôlement effectué avec succès! La fiche PDF a été envoyée par email.' 
      });
      
      // Rediriger vers le dashboard après 3 secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'enrôlement';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Formulaire d'enrôlement</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">ID Candidat *</label>
              <input
                type="text"
                name="candidat_id"
                value={formData.candidat_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
                placeholder="Votre numéro de dossier"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Concours *</label>
              <select
                name="concours_id"
                value={formData.concours_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionner un concours</option>
                {concours.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom_concours}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Session académique *</label>
              <select
                name="session_id"
                value={formData.session_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionner une session</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>{s.annee}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Centre de dépôt *</label>
              <select
                name="centre_depot_id"
                value={formData.centre_depot_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionner un centre</option>
                {centresDepot.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date d'enrôlement *</label>
              <input
                type="date"
                name="date_enrolement"
                value={formData.date_enrolement}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : 'S\'enrôler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Enrolement;
