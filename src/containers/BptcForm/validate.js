const validate = values => {
  const errors = {}
  const requiredFields = [
    'content'
  ]
  requiredFields.forEach(field => {
    if (values[field] === null || values[field] === '' ) {
      errors[field] = 'Vui lòng không để trống'
    }
  })
  return errors
}
export default validate;
