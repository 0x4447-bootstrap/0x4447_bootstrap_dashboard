import { isArray } from 'lodash'
import authStatus from '~/constants/authStatus'

/**
 * Check & handle redirects for user restricted access
 * defined by various route meta specifications per individual routes
 *
 * In case of Dashboard application, every route is considered to require
 * authentication, so only "NOT_AUTHENTICATED" routes should have "meta"
 * property.
 */
export default function ({ store, redirect, route }) {
  const meta = isArray(route.meta) &&
    route.meta.find(meta => isArray(meta.auth))

  if (!meta) {
    return
  }

  const { auth } = meta

  const loggedIn = store.getters['auth/isLoggedIn']

  // Allowed only for authenticated users, but user is not authenticated
  if ((!isArray(auth) || auth.includes(authStatus.AUTHENTICATED)) && !loggedIn) {
    return redirect(302, '/auth')
  }

  // Allowed only for not authenticated users, but user is authenticated
  if (auth.includes(authStatus.NOT_AUTHENTICATED) && loggedIn) {
    return redirect(302, '/')
  }
}
