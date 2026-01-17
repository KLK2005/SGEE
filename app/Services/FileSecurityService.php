<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileSecurityService
{
    /**
     * Valider un fichier uploadé
     */
    public function validateFile($file, array $allowedMimes = [], int $maxSize = 5120): array
    {
        $errors = [];

        // Vérifier la taille
        if ($file->getSize() > $maxSize * 1024) {
            $errors[] = "Le fichier est trop volumineux (max {$maxSize}KB)";
        }

        // Vérifier le type MIME
        if (!empty($allowedMimes) && !in_array($file->getMimeType(), $allowedMimes)) {
            $errors[] = "Type de fichier non autorisé";
        }

        // Vérifier l'extension
        $extension = strtolower($file->getClientOriginalExtension());
        $dangerousExtensions = ['php', 'exe', 'bat', 'cmd', 'sh', 'js', 'html', 'htm'];
        if (in_array($extension, $dangerousExtensions)) {
            $errors[] = "Extension de fichier dangereuse détectée";
        }

        // Vérifier le contenu du fichier (signatures magiques)
        if (!$this->verifyFileSignature($file)) {
            $errors[] = "Le contenu du fichier ne correspond pas à son extension";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Vérifier la signature magique du fichier
     */
    private function verifyFileSignature($file): bool
    {
        $handle = fopen($file->getRealPath(), 'rb');
        $bytes = fread($handle, 8);
        fclose($handle);

        $signatures = [
            // PDF
            'pdf' => ['25504446'],
            // JPEG
            'jpg' => ['FFD8FF'],
            'jpeg' => ['FFD8FF'],
            // PNG
            'png' => ['89504E47'],
        ];

        $extension = strtolower($file->getClientOriginalExtension());
        if (!isset($signatures[$extension])) {
            return true; // Pas de vérification pour ce type
        }

        $fileHex = strtoupper(bin2hex($bytes));
        foreach ($signatures[$extension] as $signature) {
            if (strpos($fileHex, $signature) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Générer un nom de fichier sécurisé
     */
    public function generateSecureFileName($originalName): string
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $timestamp = now()->format('YmdHis');
        $random = Str::random(16);
        
        return "{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Scanner un fichier pour détecter les malwares (basique)
     */
    public function scanFile($file): bool
    {
        // Vérifier les patterns suspects dans le contenu
        $content = file_get_contents($file->getRealPath());
        
        $suspiciousPatterns = [
            '/<\?php/i',
            '/eval\s*\(/i',
            '/base64_decode/i',
            '/exec\s*\(/i',
            '/system\s*\(/i',
            '/passthru\s*\(/i',
            '/shell_exec/i',
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Créer un hash du fichier pour vérification d'intégrité
     */
    public function generateFileHash($filePath): string
    {
        return hash_file('sha256', $filePath);
    }

    /**
     * Vérifier l'intégrité d'un fichier
     */
    public function verifyFileIntegrity($filePath, $expectedHash): bool
    {
        $currentHash = $this->generateFileHash($filePath);
        return hash_equals($expectedHash, $currentHash);
    }

    /**
     * Nettoyer les métadonnées EXIF d'une image
     */
    public function stripImageMetadata($imagePath): bool
    {
        try {
            $extension = strtolower(pathinfo($imagePath, PATHINFO_EXTENSION));
            
            if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                return true;
            }

            // Charger l'image
            switch ($extension) {
                case 'jpg':
                case 'jpeg':
                    $image = imagecreatefromjpeg($imagePath);
                    if ($image) {
                        imagejpeg($image, $imagePath, 90);
                        imagedestroy($image);
                    }
                    break;
                case 'png':
                    $image = imagecreatefrompng($imagePath);
                    if ($image) {
                        imagepng($image, $imagePath, 9);
                        imagedestroy($image);
                    }
                    break;
            }

            return true;
        } catch (\Exception $e) {
            \Log::error('Erreur nettoyage métadonnées: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtenir les informations sécurisées d'un fichier
     */
    public function getFileInfo($file): array
    {
        return [
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
            'hash' => hash_file('sha256', $file->getRealPath()),
        ];
    }
}
