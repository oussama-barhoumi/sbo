<?php

namespace App\Services;

/**
 * CurrencyService — Exchange rate stub for future integration.
 *
 * To integrate a live exchange rate provider:
 *   1. Inject an HTTP client (e.g., Illuminate\Http\Client\Factory)
 *   2. Call your provider (e.g., Open Exchange Rates, ECB, or Fixer.io)
 *   3. Cache results with Cache::remember('rates', now()->addHour(), ...)
 *   4. Replace getRate() body with a real API call
 *
 * Usage inside BankingService::apiDeposit():
 *   $rate = CurrencyService::getRate($fromCurrency, $toCurrency);
 *   $finalAmount = bcmul($amount, (string) $rate, 2);
 */
class CurrencyService
{
    /**
     * Fixed fallback rates relative to DH (Moroccan Dirham).
     * Replace with live data from a provider in production.
     *
     * @var array<string, float>
     */
    private const BASE_RATES_TO_DH = [
        'DH'  => 1.0,
        'MAD' => 1.0,   // DH and MAD are the same currency (Moroccan Dirham)
        'USD' => 10.05,
        'EUR' => 10.95,
    ];

    /**
     * Get the exchange rate to convert $from currency to $to currency.
     *
     * @throws \InvalidArgumentException if either currency is unsupported
     */
    public static function getRate(string $from, string $to): float
    {
        // Normalise: treat DH and MAD as identical
        $from = ($from === 'DH') ? 'MAD' : $from;
        $to   = ($to   === 'DH') ? 'MAD' : $to;

        $rates = self::BASE_RATES_TO_DH;

        if (! isset($rates[$from], $rates[$to])) {
            throw new \InvalidArgumentException(
                "Unsupported currency pair: {$from} → {$to}"
            );
        }

        if ($from === $to) {
            return 1.0;
        }

        // Convert: from → DH → to
        $toDh   = $rates[$from];
        $fromDh = $rates[$to];

        return round($toDh / $fromDh, 6);
    }

    /**
     * Convert an amount from one currency to another.
     *
     * @param string $amount  Decimal string (use string to preserve precision)
     * @param string $from    Source currency code
     * @param string $to      Target currency code
     * @return string         Converted amount (2 decimal places)
     */
    public static function convert(string $amount, string $from, string $to): string
    {
        if ($from === $to) {
            return bcadd($amount, '0', 2);
        }

        $rate = (string) self::getRate($from, $to);

        return bcmul($amount, $rate, 2);
    }
}
