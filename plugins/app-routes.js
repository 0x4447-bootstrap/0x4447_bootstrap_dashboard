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
      title: 'Home'
    },
    auth: {
      route: {
        name: 'auth'
      },
      title: 'Authenticate'
    },
    profileIdentity: {
      route: {
        name: 'profile-identity'
      },
      title: 'Identity'
    },
    profileAddress: {
      route: {
        name: 'profile-address'
      },
      title: 'Address'
    },
    payment: {
      route: {
        name: 'profile-payment'
      },
      title: 'Payment'
    },
    paymentInvoices: {
      route: {
        name: 'profile-invoices'
      },
      title: 'Invoices'
    },
    help: {
      route: {
        name: 'help'
      },
      title: 'Help'
    },
    helpArticle (slug) {
      return {
        route: {
          name: 'help-slug',
          params: {
            slug
          }
        }
      }
    },
    support: {
      route: {
        name: 'support'
      },
      title: 'Support'
    }
  }

  inject('routes', routesConfig)
}
