import { isEmpty, pathOr } from "ramda";
import { NAME } from "@/constant";
import { useCallback, useEffect, useState } from "react";
import { getRelateFieldData } from "@/store/actions/module.actions";
import { api } from "@/common/api-utils";

const useSmartSearchDataFetch = (inputValue, module) => {
  const [isInitState, setIsInitState] = useState(true);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState([]);
  useEffect(() => {
    const fetchRecordData = (inputVal) => {
      setLoading(true);
      let queryParams = {
        "page[number]": 1,
        "page[size]": 10,
        "filter[tags_c][eq]": `%${inputVal.toString()}%`,
        "filter[disableSaveSearch][eq]": true,
      };
      api.get(`/V8/layout/ListView/${module}/1`, queryParams).then((res) => {
        setLoading(false);
        if (!isEmpty(res)) {
          let data = pathOr(null, ["data", "data", "templateMeta"], res);
          setResponseData(data);
          setIsInitState(false);
        }
      });
    };
    if (!isEmpty(inputValue) && inputValue.length >= 3) {
      fetchRecordData(inputValue);
    }
  }, [inputValue]);

  return { loading, responseData, setResponseData, isInitState };
};
export default useSmartSearchDataFetch;
