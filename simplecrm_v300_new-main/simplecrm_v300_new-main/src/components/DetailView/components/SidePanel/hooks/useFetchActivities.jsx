import { useState, useEffect } from "react";
import { pathOr } from "ramda";
import { getSubpanelListViewData } from "@/store/actions/subpanel.actions";
import { api } from "@/common/api-utils";

function useFetchActivities(pageNum, payload) {
  const { module, id, subpanel, subpanel_module, recordName, data, url } = payload;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [dataLabels, setDataLabels] = useState([]);
  let fieldDescription = "";
  data?.map((item, key) => {
    item.attributes.map((val, index) => {
      val.map((fieldValue) => {
        if (fieldValue.label == "Description") {
          fieldDescription = fieldValue.value.replace(/<\/?[^>]+(>|$)/g, "")
        }
      })
    })
  })
  let queryParam = `Subject:${recordName}\n Description:${fieldDescription}`
  const getTicketData = () => {
    setIsLoading(true);
    setError(false);
    try {
      let payload = JSON.stringify({
        "data": {
          "query": queryParam,
          "nodes_k": 10,
          "record_id":id
        }
      })
      api.post(url, payload).then((response) => {
        if (response.ok) {
          // setRefreshState(false)
          setActivityList(response.data.nodes)
        }
        setIsLoading(false)
      })
    } catch (error) {
      console.log("ree", error);
    }
  };
  const getNotification = (pageNum) => {
    setIsLoading(true);
    setError(false);
    try {
      getSubpanelListViewData(
        module,
        subpanel,
        subpanel_module,
        id,
        10,
        pageNum,
      )
        .then((res) => {
          if (res.ok) {
            const data = pathOr(
              [],
              [
                "data",
                "data",
                "templateMeta",
                "data",
                "subpanel_tabs",
                0,
                "listview",
                "data",
                0,
              ],
              res,
            );
            const totalRecords = pathOr(
              0,
              ["data", "meta", "total-records"],
              res,
            );
            const isLastPage = pathOr(true, ["data", "meta", "last_page"], res);
            if (pageNum == 1 && data.length == 0) {
              setActivityList([]);
            } else if (pageNum == 1) {
              setActivityList(data);
            } else {
              setActivityList((prev) => [...prev, ...data]);
            }
            setHasMore(!isLastPage);
          }
          setIsLoading(false);
          setRefreshState(false);
        })
        .catch((err) => {
          setError(err);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleRefreshState = (e) => {
    setRefreshState(true);
    setHasMore(false);
    if (e) {
      setActivityList([]);
    }
  };
  useEffect(() => {
    setActivityList([]);
  }, [payload]);

  useEffect(() => {
    if (!module) return;
    if (subpanel_module !== "SimilarTickets") {
    getNotification(pageNum);
    }
  }, [payload, pageNum, refreshState]);
  useEffect(() => {
    if (!module) return;
    if (subpanel_module == "SimilarTickets") {
      getTicketData();
    } 
  }, [payload,refreshState]);
  return {
    isLoading,
    error,
    activityList,
    hasMore,
    setActivityList,
    onRefreshState: handleRefreshState,
  };
}
export default useFetchActivities;
