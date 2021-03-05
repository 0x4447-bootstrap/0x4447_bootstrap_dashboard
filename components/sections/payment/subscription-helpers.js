import { loadStripe } from '@stripe/stripe-js'

export async function initStripeCardWidget ({
  stripePublicKey,
  isDarkTheme = false,
  postalCode = ''
}) {
  if (!stripePublicKey) {
    throw new Error('Stripe public key is required to initialize card widget')
  }

  const stripeClient = await loadStripe(stripePublicKey)

  const stripeCardField = stripeClient.elements().create('card', {
    style: {
      base: {
        color: isDarkTheme ? '#fff' : '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    value: {
      postalCode
    }
  })

  return {
    stripeClient,
    stripeCardField
  }
}
