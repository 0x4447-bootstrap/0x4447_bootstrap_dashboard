/**
 * Application routes map
 * It is used to provide access to application pages via variables
 * to prevent syntax errors and give autocomplete in IDE
 * @param context
 * @param inject
 */
export default function appRoutesPlugin (context, inject) {
  const routesConfig = {
    dashboard: {
      route: {
        name: 'index'
      },
      title: 'Dashboard'
    },
    auth: {
      route: {
        name: 'auth'
      },
      title: 'Authenticate'
    },
    profile: {
      route: {
        name: 'profile'
      },
      title: 'Profile'
    },
    payment: {
      route: {
        name: 'payment'
      },
      title: 'Payment'
    },
    paymentInvoices: {
      route: {
        name: 'payment-invoices'
      },
      title: 'Invoices'
    }
  }

  inject('routes', routesConfig)
}
