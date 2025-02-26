import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  ButtonGroup,
  Tooltip,
  Button,
  Menu,
  CircularProgress,
  MenuItem,
  useTheme,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { AuditView } from "../../";
import { Alert } from "@/components";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { ActionPopup } from "./components";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { isEmpty, pathOr, prop } from "ramda";
import { toast } from "react-toastify";
import {
  deleteRecordFromModule,
  convertToInvoice,
} from "../../../store/actions/module.actions";
import {
  emailCustomerReview,
  getDetailView,
  printAsPdf,
} from "../../../store/actions/detail.actions";
import {
  exportReport,
  downloadReportPdf,
} from "../../../store/actions/aor_reports.actions";
import { massUpdate, getListView } from "../../../store/actions/module.actions";
import { AddToTargetListModal } from "../../ReportDataView/components/CustomToolbarSelect/components";
import { emailAsPdf } from "../../../store/actions/emails.actions";
import { api } from "../../../common/api-utils";
import {
  LBL_ERROR,
  LBL_EXPORT_INPROGRESS,
  LBL_EXPORT_SUCCESS_MESSAGE,
  LBL_DOWNLOAD_INPROGRESS,
  LBL_REPORT_DOWNLOAD_SUCCESS_MESSAGE,
  LBL_ADD_TO_TARGET_LIST_SUCCESS,
  LBL_SEND_TO_CUSETOMER_REVIEW_INPROGRESS,
  LBL_SEND_TO_CUSETOMER_REVIEW_SUCCESS,
  SOMETHING_WENT_WRONG,
  LBL_PRINT_AS_PDF,
  LBL_DOWNLOAD_AS_PDF_CONFIRM_MESSAGE,
  LBL_GENERATE_PDF_SUCCESS,
  LBL_RECORD_UPDATED,
  LBL_RECORD_CREATE_INPROGRESS,
  LBL_RECORD_CREATED,
  LBL_CONFIRM_DELETE_TITLE,
  LBL_CONFIRM_DELETE_RECORD_DESCRIPTION,
  LBL_EXPORT_REPORT,
  LBL_EXPORT_REPORT_CONFIRM_MESSAGE,
  LBL_DOWNLOAD_REPORT_AS_PDF,
  LBL_DOWNLOAD_REPORT_AS_PDF_CONFIRM_MESSAGE,
  LBL_SEND_TO_CUSETOMER_REVIEW_CONFIRM_MESSAGE,
  LBL_NO_ACTION_FOUND,
  LBL_EDIT_RECORD_BUTTON_TITLE,
  LBL_EDIT_BUTTON_TITLE,
  LBL_MORE_ACTION_BUTTON_TITLE,
  LBL_CONFIRM_YES,
  LBL_CONFIRM_NO,
  LBL_ACTION_BUTTON_TITLE,
  LBL_CANCEL_BUTTON_TITLE,
} from "../../../constant";

