import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    // Envoyer les paramètres à la fenêtre parente
    if (window.opener) {
      const params = new URLSearchParams(location.search);
      const error = params.get('error');
      
      if (error) {
        window.opener.postMessage({
          type: 'oauth-error',
          message: error
        }, window.location.origin);
      } else {
        window.opener.postMessage({
          type: 'oauth-success',
          search: location.search
        }, window.location.origin);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authentification en cours...</p>
        <p className="mt-2 text-sm text-gray-500">Veuillez patienter</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
