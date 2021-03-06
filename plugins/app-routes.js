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
    profileInterface: {
      route: {
        name: 'profile-interface'
      },
      title: 'Interface'
    },
    payment: {
      route: {
        name: 'profile-payment'
      },
      title: 'Subscription'
    },
    paymentInvoices: {
      route: {
        name: 'profile-invoices'
      },
      title: 'Invoices'
    },
    paymentInvoiceId (invoiceId) {
      return {
        route: {
          name: 'profile-invoices-invoiceId',
          params: {
            invoiceId
          }
        },
        title: `Invoice #${invoiceId}`
      }
    },
    profileSecurity: {
      route: {
        name: 'profile-security'
      },
      title: 'Security'
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
    },
    debug: {
      route: {
        name: 'debug'
      },
      title: 'Debug'
    }
  }

  inject('routes', routesConfig)
}
