import React, { useCallback } from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getListView,
  getColumnChooserFields,
  setSelectedModule,
  deleteRecordFromModule,
} from "../../store/actions/module.actions";
import { pathOr } from "ramda";
// styles

import useStyles from "./styles";
import {
  LBL_OOPS,
  LBL_RESET_PREFERENCE_TITLE,
  LBL_TRY_AGAIN,
  SOMETHING_WENT_WRONG,
} from "../../constant";
import clsx from "clsx";
export default function Error({
  view,
  type,
  title = LBL_OOPS,
  description = SOMETHING_WENT_WRONG,
  reload = false,
  errorObj,
  callback = null,
  showTitle = false,
}) {
  var classes = useStyles();
  const config = useSelector((state) => state.config);
  const rowsPerPage = pathOr(
    20,
    ["config", "list_max_entries_per_page"],
    config,
  );
  const { module, returnModule, returnId } = useParams();
  const dispatch = useDispatch();
  const getListViewData = useCallback(() => {
    if (module !== "Calendar") {
      module &&
        dispatch(
          getListView(
            module,
            0,
            rowsPerPage,
            "",
            "filter[reset][eq]=true&sort=-date_entered",
          ),
        );
      module && dispatch(getColumnChooserFields(module));
      module && dispatch(setSelectedModule(module));
    }
  }, [dispatch, module]);

  return (
    <Grid
      container
      className={classes.container}
      style={{
        width: view === "EmailListView" ? "70vw" : "100vw",
        height: view === "EmailListView" ? "80vh" : "100vh",
      }}
    >
      <Paper classes={{ root: classes.paperRoot }}>
        {showTitle && (
          <>
            {/* <ErrorOutlineIcon
              className={clsx(classes.textRow, classes.errorCode)}
            /> */}
            <Typography variant="h1" color="primary">
              {title}
            </Typography>
          </>
        )}

        <Typography
          variant="h6"
          className={clsx(classes.textRow, classes.safetyText)}
        >
          {typeof description === "string" ? description : SOMETHING_WENT_WRONG}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          // component={Link}
          // to="/app/Home"
          size="small"
          className={classes.backButton}
          onClick={() => window.location.reload()}
        >
          {LBL_TRY_AGAIN}
        </Button>

        {view == "ListView" ? (
          <Button
            variant="text"
            color="primary"
            // component={Link}
            // to="/app/Home"
            size="small"
            className={classes.backButton}
            onClick={!!callback ? callback : getListViewData}
          >
            {LBL_RESET_PREFERENCE_TITLE}
          </Button>
        ) : (
          ""
        )}
      </Paper>
    </Grid>
  );
}
