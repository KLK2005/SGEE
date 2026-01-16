import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Enrolement: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cette page sera complétée avec le formulaire d'enrôlement complet
  // Pour l'instant, c'est une structure de base

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Enrôlement</h2>
        <p className="text-gray-600">Formulaire d'enrôlement à compléter...</p>
      </div>
    </div>
  );
};

export default Enrolement;
