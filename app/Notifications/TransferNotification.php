<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TransferNotification extends Notification
{
    use Queueable;

    /**
     * @param string $type       'sent' or 'received'
     * @param string $amount     Decimal string
     * @param string $currency   Currency code
     * @param string $reference  Transaction reference (TXN-...)
     * @param string $counterpartyName  The other party's name
     * @param string|null $note  Optional transfer note
     */
    public function __construct(
        private readonly string  $type,
        private readonly string  $amount,
        private readonly string  $currency,
        private readonly string  $reference,
        private readonly string  $counterpartyName,
        private readonly ?string $note = null,
    ) {}

    /**
     * Deliver via the database channel (stored in `notifications` table).
     * Add 'mail' here to also send email if SMTP is configured.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Payload stored in the `data` column of the notifications table.
     */
    public function toDatabase(object $notifiable): array
    {
        $isSent = $this->type === 'sent';

        return [
            'type'             => $this->type,                         // 'sent' | 'received'
            'amount'           => $this->amount,
            'currency'         => $this->currency,
            'transactionId'    => $this->reference,
            'counterpartyName' => $this->counterpartyName,
            'note'             => $this->note,
            'title'            => $isSent
                ? "Transfer of {$this->amount} {$this->currency} sent to {$this->counterpartyName}"
                : "You received {$this->amount} {$this->currency} from {$this->counterpartyName}",
            'timestamp'        => now()->toIso8601String(),
        ];
    }
}
