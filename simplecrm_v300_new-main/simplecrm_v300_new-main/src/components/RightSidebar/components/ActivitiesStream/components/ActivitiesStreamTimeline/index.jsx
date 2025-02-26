import React from "react";
import useStyles from "./styles";
import { Timeline } from "@material-ui/lab";
import { Scrollbars } from "react-custom-scrollbars";
import ActivitiesStreamTile from "./components/ActivitiesStreamTile";
import { useRef } from "react";
import { useCallback } from "react";
import { Box, Typography } from "@material-ui/core";
import SkeletonShell from "../../../../../Skeleton";

export default function ActivitiesStreamTimeline({
  activityFeedsData = [],
  setPage,
  setData,
  hasMore,
  isLoading,
  page,
}) {
  const classes = useStyles();
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  return (
    <Scrollbars className={classes.adjust} autoHide={true}>
      <Timeline className={classes.timeline}>
        {isLoading && page == 0 ? (
          <SkeletonShell layout="activityStream" />
        ) : (
          activityFeedsData.map((activity, index) => {
            return (
              <Box
                key={index}
                ref={
                  activityFeedsData.length === index + 1
                    ? lastBookElementRef
                    : null
                }
              >
                <ActivitiesStreamTile
                  activity={activity}
                  index={index}
                  data={activityFeedsData}
                  setData={setData}
                />
              </Box>
            );
          })
        )}
        <Typography
          variant="button"
          display="inline"
          align="center"
          gutterBottom
        >
          {isLoading && page != 0 ? "Loading..." : null}
        </Typography>
        {!isLoading && (
          <Typography
            variant="button"
            display="inline"
            align="center"
            gutterBottom
          >
            {!hasMore
              ? "No More Records!"
              : page === 0 && activityFeedsData.length === 0 && !hasMore
              ? "No Records!"
              : null}
          </Typography>
        )}
      </Timeline>
    </Scrollbars>
  );
}
