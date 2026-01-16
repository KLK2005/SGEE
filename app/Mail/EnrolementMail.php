<?php

namespace App\Mail;

use App\Models\Enrolement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class EnrolementMail extends Mailable
{
    use Queueable, SerializesModels;

    public Enrolement $enrolement;

    /**
     * Create a new message instance.
     */
    public function __construct(Enrolement $enrolement)
    {
        $this->enrolement = $enrolement;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $candidat = $this->enrolement->candidat;
        return new Envelope(
            subject: 'Fiche d\'enrôlement - ' . $candidat->nom . ' ' . $candidat->prenom,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.enrolement',
            with: [
                'enrolement' => $this->enrolement,
                'candidat' => $this->enrolement->candidat,
                'filiere' => $this->enrolement->candidat->filiere,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachments = [];
        
        if ($this->enrolement->fiche_pdf_path && Storage::disk('public')->exists($this->enrolement->fiche_pdf_path)) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->enrolement->fiche_pdf_path)
                ->as('fiche-enrolement.pdf');
        }
        
        return $attachments;
    }
}
