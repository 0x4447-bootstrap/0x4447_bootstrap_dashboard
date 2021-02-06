import { helpers } from 'vuelidate/lib/validators'

export function minWordsValidator (minWords = 10) {
  return helpers.withParams({
    message: `Should have at least ${minWords} words`
  }, (value) => {
    return value && `${value}`.split(' ').length >= minWords
  })
}
