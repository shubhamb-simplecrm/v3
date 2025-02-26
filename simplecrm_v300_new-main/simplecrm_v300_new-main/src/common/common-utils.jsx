import { pathOr } from "ramda";
import { ACL_ACCESS_ACTION_TYPE } from "./common-constants";

export const checkACLAccess = (ACLAccessObj, actionName) => {
  return !!pathOr(false, [actionName], ACLAccessObj);
};
