import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles, { getMuiTheme } from "./styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { getDetailView } from "../../../../store/actions/detail.actions";
import SkeletonShell from "../../../../components/Skeleton/index";
import { useHistory } from "react-router-dom";
import { deleteEventRecurrences } from "../../../../store/actions/edit.actions";
import AlertDialog from "../../../Alert";
import { toast } from "react-toastify";
import { Grid, Tooltip } from "@material-ui/core";
import {
  LBL_CONFIRM_DELETE_RECORD_TITLE,
  LBL_CONFIRM_DELETE_TITLE,
  LBL_CONFIRM_NO,
  LBL_CONFIRM_YES,
  LBL_RECORD_DELETED,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import DetailView from "../../../DetailView";
import { pathOr } from "ramda";
import { LBL_NO_EDIT_ACCESS } from "../../../../constant/language/en_us";

export default function ShowEventDetail({
  showDialogOpen,
  setShowDialogOpen,
  size = "md",
  view,
  setIsSubpanelUpdated,
  calenderView,
  editRecordAccess = 0,
}) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const fullScreen = useMediaQuery(theme.breakpoints.down(size));
  const [alertVisible, setAlertVisibility] = useState(false);
  const [subpanels, setSubpanels] = useState([]);
  const [parentId, setParentId] = useState("");
  const { detailViewLoading, detailViewError, detailViewTabData } = useSelector(
    (state) => state.detail,
  );
  const handleClose = () => {
    setShowDialogOpen({
      open: false,
      id: null,
      module: null,
      label: null,
    });
  };
  const getDetailViewData = useCallback(() => {
    dispatch(getDetailView(showDialogOpen.module, showDialogOpen.id));
  }, [dispatch, showDialogOpen.module]);

  useEffect(() => {
    getDetailViewData();
  }, [getDetailViewData]);
  let parent_id = pathOr("", ["parent_id"], parentId);
  let Occurence = pathOr("", ["occurence"], parentId);
  let recordName = pathOr(
    "",
    [
      showDialogOpen?.module,
      "data",
      "templateMeta",
      "recordInfo",
      "record_name",
    ],
    detailViewTabData,
  );
  let recordInfo = pathOr(
    {},
    [showDialogOpen?.module, "data", "templateMeta", "recordInfo"],
    detailViewTabData,
  );
  let recordId = pathOr(
    "",
    [showDialogOpen?.module, "data", "templateMeta", "recordInfo", "record_id"],
    detailViewTabData,
  );

  const handleDeleteAllRecurrences = () => {
    let modulename = showDialogOpen.module;
    dispatch(deleteEventRecurrences(parent_id, modulename)).then((res) => {
      if (res?.data?.status == "success") {
        toast(LBL_RECORD_DELETED);
        setShowDialogOpen(false);
        setIsSubpanelUpdated(true);
      } else {
        toast(SOMETHING_WENT_WRONG);
      }
      setAlertVisibility(false);
    });
  };

  if (detailViewError) {
    return <h3>{detailViewError}</h3>;
  }

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={size}
        open={showDialogOpen.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {showDialogOpen.label || showDialogOpen.module}{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {detailViewLoading ? (
              <SkeletonShell layout="DetailView" />
            ) : (
              <DetailView
                data={detailViewTabData[showDialogOpen.module]}
                module={showDialogOpen.module}
                view="detailview"
                headerBackground="true"
                recordName={recordName}
                recordId={recordId}
                hiddenAll={{ hidden: [], disabled: [] }}
                calenderView={calenderView}
                recordInfo={recordInfo}
                subpanels={subpanels}
              />
            )}
          </DialogContentText>
          {Occurence === true ? (
            <Grid>
              <Button
                className={classes.showButtons}
                onClick={() => setAlertVisibility(true)}
                color="primary"
                variant="contained"
              >
                {"Delete All Recurrences"}
              </Button>
              <Button
                className={classes.showButtons}
                style={{ marginLeft: "5px" }}
                onClick={() => {
                  let relateDataBean = {
                    recordName: recordName,
                    view: "quickCreateView",
                    relateData: [
                      {
                        type: showDialogOpen.module,
                        id: parent_id,
                      },
                    ],
                  };
                  history.push({
                    pathname: `/app/editview/${showDialogOpen.module}/${parent_id}`,
                    state: { relateDataBean: relateDataBean },
                  });
                }}
                color="primary"
                variant="contained"
              >
                {"Edit All Recurrences"}
              </Button>
            </Grid>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            className={classes.showButtons}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
          <Tooltip
            title={editRecordAccess && calenderView ? null : LBL_NO_EDIT_ACCESS}
            disableHoverListener={!editRecordAccess && calenderView ? false : true}
            placement="top"
          >
            <div>
              <Button
                onClick={() =>
                  history.push(
                    `/app/editview/${showDialogOpen.module}/${showDialogOpen.id}`,
                  )
                }
                className={classes.showButtons}
                color="primary"
                variant="contained"
                disabled={calenderView && !editRecordAccess}
              >
                Edit
              </Button>
            </div>
          </Tooltip>
        </DialogActions>
      </Dialog>
      <AlertDialog
        title={LBL_CONFIRM_DELETE_TITLE}
        msg={LBL_CONFIRM_DELETE_RECORD_TITLE}
        open={alertVisible}
        agreeText={LBL_CONFIRM_YES}
        disagreeText={LBL_CONFIRM_NO}
        handleClose={() => setAlertVisibility(!alertVisible)}
        onAgree={handleDeleteAllRecurrences}
      />
      ;
    </MuiThemeProvider>
  );
}
