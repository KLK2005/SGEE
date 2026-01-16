<?php

namespace App\Mail;

use App\Models\Paiement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class QuitusPaiement extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Paiement $paiement,
        public ?string $pdfPath = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Quitus de paiement - SGEE',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quitus-paiement',
            with: [
                'candidat' => $this->paiement->candidat,
                'paiement' => $this->paiement,
            ],
        );
    }

    public function attachments(): array
    {
        if ($this->pdfPath && file_exists(storage_path('app/public/' . $this->pdfPath))) {
            return [
                Attachment::fromPath(storage_path('app/public/' . $this->pdfPath))
                    ->as('quitus_paiement.pdf')
                    ->withMime('application/pdf'),
            ];
        }
        return [];
    }
}
