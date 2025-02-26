import { isEmpty, pathOr } from "ramda";
import { NAME } from "@/constant";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRelateFieldData } from "@/store/actions/module.actions";

const useRelateFieldOptionFetch = (
  isPopoverOpen = false,
  inputValue,
  module,
  fieldMetaObj,
) => {
  const [loading, setLoading] = useState(false);
  const [optionData, setOptionData] = useState([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchRecordData = useCallback(
    async (inputVal) => {
      const fieldRName = pathOr("name", ["rname"], fieldMetaObj);
      let sort = NAME;
      let query = `filter[${fieldRName}][lke]=${inputVal}&`;
      const queryParams = pathOr({}, ["queryParams"], fieldMetaObj);

      if (!isEmpty(queryParams)) {
        query += queryParams;
      }

      const pageSize = 20;
      const pageNo = 1;
      const reportsTo = null;

      setLoading(true);

      try {
        const res = await getRelateFieldData(
          module,
          pageSize,
          pageNo,
          sort,
          query,
          reportsTo,
        );
        if (!isMountedRef.current) return;

        setLoading(false);

        const responseOptions = pathOr(
          [],
          ["data", "data", "templateMeta", "listview", "data"],
          res,
        );
        setOptionData(responseOptions);
      } catch (error) {
        if (isMountedRef.current) {
          setLoading(false);
          setOptionData([]);
        }
      }
    },
    [fieldMetaObj, module],
  );

  useEffect(() => {
    setOptionData([]);
    const shouldFetch = isPopoverOpen && inputValue && inputValue.length >= 3;
    if (shouldFetch) {
      fetchRecordData(inputValue);
    } else {
      setOptionData([]);
    }
  }, [isPopoverOpen, inputValue, fetchRecordData]);

  return { loading, optionData, setOptionData };
};
export default useRelateFieldOptionFetch;
