const EnvUtils = (function () {
  var _service;
  const envValuesArr = import.meta.env;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  function _getValue(value) {
    if (typeof value !== "string")
      throw new Error("ENV variable value must be a string.");
    return envValuesArr[value] ?? undefined;
  }
  function _isValueExist(value) {
    if (typeof value == "string")
      throw new Error("ENV variable value must be a string.");
    return typeof envValuesArr[value] != undefined;
  }
  return {
    getService: _getService,
    getValue: _getValue,
    isValueExist: _isValueExist,
    envObj: envValuesArr,
  };
})();
export default EnvUtils;
