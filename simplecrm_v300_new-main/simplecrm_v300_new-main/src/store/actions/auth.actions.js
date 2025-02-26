import { auth } from "@/common/api-utils";

export const getMetaAssets = async () => {
  try {
    return await auth.get("/logo");
  } catch (ex) {
    return ex;
  }
};
