<?php

namespace App\Mail;

use App\Models\Enrolement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class EnrolementConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Enrolement $enrolement,
        public ?string $pdfPath = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation d\'enrôlement - SGEE',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.enrolement-confirmation',
            with: [
                'candidat' => $this->enrolement->candidat,
                'enrolement' => $this->enrolement,
            ],
        );
    }

    public function attachments(): array
    {
        if ($this->pdfPath && file_exists(storage_path('app/public/' . $this->pdfPath))) {
            return [
                Attachment::fromPath(storage_path('app/public/' . $this->pdfPath))
                    ->as('fiche_enrolement.pdf')
                    ->withMime('application/pdf'),
            ];
        }
        return [];
    }
}
