<template>
  <amplify-authenticator>
    <amplify-sign-up
      slot="sign-up"
      :form-fields.prop="signUpFields"
    />

    <amplify-confirm-sign-up
      slot="confirm-sign-up"
      :form-fields.prop="signUpConfirmFields"
    />

    <amplify-sign-in
      slot="sign-in"
      :form-fields.prop="signInFields"
    />

    <amplify-forgot-password
      slot="forgot-password"
      :form-fields.prop="forgotPasswordFields"
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
        {
          label: 'Email *',
          type: 'username'
        },
        {
          type: 'password'
        }
      ],
      signUpConfirmFields: [
        {
          label: 'Email *',
          type: 'username'
        },
        {
          label: 'Confirmation Code *',
          type: 'code'
        }
      ],
      signInFields: [
        {
          label: 'Email *',
          type: 'username'
        },
        {
          type: 'password'
        }
      ],
      forgotPasswordFields: [
        {
          label: 'Email *',
          type: 'username'
        }
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

        const userRecord = await this.userRecordGet({ sub: user.attributes.sub })

        if (!userRecord || userRecord.email !== user.attributes.email) {
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
      userRecordGet: 'auth/userRecordGet',
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
