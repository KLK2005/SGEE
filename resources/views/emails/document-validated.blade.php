<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document validé</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">SGEE</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Système de Gestion d'Enrôlement des Étudiants</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #27ae60; margin-top: 0;">✓ Document validé</h2>
            
            <p>Bonjour <strong>{{ $document->candidat->prenom }} {{ $document->candidat->nom }}</strong>,</p>
            
            <p>Nous avons le plaisir de vous informer que votre document a été validé avec succès.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
                <p style="margin: 0;"><strong>Type de document :</strong> {{ ucfirst(str_replace('_', ' ', $document->type_document)) }}</p>
                <p style="margin: 10px 0 0 0;"><strong>Date de validation :</strong> {{ $document->date_verification ? $document->date_verification->format('d/m/Y à H:i') : now()->format('d/m/Y à H:i') }}</p>
            </div>
            
            <p>Vous pouvez maintenant continuer votre processus d'enrôlement.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ config('app.frontend_url') }}/etudiant/documents" 
                   style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Voir mes documents
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Cordialement,<br>
                L'équipe SGEE
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
