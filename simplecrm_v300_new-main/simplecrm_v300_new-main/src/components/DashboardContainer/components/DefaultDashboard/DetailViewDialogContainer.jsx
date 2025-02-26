import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "./styles";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import { getDetailViewData } from "../../../../store/actions/detail.actions";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import SkeletonShell from "../../../../components/Skeleton/index";
import { useHistory } from "react-router-dom";
import { deleteEventRecurrences } from "../../../../store/actions/edit.actions";
import AlertDialog from "../../../Alert";
import { toast } from "react-toastify";
import { Box, Grid,Typography } from "@material-ui/core";
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
import CustomDialog from "../../../SharedComponents/CustomDialog";

export default function DetailViewDialogContainer({
  selectedRecordId,
  selectedRecordModule,
  dialogOpenStatus,
  handleCloseDialog,
  setIsSubpanelUpdated = null,
  calenderView,
  fullScreen,
}) {
  let subpanels = [];
  let errors = [];
  let parentId = "";
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [alertVisible, setAlertVisibility] = useState(false);
  const handleClose = () => {
    handleCloseDialog();
  };

  useEffect(() => {
    setLoading(true);
    getDetailViewData(selectedRecordModule, selectedRecordId)
      .then((res) => {
        if (res?.ok) {
          setLoading(false);
          setData(res.data);
        } else {
          toast(
            pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res),
          );
          handleClose();
        }
      })
      .catch((e) => {
        setLoading(false);
        toast(pathOr(SOMETHING_WENT_WRONG, ["data", "errors", "detail"], res));
      });
  }, [getDetailViewData]);

  let parent_id = pathOr("", ["parent_id"], parentId);
  let Occurence = pathOr("", ["occurence"], parentId);
  let recordName = pathOr(
    "",
    ["data", "templateMeta", "recordInfo", "record_name"],
    data,
  );
  let recordInfo = pathOr({}, ["data", "templateMeta", "recordInfo"], data);
  let recordId = pathOr(
    "",
    ["data", "templateMeta", "recordInfo", "record_id"],
    data,
  );
  const moduleLabel =
    useSelector((state) => state.layout.moduleList?.[selectedRecordModule]) ||
    selectedRecordModule;

  const handleDeleteAllRecurrences = () => {
    dispatch(deleteEventRecurrences(parent_id, selectedRecordModule)).then(
      (res) => {
        if (res?.data?.status == "success") {
          toast(LBL_RECORD_DELETED);
          handleCloseDialog();
          setIsSubpanelUpdated(true);
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
        setAlertVisibility(false);
      },
    );
  };

  return (
    <>
      <CustomDialog
        isDialogOpen={dialogOpenStatus}
        handleCloseDialog={handleCloseDialog}
        title={moduleLabel}
        maxWidth={"lg"}
        fullScreen={fullScreen}
        bodyContent={
          <>
            {loading ? (
              <SkeletonShell layout="DetailView" />
            ) : (
              data.errors?.status == "400"?
              <Typography className={classes.errorMessage}>{data.errors.detail}</Typography>:
              <DetailView
                data={data}
                module={selectedRecordModule}
                view="detailview"
                headerBackground="true"
                recordName={recordName}
                recordId={recordId}
                hiddenAll={{ hidden: [], disabled: [] }}
                errors={errors}
                calenderView={calenderView}
                recordInfo={recordInfo}
                subpanels={subpanels}
              />
            )}
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
                          type: selectedRecordModule,
                          id: parent_id,
                        },
                      ],
                    };
                    history.push({
                      pathname: `/app/editview/${selectedRecordModule}/${parent_id}`,
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
          </>
        }
        bottomActionContent={
          <Box className={classes.buttonGroupRoot}>
            { data.errors?.status == "400"?null:
            <DialogActions>
              <Button
                onClick={handleClose}
                className={classes.showButtons}
                color="primary"
                variant="contained"
              >
                Close
              </Button>
              <Button
                onClick={() =>
                  history.push(
                    `/app/editview/${selectedRecordModule}/${selectedRecordId}`,
                  )
                }
                className={classes.showButtons}
                color="primary"
                variant="contained"
              >
                Edit
              </Button>
              <Button
                onClick={() =>
                  history.push(
                    `/app/detailview/${selectedRecordModule}/${selectedRecordId}`,
                  )
                }
                className={classes.showButtons}
                color="primary"
                variant="contained"
              >
                <FullscreenExitIcon />
              </Button>
            </DialogActions>
        }
          </Box>
        }
      />
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
    </>
  );
}
