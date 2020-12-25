<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
      class="py-0"
    >
      <form
        @submit.prevent="onUpdateAddress"
      >
        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userAddress.streetAddress"
        >
          <v-text-field
            v-model="userAddress.streetAddress"
            :error="hasError"
            :error-messages="errorMessage"
            label="Street Address"
          />
        </a-validation>

        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userAddress.city"
        >
          <v-text-field
            v-model="userAddress.city"
            :error="hasError"
            :error-messages="errorMessage"
            label="City"
          />
        </a-validation>

        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userAddress.state"
        >
          <v-text-field
            v-model="userAddress.state"
            :error="hasError"
            :error-messages="errorMessage"
            label="State"
          />
        </a-validation>

        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userAddress.postalCode"
        >
          <v-text-field
            v-model="userAddress.postalCode"
            :error="hasError"
            :error-messages="errorMessage"
            label="Postal Code"
          />
        </a-validation>

        <a-validation
          v-slot="{ hasError, errorMessage }"
          :error="$v.userAddress.country"
        >
          <v-text-field
            v-model="userAddress.country"
            :error="hasError"
            :error-messages="errorMessage"
            label="Country"
          />
        </a-validation>

        <v-btn
          :loading="isLoading"
          type="submit"
          color="primary"
        >
          Save
        </v-btn>
      </form>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { pick } from 'lodash'

export default {
  name: 'ProfileAddress',

  data () {
    return {
      isLoading: false,

      userAddress: {
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    }
  },

  computed: {
    ...mapGetters({
      profile: 'user/profile'
    })
  },

  watch: {
    profile: {
      immediate: true,
      handler (profile) {
        this.userAddress = pick(profile.address, [
          'streetAddress',
          'city',
          'state',
          'postalCode',
          'country'
        ])
      }
    }
  },

  methods: {
    ...mapActions({
      profileUpdate: 'user/profileUpdate',
      notificationShow: 'notifications/show'
    }),

    async onUpdateAddress () {
      this.isLoading = true

      try {
        if (this.$v.userAddress.$invalid) {
          return this.$v.userAddress.$touch()
        }

        await this.profileUpdate({
          address: {
            ...this.userAddress
          }
        })

        this.notificationShow({
          type: 'success',
          message: 'Profile updated!'
        })
      } catch (err) {
        this.notificationShow({
          type: 'error',
          message: 'Unable to update address'
        })

        throw err
      } finally {
        this.isLoading = false
      }
    }
  },

  validations () {
    return {
      userAddress: {
        streetAddress: {},
        city: {},
        state: {},
        postalCode: {},
        country: {}
      }
    }
  }
}
</script>
