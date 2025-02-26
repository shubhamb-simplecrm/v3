import EnvUtils from "../common/env-utils";

export const NotificationConnectionType = {
  Basic: Symbol("basic"),
  Socket: Symbol("socket"),
  Firebase: Symbol("firebase"),
};
export const isSocketAllow =
  EnvUtils.getValue("REACT_APP_SOCKET_ALLOW") == "true";
