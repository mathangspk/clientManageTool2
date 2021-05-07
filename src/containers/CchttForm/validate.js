import moment from 'moment';
const validate = values => {
  const errors = {}
  const requiredFields = [
    'WO',
    'timeChange',
    'dateStop'
  ]
  requiredFields.forEach(field => {
    if (values[field] === null || values[field] === '' ) {
      errors[field] = 'Vui lòng không để trống'
    }
  })
  if (values.timeStart && values.timeStop){
    let timeStart = moment(values.timeStart, "YYYY-MM-DD")._d.valueOf()
    let timeStop = moment(values.timeStop, "YYYY-MM-DD")._d.valueOf()
    if (timeStop - timeStart < 0) {
      errors.timeStop = 'Ngày kết thúc > Ngày bắt đầu';
    }
  }
  if (values.timeChange){
    let timeChange = moment(values.timeStart, "YYYY-MM-DD")._d.valueOf()
  }
  return errors
}
export default validate;
