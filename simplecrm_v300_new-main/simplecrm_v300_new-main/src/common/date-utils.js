import dayjs from "dayjs";

const DateUtils = (function () {
  var _service;

  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  const _getConvertedDateFormat = (inputString) => {
    let convertedDateFormat = inputString
      .toLowerCase()
      .replace("y", "YYYY")
      .replace("m", "MM")
      .replace("d", "DD");
    return convertedDateFormat;
  };
  const _getConvertedTimeFormat = (inputString) => {
    let convertedTimeFormat = inputString
      // .toLowerCase()
      .replace("h", "hh")
      .replace("H", "HH")
      .replace("i", "mm")
      .replace("a", "a");
    return convertedTimeFormat;
  };
  function _getCurrentDate(inputString) {
    const inputFormat = _getConvertedDateFormat(inputString);
    const currentDateStrFormat = dayjs(new Date()).format(inputFormat);
    return currentDateStrFormat;
  }
  function _getFormattedDateTime(input, format) {
    const currentDateStrFormat = dayjs(input, format);
    return currentDateStrFormat.isValid() ? currentDateStrFormat : null;
  }
  function _getDateObjByDateTimeInput(input, format) {
    if (!input) return undefined;
    try {
      const currentDateStrFormat = dayjs(input, format);
      return currentDateStrFormat.isValid()
        ? currentDateStrFormat.toDate()
        : undefined;
    } catch (error) {
      return undefined;
    }
  }
  function _isDateValid(input, format) {
    if (!input) return false;
    try {
      const currentDateStrFormat = dayjs(input, format);
      return currentDateStrFormat?.isValid() ?? false;
    } catch (error) {
      return false;
    }
  }
  return {
    getService: _getService,
    getCurrentDate: _getCurrentDate,
    getDateFormat: _getConvertedDateFormat,
    getTimeFormat: _getConvertedTimeFormat,
    getFormattedDateTime: _getFormattedDateTime,
    getDateObjByDateTimeInput: _getDateObjByDateTimeInput,
    isDateValid: _isDateValid,
    // getFormattedDateTimeString: _getFormattedDateTimeString,
  };
})();
export default DateUtils;
