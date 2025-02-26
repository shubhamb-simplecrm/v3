import { SkeletonShell } from "@/components";
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { memo, useEffect, useState } from "react";
import useStyles from "./styles";
import "./styles.js";
import { isEmpty, isNil, pathOr } from "ramda";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DetailViewDialogContainer from "@/components/DashboardContainer/components/DefaultDashboard/DetailViewDialogContainer";
import { useIsMobileView } from "@/hooks/useIsMobileView";


const SidePanelTicketCard = ({ item, loader }) => {
  const classes = useStyles();
  const isMobile = useIsMobileView("sm");
  const [expandActivity, setExpandActivity] = useState(false);
  const [data, setData] = useState([])
  const [showDetailViewDialog, setShowDetailViewDialog] = useState({
    open: false,
    id: null,
    record_module: null,
  });
  const toggleExpandActivity = () => {
    setExpandActivity(!expandActivity);
  };
  const handleOpenDetailViewDialog = (id, record_module) => {
    setShowDetailViewDialog({
      open: true,
      id: id,
      module: record_module,
    });
  };
  const handleCloseDetailViewDialog = () => {
    setShowDetailViewDialog({
      open: false,
      id: null,
      module: null,
    });
  };
  useEffect(() => {
    !isNil(item) &&
    [item].map((value, key) => {
      let description = value.text.replace(item.metadata.heading, "").trim()
      value.metadata["description"] = description;
      if (!isNil(pathOr([], ["metadata"], value)) || !isEmpty(pathOr([], ["metadata"], value))) {
        setData([pathOr([], ["metadata"], value)]);
      }
    })
  }, [])
  const createMarkup = (data) => {
    return {
      __html: htmlDecode(data),
    };
  };
  function htmlDecode(input) {
    const tempElement = document.createElement("textarea");
    tempElement.innerHTML = input;
    return tempElement.value.replace(/<\/?p>/g, "").trim();
  }
  return (
    <>
      {
        // loader ? <SkeletonShell /> :
          <>
            {data?.map((item, key) => {
              return (
                <>
                  <Card className={!expandActivity ? classes.cardContainer : classes.expandCardContainer}>
                    <Box className={classes.headerContainer}>
                      <Grid container md={12} xs={12} justifyContent="center">
                        <Grid item md={2} xs={2} className={classes.root}>
                          <Chip
                            size="small"
                            label={item.ticket_number}
                            className={classes.activityStatusContainer}
                          />
                        </Grid>
                        <Grid item md={9} xs={9} className={classes.root}>
                          <div className={classes.subject}>
                            <Tooltip title={item.heading} placement="left-start">
                              <Typography
                                className={classes.title}
                                onClick={() => handleOpenDetailViewDialog(
                                  item.ticket_id,
                                  "Cases",
                                )
                                }
                              >
                                {item.heading}
                              </Typography>
                            </Tooltip>
                          </div>
                        </Grid>
                        <Grid item md={1} xs={1}>
                          <IconButton>
                            {expandActivity ? (
                              <ExpandLessIcon
                                className={classes.expandIcon}
                                onClick={toggleExpandActivity}
                              />
                            ) : (
                              <ExpandMoreIcon
                                className={classes.expandIcon}
                                onClick={toggleExpandActivity}
                              />
                            )}{" "}
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                    {expandActivity ? (
                      // <Tooltip title={htmlDecode(item.description)} placement="left-start">
                      <Grid container md={12} xs={12} justifyContent="center">
                        <Grid item md={2} xs={2} className={classes.root}>
                          
                        </Grid>
                        <Grid item md={9} xs={9} className={classes.root}>
                      <div className={classes.description} dangerouslySetInnerHTML={createMarkup(item.description)}></div>
                        </Grid>
                        <Grid item md={1} xs={1}></Grid>
                        </Grid>
                    ) : (
                      <>{""}</>
                    )}

                  </Card>
                  {showDetailViewDialog.open ? (
                    <DetailViewDialogContainer
                      dialogOpenStatus={showDetailViewDialog.open}
                      selectedRecordId={showDetailViewDialog.id}
                      selectedRecordModule={showDetailViewDialog.module}
                      handleCloseDialog={handleCloseDetailViewDialog}
                      calenderView={true}
                      fullScreen={isMobile ? true : false}
                    />
                  ) : null}
                </>
              )
            })}
          </>
      }

    </>
  );
};

export default memo(SidePanelTicketCard);