import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { LBL_DELETE_BUTTON_TITLE } from "@/constant/language/en_us";
import PrintAsPdf from "./components/printaspdf";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
import ComposeEmail from "@/components/ComposeEmail";
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    fontSize: "0.8rem",
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function MoreActionButton(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentTheme = useTheme();
  const { selectedModule } = useSelector((state) => state.modules);
  const config = useSelector((state) => state.config);
  const rowsPerPage = pathOr(
    20,
    ["config", "list_max_entries_per_page"],
    config,
  );

  const { actions } = useComposeViewData((state) => ({
    actions: state.actions,
  }));

  const { detailViewTabData } = useSelector((state) => state.detail);

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [addToTargetModalVisible, setAddToTargetModalVisible] = useState(false);
  const [printAsPdfVisible, setPrintAsPdfVisible] = useState(false);

  const [actionPopupOpen, setActionPopupOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [actionName, setActionName] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [auditViewPopup, setAuditViewPopup] = useState(false);
  const site_url = useSelector((state) => state.config.config.site_url);
  const userData = pathOr(
    undefined,
    ["data", "attributes"],
    useSelector((state) => state.config.currentUserData),
  );
  const [alertInfo, setAlertInfo] = useState({
    title: "",
    msg: "",
    visible: false,
    action: "",
  });
  const parentData = {
    parent_name: props.recordName,
    parent_id: props.record,
    parent_type: props.module,
  };

  const buildPayloadForMassUpdate = (
    action,
    type,
    id,
    attributes = [],
    prospect_list = "",
  ) => ({
    action,
    data: {
      type,
      id,
      attributes,
      prospect_list,
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const exportReportAction = async (exportFileFormat = "csv") => {
    try {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      const payload = { report_id: props.record };
      toast(LBL_EXPORT_INPROGRESS);
      let res = await dispatch(exportReport(payload, exportFileFormat));
      if (res.ok) {
        setLoading(false);
        toast(LBL_EXPORT_SUCCESS_MESSAGE);
      } else {
        toast(res.data.errors.detail);
      }
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(LBL_ERROR);
    }
  };

  const downloadReportPdfAction = async () => {
    try {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      const payload = { report_id: props.record, graphsForPDF: [] };
      toast(LBL_DOWNLOAD_INPROGRESS);
      if (props.module == "AOR_Reports") {
        const reportChartData = pathOr(
          [],
          [props.module, "data", "templateMeta", "report_chart", "chart"],
          detailViewTabData,
        );
        const reportChartIDArr = reportChartData.map((e) => e.id);
        payload["graphsForPDF"] = await reportChartIDArr.map(
          async (element) => {
            const canvas = await html2canvas(
              document.querySelector(`#chart_${element}`),
            );
            const base64 = await canvas.toDataURL();
            return base64;
          },
        );
      }
      if (!isEmpty(payload["graphsForPDF"])) {
        Promise.all(payload["graphsForPDF"]).then((values) => {
          payload["graphsForPDF"] = values;
          dispatch(downloadReportPdf(payload))
            .then((res) => {
              if (res.ok) {
                setLoading(false);
                toast(LBL_REPORT_DOWNLOAD_SUCCESS_MESSAGE);
              } else {
                toast(res.data.errors.detail);
              }
            })
            .catch((e) => {
              setAlertInfo((prev) => ({ ...prev, visible: false }));
              toast(LBL_ERROR);
            });
        });
      } else {
        dispatch(downloadReportPdf(payload))
          .then((res) => {
            if (res.ok) {
              setLoading(false);
              toast(LBL_REPORT_DOWNLOAD_SUCCESS_MESSAGE);
            } else {
              toast(res.data.errors.detail);
            }
          })
          .catch((e) => {
            setAlertInfo((prev) => ({ ...prev, visible: false }));
            toast(LBL_ERROR);
          });
      }
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(LBL_ERROR);
    }
  };

  const downloadAsHTML = () => {
    let url = `${site_url}index.php?entryPoint=customDownload&id=${props.record}&type=${props.module}`;
    window.open(url, "_blank");
  };

  const addIdToTargetList = async (propspectListId) => {
    try {
      setLoading(true);
      let recordsToBeAddedIds = [props.record];
      const payload = buildPayloadForMassUpdate(
        "addToTargetList",
        props.module,
        recordsToBeAddedIds,
        [],
        propspectListId,
      );
      let res = await massUpdate(payload);
      if (res.ok) {
        setLoading(false);
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(LBL_ADD_TO_TARGET_LIST_SUCCESS);
        dispatch(getListView(props.module, 0, rowsPerPage));
      } else {
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(res.data.errors.detail);
      }
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(LBL_ERROR);
    }
  };

  const deleteRecord = async () => {
    try {
      const res = await deleteRecordFromModule(props.module, props.record);
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(">>>>>>" + res.ok ? res.data.meta.message : res.data.errors.detail);
      history.push("/app/" + props.module);
    } catch (e) {
      toast(LBL_ERROR);
    }
  };

  const convertToInvoiceAction = async () => {
    try {
      const res = await convertToInvoice(props.module, props.record);
      //toast(res.ok ? res.data.meta.message : res.data.errors.detail);
      let id = res.data.data.record_data.id;
      res.ok
        ? history.push("/app/editview/AOS_Invoices/" + id)
        : toast(LBL_ERROR);
    } catch (e) {
      toast(LBL_ERROR);
    }
  };

  const emailCustomerReviewAction = async () => {
    try {
      handleClose();
      setAlertInfo((prev) => ({ ...prev, visible: false }));

      toast(LBL_SEND_TO_CUSETOMER_REVIEW_INPROGRESS);
      // let res = await emailCustomerReview(payload);
      dispatch(emailCustomerReview(props.module, props.record)).then(
        function (res) {
          setLoading(false);
          toast(LBL_SEND_TO_CUSETOMER_REVIEW_SUCCESS);
        },
      );
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(SOMETHING_WENT_WRONG);
    }
  };

  useEffect(() => {
    if (actionName === "LBL_PRINT_AS_PDF") {
      setAnchorEl(null);

      setAlertInfo((prev) => ({
        ...prev,
        title: LBL_PRINT_AS_PDF,
        msg: LBL_DOWNLOAD_AS_PDF_CONFIRM_MESSAGE,
        visible: true,
        action: printAsPdfAction,
      }));
      setActionName(null);
      setSelectedValue(null);
      setActionPopupOpen(false);
    } else if (
      actionName === "LBL_EMAIL_PDF" ||
      actionName === "LBL_EMAIL_QUOTE"
    ) {
      setEmailLoading(true);
      const payload = {
        module: props.module,
        report_id: props.record,
        extraTask: actionName === "LBL_EMAIL_QUOTE" ? "email" : "emailpdf",
        templateId: selectedValue,
      };
      dispatch(emailAsPdf(payload)).then(function (res) {
        let paramsData = {};
        if (actionName === "LBL_EMAIL_QUOTE") {
          paramsData = {
            email_description: pathOr("", ["data", "email_description"], res),
          };
        } else {
          paramsData = { documents: pathOr([], ["data"], res) };
        }
        setEmailLoading(false);
        actions.handleOpenEmailCompose(
          {
            moduleName: parentData.parent_type,
            recordId: parentData.parent_id,
            recordName: parentData.parent_name,
          },
          paramsData,
        );
        setEmailModalVisible(!emailModalVisible);
        setAnchorEl(null);
        setActionName(null);
        setSelectedValue(null);
        setActionPopupOpen(false);
      });
    }
    // else
    // if (actionName === 'LBL_EMAIL_QUOTE') {
    //   dispatch(getEmailCreateView()).then(function () {
    //     emailAsPdfAction('emailpdf')
    //     setEmailModalVisible(!emailModalVisible);
    //     setAnchorEl(null);
    //     setActionName(null);
    //     setSelectedValue(null);
    //     setActionPopupOpen(false)

    //   });

    // }
  }, [selectedValue]);

  const emailAsPdfAction = async (extraTask) => {
    try {
      const payload = {
        module: props.module,
        report_id: props.record,
        extraTask: extraTask,
        templateId: selectedValue,
      };
      let res = await printAsPdf(payload);
      if (res.ok) {
        setLoading(false);
      } else {
        toast(res.data.errors.detail);
      }
    } catch (e) {
      toast(LBL_ERROR);
    }
  };

  const printAsPdfAction = () => {
    try {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      const payload = {
        module: props.module,
        report_id: props.record,
        extraTask: "pdf",
        templateId: selectedValue,
      };
      toast(LBL_DOWNLOAD_INPROGRESS);
      dispatch(printAsPdf(payload)).then(function (res) {
        setLoading(false);
        const n = pathOr(
          "",
          ["data", "attributes", "url_redirect"],
          res,
        ).lastIndexOf("/");
        const filename = pathOr(
          "",
          ["data", "attributes", "url_redirect"],
          res,
        ).substring(n + 1);
        saveAs(
          `${site_url}/${pathOr(
            "",
            ["data", "attributes", "url_redirect"],
            res,
          )}`,
          filename,
        );

        toast(LBL_GENERATE_PDF_SUCCESS);
      });
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(LBL_ERROR);
    }
  };

  const travelActionButtons = async (data) => {
    try {
      const record = JSON.stringify({
        data: {
          id: props.record,
          type: props.module,
          attributes: data,
        },
      });
      const res = await api.patch(`/V8/module`, record);
      if (res.ok) {
        toast(LBL_RECORD_UPDATED);
        dispatch(getDetailView(props.module, props.record));
      } else {
        toast(LBL_ERROR);
      }
    } catch (e) {
      toast(LBL_ERROR);
    }
  };

  const quoteCreateModuleRecord = async (createAction) => {
    try {
      toast(LBL_RECORD_CREATE_INPROGRESS);
      let redirectModule = "";
      if (createAction === "CreateOpportunity") {
        redirectModule = "Opportunities";
      }
      if (createAction === "CreateContract") {
        redirectModule = "AOS_Contracts";
      }
      const res = await api.get(
        `/V8/actionbutton/${createAction}/${props.module}/${props.record}`,
      );
      if (res.ok) {
        let id = pathOr("", ["data", "data", "record_data", "id"], res);
        toast(LBL_RECORD_CREATED);
        if (id) {
          history.push("/app/editview/" + redirectModule + "/" + id);
        }
      } else {
        toast(LBL_ERROR);
      }
    } catch (e) {
      toast(LBL_ERROR);
    }
  };

  const renderActionButtons = () => {
    const tempButtonList = props.actionButtons.map((action, key) => {
      let actions = {};
      actions.actionName = action.label;
      switch (action.key) {
        case "EDIT":
          actions.onClick = () =>
            history.push("/app/editview/" + props.module + "/" + props.record);
          break;
        case "ASSIGNED_TO_ME":
          actions.onClick = () =>
            travelActionButtons({
              assigned_user_id: {
                id: userData.id,
                value: userData.user_name,
              },
            });
          break;
        case "START_WORK":
          actions.onClick = () =>
            travelActionButtons({ status: "Open_In_Progress" });
          break;
        case "PAUSE_WORK":
          actions.onClick = () =>
            travelActionButtons({ status: "Open_Pending Input" });
          break;
        case "DELETE":
          actions.onClick = () =>
            setAlertInfo((prev) => ({
              ...prev,
              title: LBL_CONFIRM_DELETE_TITLE,
              msg: LBL_CONFIRM_DELETE_RECORD_DESCRIPTION,
              visible: true,
              action: deleteRecord,
            }));
          break;
        case "DUPLICATE":
          actions.onClick = () =>
            history.push(
              "/app/duplicateview/" + props.module + "/" + props.record,
            );
          break;
        case "FIND_DUPLICATES":
          actions.onClick = () => toast(LBL_NO_ACTION_FOUND);
          break;
        case "CHANGE_LOG":
          actions.onClick = () => setAuditViewPopup(!auditViewPopup);
          break;
        case "LBL_CONVERTLEAD":
          actions.onClick = () =>
            history.push("/app/convertlead/Leads/" + props.record);
          break;
        case "LBL_GENERATE_LETTER":
          actions.onClick = () => toast(LBL_NO_ACTION_FOUND);
          break;
        case "Create":
        case "CREATE":
          actions.onClick = () =>
            history.push("/app/createview/" + props.module);
          break;

        case "LBL_EXPORT":
          actions.onClick = () =>
            setAlertInfo((prev) => ({
              ...prev,
              title: LBL_EXPORT_REPORT,
              msg: LBL_EXPORT_REPORT_CONFIRM_MESSAGE,
              visible: true,
              action: exportReportAction,
            }));
          break;
        case "LBL_EXPORT_XLSX":
          actions.onClick = () =>
            setAlertInfo((prev) => ({
              ...prev,
              title: LBL_EXPORT_REPORT,
              msg: LBL_EXPORT_REPORT_CONFIRM_MESSAGE,
              visible: true,
              action: () => exportReportAction("xlsx"),
            }));
          break;
        case "LBL_DOWNLOAD_PDF":
          actions.onClick = () =>
            setAlertInfo((prev) => ({
              ...prev,
              title: LBL_DOWNLOAD_REPORT_AS_PDF,
              msg: LBL_DOWNLOAD_REPORT_AS_PDF_CONFIRM_MESSAGE,
              visible: true,
              action: downloadReportPdfAction,
            }));
          break;
        case "LBL_ADD_TO_PROSPECT_LIST":
          actions.onClick = () =>
            setAddToTargetModalVisible(!addToTargetModalVisible);
          break;

        case "LBL_PRINT_AS_PDF":
          actions.onClick = () => (
            setActionPopupOpen(true), setActionName("LBL_PRINT_AS_PDF")
          );
          break;
        case "LBL_PRINT_AS_PDF_DETAILVIEW":
          actions.onClick = () => {
            setPrintAsPdfVisible(true);
            handleClose();
          };
          break;
        case "LBL_EMAIL_PDF":
          actions.onClick = () => (
            setActionPopupOpen(true), setActionName("LBL_EMAIL_PDF")
          );
          break;
        case "LBL_EMAIL_QUOTE":
          actions.onClick = () => (
            setActionPopupOpen(true), setActionName("LBL_EMAIL_QUOTE")
          );
          break;
        case "LBL_CREATE_OPPORTUNITY":
          actions.onClick = () => quoteCreateModuleRecord("CreateOpportunity");
          break;
        case "LBL_CREATE_CONTRACT":
          actions.onClick = () => quoteCreateModuleRecord("CreateContract");
          break;

        case "LBL_CONVERT_TO_INVOICE":
          //actions.onClick = () => history.push("/app/convert/AOS_Invoices/" + props.record + "/AOS_Quotes");
          actions.onClick = () => convertToInvoiceAction();

          break;
        case "LBL_EMAIL_CUSTOMER_REVIEW":
          actions.onClick = () =>
            setAlertInfo((prev) => ({
              ...prev,
              title: LBL_SEND_TO_CUSETOMER_REVIEW_SUCCESS,
              msg: LBL_SEND_TO_CUSETOMER_REVIEW_CONFIRM_MESSAGE,
              visible: true,
              action: emailCustomerReviewAction,
            }));
          break;
        case "LBL_KB_EXPORT_TO_HTML":
          actions.onClick = () => downloadAsHTML();
          break;
        default:
          actions.onClick = () => toast(LBL_NO_ACTION_FOUND);
          break;
      }
      return (
        <StyledMenuItem onClick={actions.onClick}>
          <div className={classes.listItem}>{action.label}</div>
        </StyledMenuItem>
      );
    });
    return tempButtonList;
  };

  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      {props.actionButtons && props.actionButtons.length ? (
        <>
          <ButtonGroup
            variant="contained"
            color="primary"
            ref={anchorEl}
            aria-label="split button"
            className={classes.moreActionBtn}
          >
            {props.actionButtons[0].key === "EDIT" ? (
              <Tooltip
                title={LBL_EDIT_RECORD_BUTTON_TITLE}
                arrow
                placement="bottom"
              >
                <Button
                  className={classes.moreActionBtn}
                  color="primary"
                  size="small"
                  onClick={() =>
                    history.push(
                      "/app/editview/" + props.module + "/" + props.record,
                    )
                  }
                  id={`LBL_EDIT_BUTTON_TITLE`}
                >
                  {LBL_EDIT_BUTTON_TITLE}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                title={LBL_MORE_ACTION_BUTTON_TITLE}
                arrow
                placement="bottom"
              >
                <Button
                  className={classes.moreActionBtn}
                  color="primary"
                  size="small"
                  aria-controls={
                    Boolean(anchorEl) ? "split-button-menu" : undefined
                  }
                  aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleClick}
                  id={`LBL_ACTION_BUTTON_TITLE`}
                >
                  {LBL_ACTION_BUTTON_TITLE}
                </Button>
              </Tooltip>
            )}
            <Tooltip
              title={LBL_MORE_ACTION_BUTTON_TITLE}
              arrow
              placement="bottom"
            >
              <Button
                className={classes.moreActionCaretBtn}
                color="primary"
                size="small"
                aria-controls={
                  Boolean(anchorEl) ? "split-button-menu" : undefined
                }
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleClick}
                id={`drop-down-menu`}
              >
                <ArrowDropDownIcon fontSize="small" />
              </Button>
            </Tooltip>
          </ButtonGroup>
          <StyledMenu
            id="more-action"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {renderActionButtons()}
          </StyledMenu>
        </>
      ) : null}
      {addToTargetModalVisible && (
        <AddToTargetListModal
          modalVisible={addToTargetModalVisible}
          toggleModalVisibility={() =>
            setAddToTargetModalVisible(!addToTargetModalVisible)
          }
          addIdToTargetList={addIdToTargetList}
          selectedModule={selectedModule}
        />
      )}

      {auditViewPopup && (
        <AuditView
          modalVisible={auditViewPopup}
          toggleModalVisibility={() => setAuditViewPopup(!auditViewPopup)}
          module={props.module}
          record={props.record}
        />
      )}
      <Alert
        title={alertInfo.title}
        msg={alertInfo.msg}
        open={alertInfo.visible}
        agreeButtonProps={
          alertInfo.title === LBL_CONFIRM_DELETE_TITLE && {
            style: {
              backgroundColor: loading ? "grey" : "#D70040",
              color: "white",
            },
          }
        }
        agreeText={
          loading ? (
            <CircularProgress />
          ) : alertInfo.title === LBL_CONFIRM_DELETE_TITLE ? (
            LBL_DELETE_BUTTON_TITLE
          ) : (
            LBL_CONFIRM_YES
          )
        }
        disagreeText={
          !loading &&
          (alertInfo.title === LBL_CONFIRM_DELETE_TITLE
            ? LBL_CANCEL_BUTTON_TITLE
            : LBL_CONFIRM_NO)
        }
        onDisagree={() => setAlertInfo({ visible: false })}
        handleClose={() => setAlertInfo({ visible: false })}
        onAgree={() => alertInfo.action()}
        loading={loading}
      />
      {actionPopupOpen ? (
        <ActionPopup
          actionName={actionName}
          module={props.module}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          actionPopupOpen={actionPopupOpen}
          setActionPopupOpen={setActionPopupOpen}
          emailLoading={emailLoading}
        />
      ) : null}
      {printAsPdfVisible ? (
        <PrintAsPdf
          open={printAsPdfVisible}
          setOpen={setPrintAsPdfVisible}
          detailViewTabData={detailViewTabData}
          module={props.module}
          id={props.record}
        />
      ) : null}

      {emailModalVisible ? (
        <ComposeEmail
          handleClose={() => setEmailModalVisible(false)}
          open={emailModalVisible}
        />
      ) : null}
    </MuiThemeProvider>
  );
}
