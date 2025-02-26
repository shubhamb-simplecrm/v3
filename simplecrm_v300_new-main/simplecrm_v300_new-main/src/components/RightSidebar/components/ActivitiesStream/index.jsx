import React, { useState, useCallback, useEffect } from "react";
import useStyles from "./styles";
import { getActivityFeeds } from "../../../../store/actions/module.actions";
import { pathOr } from "ramda";
import { Box, Typography } from "@material-ui/core";
import ActivitiesStreamTimeline from "./components/ActivitiesStreamTimeline";
import ActivitiesHeader from "./components/ActivitiesHeader";
import { toast } from "react-toastify";
import { SOMETHING_WENT_WRONG } from "../../../../constant";
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{ padding: "0px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ActivitiesStream(props) {
  const classes = useStyles();
  const [activityFeeds, setActivityFeeds] = useState([]);
  const [activityType, setActivityType] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const getActivityFeedsData = useCallback(
    (pageNo, inputActivityType) => {
      setLoading(true);
      try {
        getActivityFeeds(pageNo, inputActivityType)
          .then((res) => {
            if (res.ok) {
              let getData = pathOr([], ["data", "data"], res);
              let totalRecords = pathOr(
                0,
                ["data", "meta", 0, "total_record"],
                res,
              );
              setActivityFeeds((prev) => [...prev, ...getData]);
              setHasMore(totalRecords > activityFeeds.length);
            } else {
              toast(
                pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res),
              );
            }
            setLoading(false);
          })
          .catch((e) => {
            toast(SOMETHING_WENT_WRONG);
            setLoading(false);
          });
      } catch (ex) {
        setLoading(false);
      }
    },
    [activityFeeds],
  );

  const handleActivityTypeChange = (event, newValue) => {
    if (newValue != activityType) {
      setActivityType(newValue);
      setPage(0);
      setActivityFeeds([]);
    }
  };
  useEffect(() => {
    getActivityFeedsData(page, activityType);
  }, [activityType, page]);

  return (
    <div className={classes.root}>
      <ActivitiesHeader
        activityType={activityType}
        handleActivityTypeChange={handleActivityTypeChange}
      />
      <TabPanel value={activityType} index={activityType}>
        <ActivitiesStreamTimeline
          activityFeedsData={activityFeeds}
          page={page}
          setPage={setPage}
          setData={setActivityFeeds}
          hasMore={hasMore}
          isLoading={loading}
        />
      </TabPanel>
    </div>
  );
}
