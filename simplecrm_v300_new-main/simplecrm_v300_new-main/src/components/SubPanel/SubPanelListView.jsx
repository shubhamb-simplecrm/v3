import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Chip,
  Paper,
  Typography,
  Tooltip,
  useTheme,
  Button,
} from "@material-ui/core";
import { NoRecord } from "../../components";
import { Add } from "@material-ui/icons";
import { isNil, pathOr, isEmpty } from "ramda";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import {
  getSubpanelListViewData,
  getSubpanelRecordDetailView,
  deleteRelationship,
  createRecordRelationshipAction,
  closeActivity,
} from "../../store/actions/subpanel.actions";
import useStyles, { getMuiTheme } from "./styles";
import { Alert } from "../../components";
import SkeletonShell from "../../components/Skeleton/index";
import FormInput from "../FormInput";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import ReplyIcon from "@material-ui/icons/ReplyOutlined";
import ReplyAllIcon from "@material-ui/icons/ReplyAllOutlined";
import RedoOutlinedIcon from "@material-ui/icons/RedoOutlined";
import { toast } from "react-toastify";
import { TableCell, TableRow, Card, CardContent } from "@material-ui/core";
import { saveAs } from "file-saver";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FileViewerComp from "../FileViewer/FileViewer";
import parse from "html-react-parser";
import "./styles.css";
import clsx from "clsx";
import FaIcon from "../FaIcon";
import {
  LBL_EDIT_BUTTON_TITLE,
  LBL_QUICK_CREATE_BUTTON_TITLE,
  LBL_DOWNLOAD_INPROGRESS,
  LBL_BULK_ACTION_BUTTON_TITLE,
  LBL_REPLY,
  LBL_REPLY_ALL,
  LBL_FORWARD_EMAIL,
  LBL_DELETE_BUTTON_TITLE,
  LBL_CLOSE_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
  LBL_CLOSED,
  LBL_DELETE_RELATIONSHIP_CONFIRM_TITLE,
  LBL_DELETE_RELATIONSHIP_CONFIRM_MESSAGE,
  LBL_CLOSE_CONFIRM_MESSAGE,
  LBL_WARNING_TITLE,
  LBL_SELECT_BUTTON_LABEL,
} from "../../constant";
import {
  checkInitGroupValidate,
  checkMaskingCondition,
} from "../../common/utils";
import QuickCreate from "../QuickCreate";
import CustomFooter from "./components/CustomFooter";
import { useFilePreviewer } from "@/context/FilePreviewContext";
import { IconButton } from "../SharedComponents/IconButton";
import MuiLink from "../SharedComponents/Link";
import ComposeEmail from "../ComposeEmail";
import useComposeViewData from "../ComposeEmail/hooks/useComposeViewData";
import CustomDialog from "../SharedComponents/CustomDialog";
import {
  EmailDetailHeader,
  EmailDetailToolbar,
  EmailBody,
} from "../Email/components/EmailDetailView";
import { useEmailState } from "../Email/useEmailState";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { useReactToPrint } from "react-to-print";
import useCommonUtils from "@/hooks/useCommonUtils";

