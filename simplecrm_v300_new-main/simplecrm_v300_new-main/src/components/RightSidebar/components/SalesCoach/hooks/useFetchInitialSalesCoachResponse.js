import { api } from "@/common/api-utils";
import { SOMETHING_WENT_WRONG } from "@/constant";
import { useModuleViewDetail } from "@/hooks/useModuleViewDetail";
import { pathOr } from "ramda";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const useFetchInitialSalesCoachResponse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState({});
  const metaObj = useModuleViewDetail();
  useEffect(() => {
    if (!metaObj.currentModule || !metaObj.recordId) return;
    setLoading(true);
    api
      .get(
        `/V8/layout/getSalesCoachData/${metaObj.currentModule}/${metaObj.recordId}`,
        null,
      )
      .then((res) => {
        if (res.ok) {
          const sourceType = pathOr("", ["data", "data", "source"], res);
          const gptType = pathOr("", ["data", "data", "gpt_type"], res);
          const promptData = pathOr("", ["data", "data", "promptData"], res);
          switch (sourceType.toLocaleLowerCase()) {
            case "crm":
              {
                const moduleResponse = pathOr(
                  "",
                  ["data", "data", "data", "data"],
                  res,
                );
                const responseRecordId = pathOr(
                  "",
                  ["data", "data", "data", "id"],
                  res,
                );
                const apiToken = pathOr("", ["data", "data", "token"], res);
                const systemPrompt = pathOr(
                  "",
                  ["data", "data", "prompt"],
                  res,
                );
                setResponseData({
                  moduleResponse,
                  responseRecordId,
                  apiToken,
                  systemPrompt,
                  sourceType,
                  promptData,
                  gptType,
                });
                setLoading(false);
              }
              break;

            case "openai":
              {
                const moduleResponse = pathOr(
                  "",
                  ["data", "data", "data", "data"],
                  res,
                );
                const responseRecordId = pathOr(
                  "",
                  ["data", "data", "data", "id"],
                  res,
                );
                const apiToken = pathOr("", ["data", "data", "token"], res);
                const systemPrompt = pathOr(
                  "",
                  ["data", "data", "prompt"],
                  res,
                );
                setResponseData({
                  moduleResponse,
                  responseRecordId,
                  apiToken,
                  systemPrompt,
                  sourceType,
                  promptData,
                  gptType,
                });
                setLoading(false);
              }
              break;
            default:
              toast(pathOr(SOMETHING_WENT_WRONG, ["data", "message"], res));
              setLoading(false);
              break;
          }
        } else {
          setError(res?.data);
          toast(pathOr(SOMETHING_WENT_WRONG, ["data", "message"], res));
        }
      });
  }, [metaObj]);

  return { error, loading, responseData };
};
export default useFetchInitialSalesCoachResponse;
