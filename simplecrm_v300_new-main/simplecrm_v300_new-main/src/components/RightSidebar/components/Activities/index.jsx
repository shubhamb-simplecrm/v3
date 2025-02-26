import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
// styles
import useStyles from "./styles";
import CallEndOutlinedIcon from "@material-ui/icons/CallEndOutlined";
import PeopleOutlinedIcon from "@material-ui/icons/PeopleOutlined";
import AssignmentLateOutlinedIcon from "@material-ui/icons/AssignmentLateOutlined";
import SpeakerNotesOutlinedIcon from "@material-ui/icons/SpeakerNotesOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import Grid from "@material-ui/core/Grid";
import ActivitiesTimeline from "./components/ActivitiesTimeline";
import { getListViewActivities } from "../../../../store/actions/module.actions";
import { pathOr } from "ramda";
import { LBL_MY_ACTIVITIES } from "../../../../constant";
import DrawerHeader from "../DrawerHeader";

export default function Activities() {
  const location = useLocation();
  let splitPathName = location.pathname.split("/");
  let isDetail = pathOr([], [2], splitPathName);
  let tabs = ["Activities"];
  let tabIcon = {
    Activities: LBL_MY_ACTIVITIES,
    Calls: <CallEndOutlinedIcon />,
    Meetings: <PeopleOutlinedIcon />,
    Tasks: <AssignmentLateOutlinedIcon />,
    Notes: <SpeakerNotesOutlinedIcon />,
    Emails: <MailOutlineOutlinedIcon />,
  };
  let rowsPerPage = 10;
  const [module, setModule] = useState(null);
  const [record, setRecord] = useState(null);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [data, setData] = useState({
    Activities: [],
    Calls: [],
    Meetings: [],
    Tasks: [],
    Notes: [],
    Emails: [],
  });
  const [loading, setLoading] = useState(false);
  const [futureLoading, setFutureLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageUp, setPageUp] = useState(0);
  const [hasMoreUp, setHasMoreUp] = useState(0);
  const [hasMoreDown, setHasMoreDown] = useState(1);
  const [directScrollOn, setDirectScrollOn] = useState(null);
  const [checkFirstTrigger, setCheckFirstTrigger] = useState(0);
  const [checkFirstTriggerLength, setCheckFirstTriggerLength] = useState(0);

  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [checkedAll, setCheckedAll] = useState(
    isDetail === "detailview" &&
      module &&
      module !== "Calls" &&
      module !== "Meetings" &&
      module !== "Tasks" &&
      module !== "Notes" &&
      module !== "Emails"
      ? false
      : true,
  );

  const [isFuture, setIsFuture] = useState(0);

  useEffect(() => {
    setIsFuture(0);
    setPage(1);
    setData({ ...data, [tabs[value]]: { ["data"]: [] } });
    setHasMoreUp(1);
    module &&
    module !== "Calls" &&
    module !== "Meetings" &&
    module !== "Tasks" &&
    module !== "Notes" &&
    module !== "Emails"
      ? setCheckedAll(false)
      : setCheckedAll(true);
  }, [module]);
  useEffect(() => {
    setLoading(true);

    try {
      dispatch(
        getListViewActivities(
          "ActivityView",
          value === 0 && !checkedAll
            ? module
            : value === 0
              ? "All"
              : tabs[value],
          1,
          rowsPerPage,
          checkedAll ? 1 : record,
          0,
        ),
      ).then(function (res) {
        dispatch(
          getListViewActivities(
            "ActivityView",
            value === 0 && !checkedAll
              ? module
              : value === 0
                ? "All"
                : tabs[value],
            pageUp + 1,
            rowsPerPage,
            checkedAll ? 1 : record,
            1,
          ),
        ).then(function (res2) {
          setPageUp(pageUp + 1);
          let newData = [];
          let withIsNowData = pathOr([], ["data", "templateMeta", "data"], res);
          let todayRecordCount = pathOr(
            null,
            ["data", "templateMeta", "today-record-count"],
            res,
          );
          let hasMore = 0;
          let getData = pathOr(
            [],
            ["data", "templateMeta", "data"],
            res2,
          ).reverse();
          if (todayRecordCount) {
            withIsNowData.splice(todayRecordCount - 1, 0, { isNow: true });
          } else {
            withIsNowData = pathOr([], ["data", "templateMeta", "data"], res);
          }
          newData = getData.concat(withIsNowData);
          hasMore = pathOr(0, ["data", "templateMeta", "has-more-up"], res2);
          setHasMoreUp(hasMore);
          setCheckFirstTrigger(checkFirstTrigger + 1);
          setCheckFirstTriggerLength(
            pathOr([], ["data", "templateMeta", "data"], res2).length,
          );

          setPage(1);
          setDirectScrollOn(todayRecordCount);
          setHasMoreDown(pathOr(0, ["data", "templateMeta", "has-more"], res));
          setLoading(false);
          setData({
            ...data,
            ...{
              [tabs[value]]: { ["data"]: newData, ["has-more-up"]: hasMore },
            },
          });
        });
      });
    } catch (ex) {
      setLoading(false);
    }
  }, [value, checkedAll]);
  const fetchMoreData = (isFutureStatus = 0) => {
    isFutureStatus ? setFutureLoading(true) : setLoading(true);
    setIsFuture(isFutureStatus);
    let plusPage = isFutureStatus ? pageUp + 1 : page + 1;
    dispatch(
      getListViewActivities(
        "ActivityView",
        value === 0 && !checkedAll ? module : value === 0 ? "All" : tabs[value],
        plusPage,
        rowsPerPage,
        checkedAll ? 1 : record,
        isFutureStatus,
      ),
    ).then(function (res) {
      isFutureStatus ? setPageUp(plusPage) : setPage(plusPage);
      let newData = [];
      let hasMore = 0;
      if (isFutureStatus) {
        let getData = pathOr(
          [],
          ["data", "templateMeta", "data"],
          res,
        ).reverse();
        newData = getData.concat(data[tabs[value]]["data"]);
        hasMore = pathOr(0, ["data", "templateMeta", "has-more-up"], res);
        setHasMoreUp(hasMore);
      } else {
        let getData = pathOr([], ["data", "templateMeta", "data"], res);
        newData = data[tabs[value]]["data"].concat(getData);
        hasMore = pathOr(0, ["data", "templateMeta", "has-more"], res);
        setHasMoreDown(hasMore);
      }
      setCheckFirstTrigger(checkFirstTrigger + 1);

      setData({
        ...data,
        ...{
          [tabs[value]]: {
            ["data"]: newData,
            [isFutureStatus ? "has-more-up" : "has-more"]: hasMore,
          },
        },
      });
      isFutureStatus ? setFutureLoading(false) : setLoading(false);
    });
  };

  // useEffect(() => {
  //   if (splitPathName[2] === "detailview") {
  //     setModule(splitPathName[3]);
  //     setRecord(splitPathName[4]);
  //   } else {
  //     setModule(null);
  //     setRecord(null);
  //   }
  // });
  return (
    <div className={classes.root}>
      <DrawerHeader title={LBL_MY_ACTIVITIES} />
      <div className={classes.tabpanelBox}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-end"
          spacing={0}
        >
          <Grid item xs={12}>
            {tabs.map((tab, index) => (
              <ActivitiesTimeline
                key={index}
                data={data[tabs[value]].data || []}
                hasMoreDown={hasMoreDown}
                hasMoreUp={hasMoreUp}
                loading={loading}
                tabIcon={tabIcon}
                fetchMoreData={fetchMoreData}
                setValue={setValue}
                futureLoading={futureLoading}
                module={module}
                setIsFuture={setIsFuture}
                isFuture={isFuture}
                page={page}
                pageUp={pageUp}
                directScrollOn={directScrollOn}
                checkFirstTrigger={checkFirstTrigger}
                checkFirstTriggerLength={checkFirstTriggerLength}
                setData={setData}
              />
            ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