const SubPanelListView = (propsData) => {
  const {
    module,
    subpanel,
    subpanel_module,
    title,
    record,
    recordName,
    setIsSubpanelUpdated,
    value,
    setValue,
    relationShipName,
    relationShipModule,
    fieldConfiguratorData = {},
    calendarView = false,
    isStatusBarActive,
  } = propsData;
  const history = useHistory();
  const isMobile = useIsMobileView("sm");
  const { onFileDialogStateChange } = useFilePreviewer();
  const { subpanelListViewRowPerPage } = useCommonUtils();
  const { emailComposeActions } = useComposeViewData((state) => ({
    emailComposeActions: state.actions,
  }));
  const { emailActions } = useEmailState((state) => ({
    emailActions: state.actions,
  }));
  const { sidebarLinks } = useSelector((state) => state.layout);
  const [openEmailDetailView, setOpenEmailDetailView] = useState(false);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [relateFieldData, setRelateFieldData] = useState({});
  const [relateFieldMeta, setRelateFieldMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [activityRecord, setActivityRecord] = useState("");
  const [rel, setRel] = useState("");
  const [openQuickCreateDialog, setOpenQuickCreateDialog] = useState(false);
  const [openEmailCompose, setOpenEmailCompose] = useState(false);
  const [openRelatedTo, setOpenRelatedTo] = useState(false);
  const [isRelationshipAdded, setIsRelationshipAdded] = useState(false);
  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});
  const classes = useStyles();
  const theme = useTheme();
  const fieldConfigurator = pathOr(
    [],
    [
      "templateMeta",
      "FieldConfigursion",
      "data",
      "JSONeditor",
      "dynamicLogic",
      "fields",
    ],
    relateFieldData,
  );
  const sortBy = pathOr(
    "",
    ["data", "templateMeta", "sort"],
    relateFieldData[module],
  );
  const sortOrder = pathOr(
    "",
    ["data", "templateMeta", "sortOrder"],
    relateFieldData[module],
  );
  const [lastListViewSort, setLastListViewSort] = useState({
    name: sortBy,
    direction: sortOrder,
  });
  const [relateFieldDetailData, setRelateFieldDetailData] = useState([]);
  const [SortByNEWObj, setSortByNEWObj] = useState({
    name: sortBy,
    order: sortOrder,
  });
  const [detailExpanded, setDetailExpanded] = useState([]);

  const [previewFile, setPreviewFile] = useState({
    open: false,
    filename: "",
    filepath: "",
  });
  const listTopButtons = useMemo(() => {
    const topButtons = pathOr(
      [],
      ["templateMeta", "data", "subpanel_tabs", 0, "top_buttons"],
      relateFieldData,
    );
    const createButton = topButtons.filter((obj) => obj?.type == "create");
    const selectButton = topButtons.filter((obj) => obj?.type == "select");
    return {
      isCreateButtonVisible: !isEmpty(createButton),
      isSelectButtonVisible: !isEmpty(selectButton),
    };
  }, [relateFieldData]);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  useEffect(() => {
    if (relateFieldData) {
      setRel(relateFieldData?.templateMeta?.data.subpanel_tabs[0]?.rel_module);
    }
  }, [rel, relateFieldData]);

  const changePageOrSort = async ({ page, name, order }) => {
    try {
      if (typeof page === "undefined") return;
      setLoading(true);
      setListViewMeta({ page });
      const res = await getSubpanelListViewData(
        module,
        subpanel,
        subpanel_module,
        record,
        subpanelListViewRowPerPage,
        page + 1,
        name,
        order,
      );
      if (res.ok) {
        setRelateFieldData(res.data.data);
        setRelateFieldMeta(res?.data?.meta);
        setRel(res?.data?.data?.templateMeta?.data.subpanel_tabs[0]?.rel_name);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    changePageOrSort(SortByNEWObj);
  }, [SortByNEWObj]);
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  const handleShowPreviewFile = (inputFileName, inputFileURL) => {
    onFileDialogStateChange(
      true,
      {
        fileName: inputFileName,
        filePath: inputFileURL,
        // fileType: fileExt,
      },
      true,
    );
  };

  let relateField = {
    comment: null,
    field_key: "relatedRecords",
    label: subpanel_module,
    massupdate: "false",
    name: "relatedRecords",
    required: "false",
    type: "relate",
    module: subpanel_module,
  };

  const handleChange = (field, val) => {
    let param = {
      data: [],
    };
    if (field === "relatedRecords") {
      let innerData = [];

      if (val) {
        Object.values(val).map((id) =>
          innerData.push({
            type: subpanel_module,
            id: id,
            relationshipName: !!relationShipName ? relationShipName : "",
            relationshipModule: !!relationShipModule ? relationShipModule : "",
          }),
        );
      }

      param = {
        data: innerData,
      };
    } else {
      param = {
        data: [
          {
            type: subpanel_module,
            id: val.id,
            relationshipName: !!relationShipName ? relationShipName : "",
            relationshipModule: !!relationShipModule ? relationShipModule : "",
          },
        ],
      };
    }
    createRecordRelationshipAction(module, record, param).then((res) => {
      if (res && res.meta) {
        toast(res.meta.message);
        setIsRelationshipAdded(true);
        setIsSubpanelUpdated(true);
        setValue(value);
      } else {
        toast(SOMETHING_WENT_WRONG);
      }
    });
  };

  const [listViewMeta, setListViewMeta] = useState({
    page: 0,
  });
  const config = useSelector((state) => state.config);
  const site_url = pathOr("", ["config", "site_url"], config);
  const statusBackground = pathOr(
    [],
    ["config", "fields_background", subpanel_module],
    config,
  );
  let statusField = Object.keys(statusBackground);

  const handleOpenQuickCreateDialog = (option, actionName, data = null) => {
    if (option === "Create") {
      if (actionName == "Emails") {
        setOpenEmailCompose(true);
        emailComposeActions.handleOpenEmailCompose(
          {
            recordId: data.id,
            moduleName: "Emails",
            actionType: data.type,
          },
          data,
          data.type,
        );
      } else {
        setOpenQuickCreateDialog(!openQuickCreateDialog);
      }
    } else {
      setOpenRelatedTo(!openRelatedTo);
    }
  };

  const fetchSupanelListViewData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSubpanelListViewData(
        module,
        subpanel,
        subpanel_module,
        record,
        subpanelListViewRowPerPage,
        listViewMeta.page + 1,
      );
      if (res.ok) {
        setRelateFieldData(res.data.data);
        setRelateFieldMeta(res?.data?.meta);
      }
      setLoading(false);
    } catch (ex) {
      setLoading(false);
    }
    setIsRelationshipAdded(false);
  }, [
    module,
    subpanel,
    subpanel_module,
    record,
    isRelationshipAdded,
    subpanelListViewRowPerPage,
  ]);

  useEffect(() => {
    fetchSupanelListViewData();
  }, [fetchSupanelListViewData]);

  useEffect(() => {
    setRelateFieldDetailData(relateFieldDetailData);
  }, [relateFieldDetailData]);

  useEffect(() => {
    setDetailExpanded(detailExpanded);
  }, [detailExpanded]);

  useEffect(() => {
    setLastListViewSort({ name: sortBy, direction: sortOrder });
  }, [subpanel_module]);

  const onChangeValidationCheck = (
    fields,
    initialValues,
    fieldConfigurator,
    status,
    errors,
    typeList,
    allFields,
  ) => {
    const getValidation = checkInitGroupValidate(
      fields,
      initialValues,
      fieldConfigurator,
      status,
      errors,
      typeList,
      allFields,
    );
    return pathOr(errors, ["errors"], getValidation);
  };

  const renderLoader = () => <SkeletonShell layout="Subpanel" />;
  const confirmDeleteRelationship = (
    module,
    record,
    relationship,
    relateId,
    rel,
  ) => {
    setAlertVisibility(true);
    setActivityRecord({
      rel: rel,
      module: module,
      record: record,
      relationship: relationship,
      relateId: relateId,
      function: "deleteRelationshipRecord",
      msg: LBL_DELETE_RELATIONSHIP_CONFIRM_MESSAGE,
      title: LBL_DELETE_RELATIONSHIP_CONFIRM_TITLE,
    });
  };
  const confirmCloseActivity = (module, record, relationship, relateId) => {
    setAlertVisibility(true);
    setActivityRecord({
      module: module,
      record: record,
      relationship: relationship,
      status: relationship === "Tasks" ? "Completed" : "Held",
      relateId: relateId,
      function: "closeActivity",
      msg: LBL_CLOSE_CONFIRM_MESSAGE,
      title: LBL_WARNING_TITLE,
    });
  };
  const closeActivityMethod = async () => {
    setAlertVisibility(!alertVisible);
    try {
      var submitData = {
        data: {
          type: activityRecord.relationship,
          id: activityRecord.relateId,
          attributes: {
            status: activityRecord.status,
          },
        },
      };
      let data = JSON.stringify(submitData);
      const res = await closeActivity(data);
      if (res.data.data.id) {
        fetchSupanelListViewData();
        setIsSubpanelUpdated(true);
        setValue(value);
        toast(LBL_CLOSED);
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const deleteRelationshipRecord = async () => {
    // alert("ACTIVITY RECORD Deleting");
    setAlertVisibility(!alertVisible);
    try {
      const res = await deleteRelationship(
        activityRecord.module,
        activityRecord.record,
        activityRecord.relationship,
        activityRecord.relateId,
        activityRecord.rel,
      );
      toast(res?.data ? res?.data?.meta?.message : res?.data?.errors?.detail);
      fetchSupanelListViewData();
      setIsSubpanelUpdated(true);
      setValue(value);
      setActivityRecord("");
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const toggleEmailDetailView = () => {
    setOpenEmailDetailView(!openEmailDetailView);
  };
  const renderListView = () => {
    let dataArr = pathOr(
      [],
      ["templateMeta", "data", "subpanel_tabs"],
      relateFieldData,
    );

    dataArr = Object.entries(dataArr);
    dataArr = dataArr[0] ? dataArr[0] : [];
    dataArr = dataArr[1] ? dataArr[1] : [];

    let data = pathOr(
      [],
      ["templateMeta", "data", "subpanel_tabs", 0, "listview", "data", 0],
      relateFieldData,
    );
    let tempData = [];
    data.forEach((row) => {
      let tempRowObj = Object.entries(row)
        .filter(([key, value]) => key !== "")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      tempData.push(tempRowObj);
    });
    data = tempData;
    let columnsArr = pathOr(
      [],
      ["templateMeta", "data", "subpanel_tabs", 0, "listview", "datalabels"],
      relateFieldData,
    );
    columnsArr.forEach((item) => {
      if (!isNil(item.name)) {
        fields[item.name] = item;
      }
    });
    columnsArr = columnsArr.filter(
      (item) => item.name !== null && item.name !== undefined,
    );
    data.map((initialValue) => {
      initialValue = checkMaskingCondition(
        fieldConfigurator,
        initialValue,
        "masking",
      );

      const getNewErrors = onChangeValidationCheck(
        fields,
        initialValue,
        fieldConfigurator,
        true,
        errors,
        ["visible"],
        fields,
      );
      Object.keys(fields).map((item) => {
        if (getNewErrors[item] === "InVisible") {
          initialValue[item] = "";
        }
      });
    });
    // let columns = columnsArr.filter((it) => it.name !== 'remove_button').map((it) => {
    const setEmailUnreadFlag = (tableMeta) => {
      const emailModule =
        subpanel_module === "History"
          ? pathOr("", [tableMeta["rowIndex"], "object_image"], data)
          : null;
      let statusValue =
        emailModule === "Emails"
          ? pathOr("", [tableMeta["rowIndex"], "status"], data)
          : null;
      return emailModule && statusValue === "unread" ? classes.emailUnread : "";
    };
    let nameflag = false;
    let columns = columnsArr
      .filter((it) => it.name !== "remove_button")
      .map((it) => {
        if (
          statusField &&
          statusField.length > 0 &&
          statusField.some((item) => it.name === item)
        ) {
          return {
            ...it,
            options: {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                let option = it.options
                  ? Object.keys(it.options).find(
                      (key) => it.options[key] === value,
                    )
                  : "";
                let optionBgColor = `${pathOr(
                  "",
                  [it.name, option, "background_color"],
                  statusBackground,
                )}`;
                let statusStyle = {};

                if (theme.palette.type === "dark") {
                  statusStyle = {
                    color: optionBgColor,
                    fontWeight: "bolder",
                    background: "transparent",
                    border: "1px solid",
                  };
                } else {
                  statusStyle = {
                    color: optionBgColor,
                    background: optionBgColor + "20",
                    border: "none",
                  };
                }
                return value && optionBgColor ? (
                  <Chip
                    size="small"
                    className={classes.statusBg}
                    style={statusStyle}
                    label={value}
                  />
                ) : (
                  value
                );
              },
            },
          };
        }
        if (it.name === "object_image") {
          return {
            ...it,
            options: {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                //let viewAcl = pathOr(0, ['ACLAccess', 'view'], data[tableMeta["rowIndex"]]);
                //const id = data[tableMeta["rowIndex"]].id;
                //const redirectModule = subpanel_module === 'History' || subpanel_module === 'Activities' ? data[tableMeta["rowIndex"]].object_image : subpanel_module;
                return (
                  <Typography className={setEmailUnreadFlag(tableMeta)}>
                    {value}
                  </Typography>
                );
              },
            },
          };
        }
        if (
          it.name === "name" ||
          it.name === "full_name" ||
          it.name === "first_name" ||
          it.name === "last_name" ||
          it.name === "document_name"
        ) {
          if (!nameflag) {
            nameflag = true;
            return {
              ...it,
              options: {
                setCellProps: (value) => {
                  return {
                    className: clsx({
                      [classes.NameCell]: true,
                    }),
                  };
                },
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let viewAcl = pathOr(
                    0,
                    ["ACLAccess", "view"],
                    data[tableMeta["rowIndex"]],
                  );
                  const id = data[tableMeta["rowIndex"]].id;
                  const redirectModule =
                    subpanel_module === "History" ||
                    subpanel_module === "Activities"
                      ? data[tableMeta["rowIndex"]].object_image
                      : subpanel_module;
                  const icon = pathOr(
                    "fa-cube",
                    ["attributes", redirectModule, "icon", "icon"],
                    sidebarLinks,
                  );
                  if (viewAcl === 1) {
                    return (
                      <Typography
                        className={`subpanel-name ${setEmailUnreadFlag(
                          tableMeta,
                        )}`}
                      >
                        <Tooltip title={value}>
                          <>
                            <Link
                              to={
                                redirectModule == "Emails"
                                  ? "#"
                                  : `/app/detailview/${redirectModule}/${id}`
                              }
                              className={classes.link}
                              variant="body2"
                              onClick={() => {
                                if (redirectModule == "Emails") {
                                  toggleEmailDetailView();
                                  emailActions.getEmailDetailData(
                                    null,
                                    null,
                                    null,
                                    null,
                                    id,
                                  );
                                }
                              }}
                            >
                              {window.innerWidth < 995.95 &&
                              (subpanel_module === "History" ||
                                subpanel_module === "Activities") ? (
                                <FaIcon
                                  className={classes.listModuleIcon}
                                  icon={`fas ${icon}`}
                                  size="1x"
                                />
                              ) : null}

                              {truncate(value, 30)}
                            </Link>
                          </>
                        </Tooltip>
                      </Typography>
                    );
                  } else {
                    return (
                      <Typography
                        className={`subpanel-name ${setEmailUnreadFlag(
                          tableMeta,
                        )}`}
                      >
                        {value}
                      </Typography>
                    );
                  }
                },
              },
            };
          }
        } else if (it.type === "relate") {
          return {
            ...it,
            options: {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const ss = it.id_name;
                const parent_id = data[tableMeta["rowIndex"]][ss];
                const parent_type = it.module;

                return (
                  <Typography className={setEmailUnreadFlag(tableMeta)}>
                    <Link
                      to={`/app/detailview/${parent_type}/${parent_id}`}
                      className={classes.link}
                      // component="button"
                      variant="body2"
                    >
                      {value}
                    </Link>
                  </Typography>
                );
              },
            },
          };
        } else if (it.type === "parent") {
          return {
            ...it,
            options: {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const parent_id =
                  data[tableMeta["rowIndex"]]?.attributes?.parent_id;
                const parent_type =
                  data[tableMeta["rowIndex"]]?.attributes?.parent_type;

                return (
                  <Typography className={setEmailUnreadFlag(tableMeta)}>
                    <Link
                      to={`/app/detailview/${parent_type}/${parent_id}`}
                      className={classes.link}
                      // component="button"
                      variant="body2"
                    >
                      {value}
                    </Link>
                  </Typography>
                );
              },
            },
          };
        } else if (it.name === "action") {
          return {
            name: "Actions",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <TableCell
                  variant="head"
                  // align="center"
                  className={classes.headRightBtn}
                >
                  {LBL_BULK_ACTION_BUTTON_TITLE}
                </TableCell>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                let editAcl = pathOr(
                  0,
                  ["ACLAccess", "edit"],
                  data[tableMeta["rowIndex"]],
                );
                let deletAcl = pathOr(
                  0,
                  ["ACLAccess", "delete"],
                  data[tableMeta["rowIndex"]],
                );
                let forwardAcl = pathOr(
                  0,
                  ["ACLAccess", "forward"],
                  data[tableMeta["rowIndex"]],
                );
                let replyAcl = pathOr(
                  0,
                  ["ACLAccess", "reply"],
                  data[tableMeta["rowIndex"]],
                );
                let replyAllAcl = pathOr(
                  0,
                  ["ACLAccess", "replyall"],
                  data[tableMeta["rowIndex"]],
                );
                const id = data[tableMeta["rowIndex"]].id;
                const redirectModule =
                  subpanel_module === "History" ||
                  subpanel_module === "Activities"
                    ? data[tableMeta["rowIndex"]].object_image
                    : subpanel_module;
                const emailReplyData = {
                  ...data[tableMeta["rowIndex"]],
                  parent_name: recordName,
                  parent_type: module,
                  parent_id: record,
                };
                const redirectRel =
                  subpanel_module === "History" ||
                  subpanel_module === "Activities"
                    ? data[tableMeta["rowIndex"]]?.object_image?.toLowerCase()
                    : rel;
                return (
                  <div className={classes.rightBtn}>
                    {redirectModule === "Emails" ? (
                      <div>
                        {replyAcl === 1 && (
                          <Tooltip title={LBL_REPLY}>
                            <IconButton
                              // size="medium"
                              aria-label="reply"
                              onClick={() =>
                                handleOpenQuickCreateDialog(
                                  "Create",
                                  redirectModule,
                                  { ...emailReplyData, type: "reply" },
                                )
                              }
                            >
                              <ReplyIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {replyAllAcl === 1 && (
                          <Tooltip title={LBL_REPLY_ALL}>
                            <IconButton
                              // size="medium"
                              aria-label="replyAll"
                              onClick={() =>
                                handleOpenQuickCreateDialog(
                                  "Create",
                                  redirectModule,
                                  { ...emailReplyData, type: "replyAll" },
                                )
                              }
                            >
                              <ReplyAllIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {forwardAcl === 1 && (
                          <Tooltip title={LBL_FORWARD_EMAIL}>
                            <IconButton
                              // size="medium"
                              aria-label="forwardEmail"
                              onClick={() =>
                                handleOpenQuickCreateDialog(
                                  "Create",
                                  redirectModule,
                                  { ...emailReplyData, type: "forward" },
                                )
                              }
                            >
                              <RedoOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {editAcl === 1 && redirectModule != "Emails" ? (
                      <Tooltip title={LBL_EDIT_BUTTON_TITLE}>
                        <IconButton
                          // size="medium"
                          aria-label="edit"
                          onClick={() =>
                            history.push(
                              "/app/editview/" + redirectModule + "/" + id,
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    {deletAcl === 1 && redirectModule !== "Emails" ? (
                      <Tooltip title={LBL_DELETE_BUTTON_TITLE}>
                        <IconButton
                          // size="medium"
                          aria-label="delete"
                          onClick={() => {
                            // setRel()
                            // alert(rel)
                            confirmDeleteRelationship(
                              module,
                              record,
                              redirectModule.toLowerCase(),
                              id,
                              redirectRel,
                            );
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </div>
                );
              },
            },
          };
        } else if (it.name === "close_button") {
          return {
            name: "Close",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <TableCell
                  variant="head"
                  align="right"
                  className={classes.headRightBtn}
                >
                  {LBL_CLOSE_BUTTON_TITLE}
                </TableCell>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                const id = data[tableMeta["rowIndex"]].id;
                const redirectModule =
                  subpanel_module === "History" ||
                  subpanel_module === "Activities"
                    ? data[tableMeta["rowIndex"]].object_image
                    : subpanel_module;
                let editAcl = pathOr(
                  0,
                  ["ACLAccess", "edit"],
                  data[tableMeta["rowIndex"]],
                );
                // const assignedUserName = {
                //   id: recordData?.assigned_user_id,
                //   name: recordData?.assigned_user_name,
                // };

                return (redirectModule === "Calls" &&
                  data[tableMeta["rowIndex"]].status !== "Held") ||
                  (redirectModule === "Meetings" && value !== "Held") ||
                  (redirectModule === "Tasks" && value !== "Completed") ? (
                  <div className={classes.rightBtn}>
                    {editAcl === 1 ? (
                      <IconButton
                        size="small"
                        aria-label="close"
                        onClick={() =>
                          confirmCloseActivity(
                            module,
                            record,
                            redirectModule,
                            id,
                          )
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </div>
                ) : null;
              },
            },
          };
        } else if (
          it.name === "opportunities_scoring_c" ||
          it.name === "lead_scoring_c"
        ) {
          return {
            ...it,
            options: {
              filter: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                let tmp = document.createElement("SPAN");
                tmp.innerHTML = value;
                value = tmp.textContent || tmp.innerText || "";
                return <Typography>{value || ""}</Typography>;
              },
            },
          };
        } else if (it.type === "file" || it.name === "document_name") {
          return {
            ...it,
            options: {
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                const redirectModule =
                  subpanel_module === "History" ||
                  subpanel_module === "Activities"
                    ? data[tableMeta["rowIndex"]].object_image
                    : subpanel_module;
                let furl = `${site_url}/index.php?entryPoint=customDownload&id=${
                  data[tableMeta["rowIndex"]].id
                }&type=${redirectModule}`;
                let downloadAcl = pathOr(
                  0,
                  ["ACLAccess", "download"],
                  data[tableMeta["rowIndex"]],
                );
                return value ? (
                  <Typography>
                    <MuiLink
                      disabled={!downloadAcl}
                      onClick={
                        !downloadAcl
                          ? null
                          : () => {
                              saveAs(
                                furl,
                                data[tableMeta["rowIndex"]].filename,
                              );
                              toast(LBL_DOWNLOAD_INPROGRESS);
                            }
                      }
                      variant="body2"
                    >
                      {truncate(value, 20) ||
                        truncate(
                          data[tableMeta["rowIndex"]].document_name,
                          20,
                        ) ||
                        ""}
                    </MuiLink>

                    <IconButton
                      tooltipTitle={value}
                      fontSize="small"
                      onClick={() => handleShowPreviewFile(value, furl)}
                      disabled={!downloadAcl}
                      color={"secondary"}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Typography>
                ) : (
                  ""
                );
              },
            },
          };
        } else if (it.name === "status") {
          return {
            ...it,
            options: {
              filter: false,
              sort: false,
              customBodyRender: (value, tableMeta, updateValue) => {
                let emailType = pathOr(
                  "",
                  [tableMeta["rowIndex"], "email_type"],
                  data,
                );
                return emailType ? (
                  <Typography className={setEmailUnreadFlag(tableMeta)}>
                    {emailType}
                  </Typography>
                ) : value ? (
                  <Typography>{value}</Typography>
                ) : (
                  ""
                );
              },
            },
          };
        } else if (
          it.type === "date" ||
          it.type === "datetime" ||
          it.type === "datetimecombo"
        ) {
          return {
            ...it,
            options: {
              customBodyRender: (value, tableMeta, updateValue) =>
                parse(`<span>${value}</span>`),
            },
          };
        }
        return {
          ...it,
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              return value ? (
                <Typography className={setEmailUnreadFlag(tableMeta)}>
                  {value}
                </Typography>
              ) : (
                ""
              );
            },
          },
        };
      });

    const renderSubpanelButtons = (props) => {
      let p = props.buttonLayout;
      return (
        <div className={classes.optionWrapper}>
          {" "}
          {subpanel_module !== "Activities" && subpanel_module !== "History" ? (
            <div
              className={
                p === "floatcenter" ? classes.floatcenter : classes.floatCstm
              }
            >
              {listTopButtons.isCreateButtonVisible ? (
                <>
                  <Button
                    className={classes.mobileLayoutCreateBtn}
                    variant="outlined"
                    style={{ marginRight: 10 }}
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleOpenQuickCreateDialog("Create", subpanel_module)
                    }
                  >
                    <Add /> {LBL_QUICK_CREATE_BUTTON_TITLE}
                  </Button>
                </>
              ) : null}
              {listTopButtons.isSelectButtonVisible ? (
                <>
                  <FormInput
                    variant="outlined"
                    className={classes.mobileLayoutCreateBtn}
                    field={relateField}
                    initialValues={{ relatedRecords: [] }}
                    value=""
                    // setModalVisible={openRelatedTo}
                    multiSelect="true"
                    isIconBtn="true"
                    isIconBtnLabel={LBL_SELECT_BUTTON_LABEL}
                    isSelectBtn="true"
                    btnIcon={<SelectAllIcon />}
                    color="primary"
                    disabled={false}
                    onChange={(val) => {
                      handleChange("relatedRecords", val["idsArr"]);
                    }}
                  />
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      );
    };
    return (
      <>
        {data.length > 0 ? (
          <div>
            {renderSubpanelButtons({ buttonLayout: "floatCstm" })}
            <MuiThemeProvider theme={getMuiTheme(theme)}>
              <MUIDataTable
                data={data.map((it) => it)}
                columns={columns}
                options={{
                  tableId: "SubpanelListViewTable",
                  tableBodyHeight: "fit-content",
                  tableBodyMaxHeight: isStatusBarActive
                    ? "100%"
                    : !isMobile
                      ? "calc(100vh - 20rem)"
                      : "100%",
                  filter: false,
                  download: false,
                  responsive: "vertical",
                  serverSide: true,
                  count: relateFieldMeta["total-records"]
                    ? relateFieldMeta["total-records"]
                    : -1,
                  rowsPerPage: subpanelListViewRowPerPage,
                  page: listViewMeta.page,
                  rowsPerPageOptions: false,
                  selectableRows: false,
                  selectableRowsHeader: false,
                  fixedHeader: true,
                  // fixedSelectColumn: true,
                  search: false,
                  print: false,
                  viewColumns: false,
                  expandableRows:
                    window.innerWidth < 995.95 ||
                    subpanel_module === "History" ||
                    subpanel_module === "Activities"
                      ? true
                      : false,
                  expandableRowsHeader: false,
                  // expandableRowsOnClick: true,
                  // isRowExpandable: (dataIndex, expandedRows) => {
                  //   if (dataIndex === 3 || dataIndex === 4) return false;

                  //   // Prevent expand/collapse of any row if there are 4 rows expanded already (but allow those already expanded to be collapsed)
                  //   if (expandedRows.data.length > 4 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
                  //   return true;
                  // },
                  rowsExpanded: detailExpanded,
                  renderExpandableRow: (rowData, rowMeta) => {
                    if (window.innerWidth > 995.95) {
                      if (
                        subpanel_module === "History" ||
                        subpanel_module === "Activities"
                      ) {
                        const colSpan = rowData.length + 1;
                        let module = pathOr(
                          "",
                          [rowMeta.dataIndex, "object_image"],
                          data,
                        );
                        let id = pathOr("", [rowMeta.dataIndex, "id"], data);
                        let description =
                          module === "Emails"
                            ? pathOr(
                                "",
                                [rowMeta.dataIndex, "description_html"],
                                data,
                              )
                            : pathOr(
                                "",
                                [rowMeta.dataIndex, "description"],
                                data,
                              );
                        // if(description && description != null && typeof description == "string")
                        // {
                        //   let tmp = document.createElement("div");
                        //   tmp.textContent = parse(description);
                        //   description = (module==='Emails')?parse(description):tmp.textContent || tmp.innerText || "";
                        // }

                        return (
                          <TableRow className={classes.nestedTableRow}>
                            <TableCell colSpan={colSpan}>
                              {/* {(relateFieldDetailData && relateFieldDetailData[rowMeta.rowIndex] && relateFieldDetailData[rowMeta.rowIndex].length)?<ControlledAccordions
                              data={relateFieldDetailData[rowMeta.rowIndex]}
                              module={module}
                              view="detailview"
                              headerBackground="true"
                              recordId={id}
                              hiddenAll={{hidden:[],disabled:[]}}     
                            />:"Loading..."} */}

                              <Card>
                                <CardContent
                                  style={{
                                    maxHeight: description ? "60vh" : "10vh",
                                    overflowY: "auto",
                                  }}
                                >
                                  <Typography
                                    className={
                                      module === "Emails" ? "" : classes.text
                                    }
                                    variant="subtitle1"
                                  >
                                    {parse(description) || ""}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    }
                  },
                  onRowExpansionChange: async (
                    curExpanded,
                    allExpanded,
                    rowsExpanded,
                  ) => {
                    //  let dataIndex = pathOr(0,[0,"dataIndex"],curExpanded);
                    //  let module = pathOr("",[dataIndex,"object_image"],data);
                    //  let id = pathOr("",[dataIndex,"id"],data);
                    //  //let allExpandedarr = allExpanded.map(i=>i.dataIndex);
                    //  //setDetailExpanded([...detailExpanded,allExpandedarr]);
                    //  /*
                    //  if(!relateFieldDetailData[dataIndex])
                    //  {
                    //   await getSubpanelRecordDetailView(module,id).then((res)=>{
                    //     let newArr = {...relateFieldDetailData,[parseInt(dataIndex)]:pathOr([], ["data", "templateMeta", "data"], res.data)};
                    //     let keysArr = Object.keys(newArr)
                    //     keysArr = keysArr.map(i=>Number(i));
                    //     if(allExpanded && allExpanded.length){
                    //     keysArr = allExpanded.map(i=>i.index)
                    //     }
                    //     setDetailExpanded(keysArr);
                    //     setRelateFieldDetailData(newArr);
                    //   });
                    // }*/

                    if (window.innerWidth < 995.95) {
                      var nodetr = document.getElementById(
                        "MUIDataTableBodyRow-" + curExpanded[0].index,
                      );
                      if (!nodetr) {
                        nodetr = document.getElementById(
                          "MUIDataTableBodyRow-SubpanelListViewTable-" +
                            curExpanded[0].index,
                        );
                      }
                      var svgElement = nodetr.querySelector("svg");
                      var nodetd = nodetr.children;
                      for (var i = 1; i < nodetd.length; i++) {
                        if (
                          nodetd[i].style.display === "" ||
                          nodetd[i].style.display === "none"
                        ) {
                          nodetd[i].style.display = "block";
                          svgElement.classList.add(
                            "MUIDataTableSelectCell-expanded",
                          );
                        } else if (nodetd[i].style.display === "block") {
                          nodetd[i].style.display = "none";
                          let cls = "MUIDataTableSelectCell-expanded";
                          svgElement.classList.remove.apply(
                            svgElement.classList,
                            Array.from(svgElement.classList).filter((v) =>
                              v.startsWith(cls),
                            ),
                          );
                        }
                      }
                    }
                  },
                  // selectableRows: meta["total-records"] ? true : false,
                  pagination:
                    relateFieldMeta["total-records"] > 0 ? true : false,
                  sortOrder: SortByNEWObj,
                  onTableChange: (action, tableState) => {
                    switch (action) {
                      case "changePage":
                        if (tableState.sortOrder.hasOwnProperty("name")) {
                          //let directionToSort =tableState.sortOrder.direction === "desc"? `DESC`: "ASC";
                          setSortByNEWObj((prevstate) => ({
                            ...prevstate,
                            page: tableState.page,
                          }));
                          // changePageOrSort(tableState.page,SortByNEWObj);
                          break;
                        }
                        setSortByNEWObj((prevstate) => ({
                          ...prevstate,
                          page: tableState.page,
                        }));
                        // changePageOrSort(tableState.page,SortByNEWObj);
                        break;

                      case "sort":
                        if (
                          SortByNEWObj.order === "desc" ||
                          SortByNEWObj.order === ""
                        ) {
                          setSortByNEWObj((prevstate) => ({
                            ...prevstate,
                            order: "asc",
                            direction: "asc",
                            page: 0,
                            name: tableState.sortOrder.name,
                          }));
                        } else {
                          setSortByNEWObj((prevstate) => ({
                            ...prevstate,
                            order: "desc",
                            direction: "desc",
                            page: 0,
                            name: tableState.sortOrder.name,
                          }));
                        }

                        break;
                      default:
                        // if((tableState.curExpandedRows && !subpanel_module === 'History') || (tableState.curExpandedRows && !subpanel_module === 'Activities')) {

                        if (
                          tableState.curExpandedRows &&
                          window.innerWidth < 995.95
                        ) {
                          var nodetr = document.getElementById(
                            "MUIDataTableBodyRow-" +
                              tableState.curExpandedRows[0].index,
                          );
                          if (!nodetr) {
                            nodetr = document.getElementById(
                              "MUIDataTableBodyRow-SubpanelListViewTable-" +
                                tableState.curExpandedRows[0].index,
                            );
                          }
                          var svgElement = nodetr.querySelector("svg");
                          svgElement.classList.add(
                            "MUIDataTableSelectCell-expanded",
                          );
                        }
                    }
                    // }
                  },
                  customFooter: relateFieldMeta["total-records"]
                    ? null
                    : (
                        count,
                        page,
                        rowsPerPage,
                        changeRowsPerPage,
                        changePage,
                        textLabels,
                      ) => {
                        return (
                          <CustomFooter
                            count={count}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            changeRowsPerPage={changeRowsPerPage}
                            changePage={changePage}
                            textLabels={textLabels}
                            relateFieldMeta={relateFieldMeta}
                            totalRecords={
                              relateFieldMeta["total-records"]
                                ? relateFieldMeta["total-records"]
                                : 0
                            }
                          />
                        );
                      },
                }}
              />
            </MuiThemeProvider>
          </div>
        ) : (
          <div>
            {!loading ? (
              <NoRecord
                view="subpanel"
                subpanel_module={subpanel_module}
                module={module}
              />
            ) : (
              ""
            )}
            {renderSubpanelButtons({ buttonLayout: "floatcenter" })}
          </div>
        )}
      </>
    );
  };

  const renderBody = () => {
    return (
      <Paper square className={classes.paper}>
        {loading ? renderLoader() : renderListView()}
      </Paper>
    );
  };
  const handleCloseDialog = useCallback(() => {
    setOpenQuickCreateDialog(false);
  }, []);

  const handleOnRecordSuccess = useCallback(() => {
    setOpenQuickCreateDialog(false);
    fetchSupanelListViewData();
  }, []);

  return (
    <div>
      <EmailDetailPopup
        openEmailDetailView={openEmailDetailView}
        toggleEmailDetailView={toggleEmailDetailView}
      />
      {renderBody()}
      <Alert
        title={activityRecord.title}
        msg={activityRecord.msg}
        open={alertVisible}
        agreeText={"Yes"}
        disagreeText={"No"}
        handleClose={() => setAlertVisibility(!alertVisible)}
        onAgree={
          activityRecord.function === "closeActivity"
            ? closeActivityMethod
            : deleteRelationshipRecord
        }
      />
      {openQuickCreateDialog ? (
        <>
          <QuickCreate
            moduleName={subpanel_module}
            open={openQuickCreateDialog}
            onCancelClick={handleCloseDialog}
            fieldConfiguratorData={fieldConfiguratorData}
            onRecordSuccess={handleOnRecordSuccess}
            parentData={{
              parent_id: record,
              parent_type: module,
              parent_name: null,
            }}
            relationshipData={{
              type: module,
              id: record,
              relationshipName: relationShipName,
              relationshipModule: relationShipModule,
            }}
          />
        </>
      ) : null}
      {openEmailCompose ? (
        <ComposeEmail
          open={openEmailCompose}
          handleClose={() => setOpenEmailCompose(false)}
        />
      ) : null}

      {previewFile.open ? (
        <FileViewerComp
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SubPanelListView;

export const EmailDetailPopup = ({
  openEmailDetailView,
  toggleEmailDetailView,
}) => {
  const classes = useStyles();
  const contentRef = React.useRef(null);
  const { detailLoading, detailData } = useEmailState((state) => ({
    detailLoading: state.detailLoading,
    detailData: state.detailData,
  }));
  const [printLoading, setPrintLoading] = useState(false);
  const handleOnBeforeGetContent = () => {
    setPrintLoading(true);
  };
  const handleAfterPrint = () => {
    setPrintLoading(false);
  };
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: detailData?.name ?? "",
    onBeforeGetContent: handleOnBeforeGetContent,
    onAfterPrint: handleAfterPrint,
  });
  return (
    <>
      <CustomDialog
        isDialogOpen={openEmailDetailView}
        handleCloseDialog={toggleEmailDetailView}
        isLoading={detailLoading}
        bodyContent={
          <>
            <EmailDetailToolbar
              printLoading={printLoading}
              handlePrint={handlePrint}
              showCompactMenu={true}
            />
            <div ref={contentRef} className={classes.scroll}>
              <EmailDetailHeader />
              <EmailBody />
            </div>
          </>
        }
        style={{ paddingBottom: "10px" }}
        title={"Email"}
      />
    </>
  );
};
