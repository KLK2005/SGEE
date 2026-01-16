import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">SGEE</h1>
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
          <h2 className="text-2xl font-bold mb-6">Tableau de bord étudiant</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/enrolement"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">Enrôlement</h3>
              <p className="text-gray-600">Effectuer votre enrôlement en ligne</p>
            </Link>

            <Link
              to="/paiements"
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">Paiements</h3>
              <p className="text-gray-600">Consulter vos paiements et télécharger vos quitus</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
