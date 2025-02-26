const LocalStorageUtils = (function () {
  var _service;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  function _setToken(tokenObj) {
    localStorage.setItem("access_token", tokenObj.access_token);
    localStorage.setItem("refresh_token", tokenObj.refresh_token);
  }
  function _setFCMToken(fcm_token) {
   return localStorage.setItem("fcm_token", fcm_token);
  }
  function _getFCMToken() {
    return localStorage.getItem("fcm_token");
  }
  function _setIsNotifiy() {
   return localStorage.setItem("is_notify", "yes");
  }
  function _getIsNotifiy() {
    return localStorage.getItem("is_notify");
  }
  function _setValidToken(fcm_token) {
   return localStorage.setItem("valid_token", fcm_token);
  }
  function _getValidToken() {
    return localStorage.getItem("valid_token");
  }
  function _getAccessToken() {
    return localStorage.getItem("access_token");
  }
  function _getRefreshToken() {
    return localStorage.getItem("refresh_token");
  }
  function _clearToken() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("fcm_token");
    
  }
  function _setValue(key, value) {
    return localStorage.setItem(key, value);
  }
  function _getValueByKey(key) {
    return localStorage.getItem(key);
  }
  function _clearValueByKey(key) {
    localStorage.removeItem(key);
  }
  function _clearStorage() {
    localStorage.clear();
  }
  return {
    getService: _getService,
    setToken: _setToken,
    setFCMToken: _setFCMToken,
    getFCMToken: _getFCMToken,
    setIsNotifiy: _setIsNotifiy,
    getIsNotifiy: _getIsNotifiy,
    setValidToken: _setValidToken,
    getValidToken: _getValidToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
    setValue: _setValue,
    getValueByKey: _getValueByKey,
    clearValueByKey: _clearValueByKey,
    clearStorage: _clearStorage,
  };
})();
export default LocalStorageUtils;
