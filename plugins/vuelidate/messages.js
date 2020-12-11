/**
 * Messages dictionary to display user-friendly messages depending on validator name
 */
export default [
  {
    validator: 'required',
    message: 'Field is required'
  },
  {
    validator: 'email',
    message: 'Should be a valid email address'
  },
  {
    validator: 'minLengthWithParam',
    message: 'Should be at least %param% characters'
  },
  {
    validator: 'lengthWithParam',
    message: 'Should be exactly %param% characters'
  },
  {
    validator: 'minValue',
    message: 'Should be %param% or more'
  },
  {
    validator: 'maxValue',
    message: 'Should be %param% or less'
  }
]
