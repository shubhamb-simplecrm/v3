// function for calling native mobile device method
const callNativeMethod = ({ android = "", ios = "" }, args) => {
  const execute = (methodPath, args) => {
    try {
      const methodParts = methodPath.split(".");
      const methodName = methodParts.pop(); // Get the last part as method name
      const methodContext = methodParts.reduce(
        (acc, key) => acc?.[key],
        window,
      ); // Navigate through to get method context
      if (methodContext && typeof methodContext[methodName] === "function") {
        methodContext[methodName](args);
        console.log(`${methodName} Success: ` + JSON.stringify(args));
      }
    } catch (error) {
      console.warn(
        `${methodPath} Error - ${error.name}: ${error.message}`,
        args,
      );
    }
  };

  if (android) execute(`Android.${android}`, args);
  if (ios) execute(`webkit.messageHandlers.${ios}.postMessage`, args);
};

// We should pass only one argument to native methods, if we need to pass multiple arguments to native method we need to pass stringify object as argument.

export const changeInstanceNativeButton = (isAuthenticated) => {
  const buttonValue = isAuthenticated ? "0" : "1";
  callNativeMethod(
    {
      android: `toggleChangeInstanceButton`,
      ios: `toggleChangeInstanceButton`,
    },
    buttonValue,
  );
};

export const nativeInitConfiguration = (obj = {}) => {
  callNativeMethod(
    {
      android: `configurableFunctionalitiesStatus`,
      ios: `configurableFunctionalitiesStatus`,
    },
    JSON.stringify(obj),
  );
};
export const requestForLatLongToNative = (args = "test_params") => {
  callNativeMethod(
    {
      android: `getLocationButtonClicked`,
      ios: `getLocationButtonClicked`,
    },
    JSON.stringify(args),
  );
};

export const sendLatLongToNative = (
  args = {
    lat: "",
    long: "",
  },
) => {
  callNativeMethod(
    {
      android: `sendLatLongToNative`,
      ios: `sendLatLongToNative`,
    },
    JSON.stringify(args),
  );
};

export const logoutConfirmedToNative = (args = "test_params") => {
  callNativeMethod(
    {
      android: `logoutConfirmed`,
      ios: `logoutConfirmed`,
    },
    JSON.stringify(args),
  );
};
