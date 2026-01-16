<?php

namespace App\Mail;

use App\Models\Paiement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class QuitusMail extends Mailable
{
    use Queueable, SerializesModels;

    public Paiement $paiement;

    /**
     * Create a new message instance.
     */
    public function __construct(Paiement $paiement)
    {
        $this->paiement = $paiement;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $candidat = $this->paiement->candidat;
        return new Envelope(
            subject: 'Quitus de paiement - ' . $candidat->nom . ' ' . $candidat->prenom,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.quitus',
            with: [
                'paiement' => $this->paiement,
                'candidat' => $this->paiement->candidat,
                'enrolement' => $this->paiement->enrolement,
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
        
        if ($this->paiement->quitus_pdf_path && Storage::disk('public')->exists($this->paiement->quitus_pdf_path)) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->paiement->quitus_pdf_path)
                ->as('quitus-paiement.pdf');
        }
        
        return $attachments;
    }
}
