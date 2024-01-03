<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class ReCaptchaRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $endpoint = config('services.google_recaptcha');

        if (! env('APP_DEBUG') and $endpoint['secret_key'] != '' and env('RECAPTCHA_ENABLE', false)) {
            $response = Http::asForm()->post($endpoint['url'], [
                'secret' => $endpoint['secret_key'],
                'response' => $value,
            ])->json();

            if (! ($response['success'] && $response['score'] > 0.5)) {
                $fail = __('auth.recaptcha-error');
            }
        }
    }
}
