<template>
  <amplify-authenticator>
    <amplify-sign-up
      slot="sign-up"
      :form-fields.prop="signUpFields"
    />
  </amplify-authenticator>
</template>

<script>
import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components'
import { mapActions } from 'vuex'
import authStatus from '~/constants/authStatus'

export default {
  name: 'ViewAuth',

  layout: 'auth',

  data () {
    return {
      signUpFields: [
        { type: 'username' },
        { type: 'password' }
      ]
    }
  },

  beforeMount () {
    onAuthUIStateChange(async (nextAuthStatus) => {
      if (nextAuthStatus === AuthState.SignedIn) {
        await this.setAuthState({
          isLoggedIn: true
        })

        await this.$router.replace(this.$routes.dashboard.route)
      }
    })
  },

  beforeDestroy () {
    return onAuthUIStateChange
  },

  methods: {
    ...mapActions({
      setAuthState: 'auth/setAuthState'
    })
  },

  meta: {
    auth: [
      authStatus.NOT_AUTHENTICATED
    ]
  },

  head () {
    return {
      title: this.$routes.auth.title
    }
  }
}
</script>
