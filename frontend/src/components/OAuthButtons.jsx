import { useState } from 'react';
import axios from 'axios';

// Variable pour activer/désactiver OAuth
// Mettre à true quand Laravel Socialite est installé et configuré
const OAUTH_ENABLED = true;

const OAuthButtons = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(null);

  // Ne rien afficher si OAuth est désactivé
  if (!OAUTH_ENABLED) {
    return null;
  }

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(provider);
      
      // Obtenir l'URL de redirection OAuth
      const response = await axios.get(`/api/auth/${provider}`);
      
      if (response.data.success) {
        // Ouvrir une popup pour l'authentification OAuth
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          response.data.url,
          'OAuth Login',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Écouter les messages de la popup
        const handleMessage = async (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'oauth-success') {
            popup.close();
            window.removeEventListener('message', handleMessage);
            
            // Récupérer le token depuis le callback
            const callbackResponse = await axios.get(
              `/api/auth/${provider}/callback${event.data.search}`
            );
            
            if (callbackResponse.data.success) {
              onSuccess(callbackResponse.data.data);
            } else {
              onError(callbackResponse.data.message);
            }
          } else if (event.data.type === 'oauth-error') {
            popup.close();
            window.removeEventListener('message', handleMessage);
            onError(event.data.message);
          }
        };

        window.addEventListener('message', handleMessage);
        
        // Vérifier si la popup a été fermée
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener('message', handleMessage);
            setLoading(null);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur OAuth:', error);
      
      // Messages d'erreur plus clairs
      let errorMessage = 'Erreur lors de la connexion OAuth';
      
      if (error.response?.data?.error === 'SOCIALITE_NOT_INSTALLED') {
        errorMessage = '⚠️ OAuth non disponible : Laravel Socialite n\'est pas installé. Consultez GUIDE_OAUTH_IMPLEMENTATION.md';
      } else if (error.response?.data?.error === 'OAUTH_NOT_CONFIGURED') {
        errorMessage = '⚠️ OAuth non configuré : Les credentials ne sont pas définis dans le fichier .env';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      onError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Bouton Google */}
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={loading !== null}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'google' ? (
            <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </>
          )}
        </button>

        {/* Bouton Microsoft */}
        <button
          type="button"
          onClick={() => handleOAuthLogin('microsoft')}
          disabled={loading !== null}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'microsoft' ? (
            <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Microsoft
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
