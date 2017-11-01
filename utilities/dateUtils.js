module.exports = {
  cleanDate: function (dateString) {
    dateString = dateString.replace(/-/g, ',')
    dateString = dateString.replace(/\//g, ',')
    return dateString
  },
  prettyDate: function (dateString) {
    dateString = this.cleanDate(dateString)
    let dateObj = new Date(dateString)
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const weekdayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]
    return (
      `${weekdayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ` +
      `${dateObj.getDate()}, ${dateObj.getFullYear()}`
    )
  }
}
