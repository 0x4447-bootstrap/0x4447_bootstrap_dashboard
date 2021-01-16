<template>
  <amplify-authenticator>
    <amplify-sign-up
      slot="sign-up"
      :form-fields.prop="signUpFields"
    />

    <amplify-confirm-sign-up
      slot="confirm-sign-up"
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
    let prevAuthState
    onAuthUIStateChange(async (nextAuthStatus, user) => {
      // Prevent double callback trigger
      if (prevAuthState === nextAuthStatus) {
        return
      }

      prevAuthState = nextAuthStatus

      if (nextAuthStatus === AuthState.SignedIn) {
        await this.checkUserAuthentication()

        const userRecordExists = await this.checkUserRecordExists({ sub: user.attributes.sub })
        if (!userRecordExists) {
          await this.createUserRecord({
            sub: user.attributes.sub,
            email: user.attributes.email
          })
        }

        await this.$router.replace(this.$routes.dashboard.route)
      }
    })
  },

  beforeDestroy () {
    return onAuthUIStateChange
  },

  methods: {
    ...mapActions({
      checkUserAuthentication: 'auth/checkUserAuthentication',
      checkUserRecordExists: 'auth/checkUserRecordExists',
      createUserRecord: 'auth/createUserRecord'
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
