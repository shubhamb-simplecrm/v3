import React, { useCallback, useEffect, useState } from "react";
import {
  Tooltip,
  Typography,
  Grid,
  Box,
  useTheme,
  Button,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr, clone } from "ramda";
import MUIDataTable from "mui-datatables";

import {
  getInboundOutboundEmails,
  getEditInboundOutboundEmail,
  deleteInboundOutboundEmail,
} from "../../../../../store/actions/module.actions";
import { toast } from "react-toastify";
import { Skeleton, Alert as ConfirmBox } from "../../../../../components";
import SkeletonShell from "../../../../../components/Skeleton/index";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { TableCell, IconButton } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import {
  LBL_CONFIRM_DELETE_RECORD_DESCRIPTION,
  LBL_CONFIRM_DELETE_TITLE,
  LBL_CONFIRM_NO,
  LBL_CONFIRM_YES,
  LBL_INBOUND_EMAIL_SETTING_TITLE,
  LBL_NO_RESULTS_FOUND,
  LBL_OUTBOUND_EMAIL_SETTING_TITLE,
  LBL_TABLE_DISPLAY_ROWS_TITLE,
  LBL_TABLE_PAGE_NEXT_TITLE,
  LBL_TABLE_PAGE_PREVIOUS_TITLE,
  LBL_TABLE_PER_PAGE_TITLE,
  LBL_TABLE_SORT_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../../../constant";

export default function List(props) {
  const classes = useStyles();
  const currentTheme = useTheme();
  // const [editValues, setEditValues]=useState({email_user:''});
  // const [openImapConfig, setOpenImapConfig] = useState(false);
  const [inboundList, setInboundList] = useState([]);
  const [outboundList, setOutboundList] = useState([]);
  const[signatureList,setsignatureList]=useState([])
  const[defaultSignature,setDefaultSignature]=useState(null)
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [recordId, setRecordId] = useState(null);

  //const dispatch = useDispatch();

  const getListViewData = useCallback(async () => {
    try {
      const res = await getInboundOutboundEmails();
      setLoading(true);
      if (res.ok) {
        setInboundList(pathOr([], ["data", "inbound_account_list"], res.data));
        setOutboundList(
          pathOr([], ["data", "outbound_account_list"], res.data),
        );
        setsignatureList(
          pathOr([], ["data", "signature_list"], res.data),
        )
        setDefaultSignature(
          pathOr("", ["data", "default_signature_id"], res.data),
        )
        props.setOutboundList(
          pathOr([], ["data", "outbound_account_list"], res.data),
        );
      }
      setLoading(false);
    } catch (ex) {
      toast(SOMETHING_WENT_WRONG);
    }
  }, []);
  

  useEffect(() => {
    getListViewData();
  }, [getListViewData]);
  
//   let signatureList=[  
//     {errors: "",
//     id: "81564d02-edf0-8433-5fe6-60ddc97bef6b",
//     signature: "Thanks & Regards\nNilesh",
//     name: "Email Test",
//     type: "user", },
//     {errors: "",
//     id: "81564d02-edf0-8433-5fe6-60ddc97bef6b",
//     signature: "Thanks & Regards\nNilesh",
//     name: "Email Test1",
//     type: "user", }
// ]
  const [columnsInbound, setColumnsInbound] = useState([
    {
      label: "Mail Account Name",
      name: "name",
      type: "varchar",
    },
    {
      label: "Mail Server Address",
      name: "server_url",
      type: "varchar",
    },
    {
      label: "Active",
      name: "is_active",
      type: "name",
    },
    {
      label: "Default",
      name: "is_default",
      type: "varchar",
    },
    {
      label: "Type",
      name: "type",
      type: "varchar",
    },
    {
      label: "Action",
      name: "action",
      type: "varchar",
    },
  ]);
  const [columnsOutbound, setColumnsOutbound] = useState([
    {
      label: "Mail Account Name",
      name: "name",
      type: "varchar",
    },
    {
      label: "Mail Server Address",
      name: "mail_smtpserver",
      type: "varchar",
    },
    {
      label: "Type",
      name: "type",
      type: "varchar",
    },

    {
      label: "Action",
      name: "action",
      type: "varchar",
    },
  ]);
  const [signature1, setSignature1] = useState([
    {
      label: "name",
      name: "name",
      type: "varchar",
    },
    {
      label: "Signature",
      name: "signature",
      type: "varchar",
    },
    {
      label: "Default",
      name: "is_default",
      type: "varchar",
    },
    {
      label: "Action",
      name: "action",
      type: "varchar",
    },
  ]);

  let columnsInb = columnsInbound.map((it) => {
    if (it.name === "action") {
      return {
        name: "Actions",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Action
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            const rowData = inboundList[tableMeta["rowIndex"]].id;
            return !inboundList[tableMeta["rowIndex"]].is_group ? (
              <div className={classes.rightBtn}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    aria-label="edit"
                    onClick={() => handleEditBtn("inbound", rowData)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => confirmDeletion("inbound", rowData)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ) : null;
          },
        },
      };
    } else if (it.name === "type") {
      return {
        name: "Type",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Type
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className={classes.rightBtn}>
                {inboundList[tableMeta["rowIndex"]].is_group
                  ? "Group"
                  : "Personal"}
              </div>
            );
          },
        },
      };
    } else if (it.name === "is_active") {
      return {
        name: "Active",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Active
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            let isActive = inboundList[tableMeta["rowIndex"]].is_active;
            return (
              <div className={classes.rightBtn}>
                {isActive ? (
                  <Checkbox
                    disabled
                    checked
                    inputProps={{ "aria-label": "disabled checked checkbox" }}
                  />
                ) : (
                  <Checkbox
                    disabled
                    inputProps={{ "aria-label": "disabled checkbox" }}
                  />
                )}
              </div>
            );
          },
        },
      };
    } else if (it.name === "is_default") {
      return {
        name: "Default",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Default
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            let isDefault = inboundList[tableMeta["rowIndex"]].is_default;
            return (
              <div className={classes.rightBtn}>
                {isDefault ? (
                  <Checkbox
                    disabled
                    checked
                    inputProps={{ "aria-label": "disabled checked checkbox" }}
                  />
                ) : (
                  <Checkbox
                    disabled
                    inputProps={{ "aria-label": "disabled checkbox" }}
                  />
                )}
              </div>
            );
          },
        },
      };
    }
    return it;
  });
  let columnsOut = columnsOutbound.map((it) => {
    if (it.name === "action") {
      return {
        name: "Actions",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Action
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            const rowData = outboundList[tableMeta["rowIndex"]].id;
            return outboundList[tableMeta["rowIndex"]]["type"] !== "system" ? (
              <div className={classes.rightBtn}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    aria-label="edit"
                    onClick={() => handleEditBtn("outbound", rowData)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => confirmDeletion("outbound", rowData)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ) : null;
          },
        },
      };
    }
    return it;
  });
  let sign = signature1.map((it) => {
    if (it.name === "action") {
      return {
        name: "Actions",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Action
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            const rowData = signatureList[tableMeta["rowIndex"]];
            let isActive = rowData==defaultSignature;
            rowData['default']=defaultSignature==rowData.id?true:false;
            return !signatureList[tableMeta["rowIndex"]].is_group ? (
              <div className={classes.rightBtn}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    aria-label="edit"
                    // id={rowDataid}
                    onClick={() => handleEditBtn("signature", rowData)}
                   >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={() => confirmDeletion("signature", rowData.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ) : null;
          },
        },
      };
    } else if (it.name === "type") {
      return {
        name: "Type",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Type
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className={classes.rightBtn}>
                {signatureList[tableMeta["rowIndex"]].is_group
                  ? "Group"
                  : "Personal"}
              </div>
            );
          },
        },
      };
    } else if (it.name === "is_active") {
      return {
        name: "Active",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Active
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            let isActive = signatureList[tableMeta["rowIndex"]].is_active;
            return (
              <div className={classes.rightBtn}>
                {isActive ? (
                  <Checkbox
                    disabled
                    checked
                    inputProps={{ "aria-label": "disabled checked checkbox" }}
                  />
                ) : (
                  <Checkbox
                    disabled
                    inputProps={{ "aria-label": "disabled checkbox" }}
                  />
                )}
              </div>
            );
          },
        },
      };
    } else if (it.name === "is_default") {
      return {
        name: "Default",
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <TableCell
              variant="head"
              align="right"
              className={classes.headRightBtn}
            >
              Default
            </TableCell>
          ),
          customBodyRender: (value, tableMeta, updateValue) => {
            // let isDefault = signatureList[tableMeta["rowIndex"]].is_default;
            const rowData = signatureList[tableMeta["rowIndex"]].id
            let isDefault = rowData==defaultSignature;
            
            return (
              <div className={classes.rightBtn}>
                {isDefault ? (
                  <Checkbox
                    disabled
                    checked
                    inputProps={{ "aria-label": "disabled checked checkbox" }}
                  />
                ) : (
                  <Checkbox
                    disabled
                    inputProps={{ "aria-label": "disabled checkbox" }}
                  />
                )}
              </div>
            );
          },
        },
      };
    }
    
    return it;
  });
  const handleAddBtn = (type) => {
    props.setFields({});
    props.setErrors({});
    let title = "";
    if (type === "inbound") title = "Add New Inboud Email Account";
    if (type === "outbound") title = "Add New Outboud Email Account";
    if (type === "signature") title = "Add New Signature";
    props.setModal({ type: type, title: title });
  };

  const handleEditBtn = async (type, row) => {
    props.setFields({});
    props.setErrors({});
    props.setIsEditingView(true);
    let title = "";
    if (type === "inbound") title = "Edit Inboud Email Account";
    if (type === "outbound") title = "Edit Outboud Email Account";
    if (type === "signature"){
      
      title = "Add New Signature";
      props.setModal({ type: type, title: title, rowData:row });
      return;
    } 
    
    try {
      const res = await getEditInboundOutboundEmail(type, row);
      setLoading(true);
      if (res.ok) {
        let rowData = res.data.data;
        // console.log(rowData)
        props.setModal({ type: type, title: title, rowData});
      }
      setLoading(false);
    } catch (ex) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const confirmDeletion = (type, id) => {
    setAlertVisibility(true);
    setRecordId({ type: type, id: id });
  };
  const handleDeleteBtn = async () => {
    setAlertVisibility(!alertVisible);
    try {
      const res = await deleteInboundOutboundEmail(recordId.type, recordId.id);
      if (res && res.ok) {
        getListViewData();
        let data =
          recordId.type === "signature"
            ? clone(inboundList)             
            : clone(outboundList);
        // setInboundList(data.filter((el) => el.id !== recordId.id));
        toast("Email account deleted.");
      } else {
        toast(SOMETHING_WENT_WRONG);
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "500px" }}>
        <Skeleton />
      </div>
    );
  }
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <Box>
        <MUIDataTable
          title={
            <Typography variant="h6" style={{ fontSize: "1.25rem" }}>
              {LBL_INBOUND_EMAIL_SETTING_TITLE}
            </Typography>
          }
          //data={data.map((it) => it.attributes)}
          data={inboundList}
          columns={columnsInb}
          options={{
            filter: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: false,
            page: false,
            search: false,
            rowsPerPage: false,
            fixedHeader: true,
            serverSide: true,
            rowsPerPageOptions: false,
            textLabels: {
              body: {
                noMatch: loading ? (
                  <SkeletonShell layout="listView" display />
                ) : (
                  <div style={{ padding: "10px 5px 10px 5px" }}>
                    <Alert variant="outlined" severity="warning">
                      {LBL_NO_RESULTS_FOUND}
                    </Alert>
                  </div>
                ),
                toolTip: LBL_TABLE_SORT_TITLE,
              },
              pagination: {
                next: LBL_TABLE_PAGE_NEXT_TITLE,
                previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
                rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
                displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
              },
            },
            customFooter: (
              count,
              page,
              rowsPerPage,
              changeRowsPerPage,
              changePage,
            ) => {
              return (
                <Button
                  size="small"
                  className={classes.addBtn}
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddBtn("inbound")}
                >
                  Add New
                </Button>
              );
            },
          }}
        />
      </Box>
      <Box>
        <MUIDataTable
          title={
            <Typography variant="h6" style={{ fontSize: "1.25rem" }}>
              {LBL_OUTBOUND_EMAIL_SETTING_TITLE}
            </Typography>
          }
          //data={data.map((it) => it.attributes)}
          data={outboundList}
          columns={columnsOut}
          options={{
            filter: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: false,
            page: false,
            search: false,
            rowsPerPage: false,
            fixedHeader: true,
            serverSide: true,
            rowsPerPageOptions: false,
            textLabels: {
              body: {
                noMatch: loading ? (
                  <SkeletonShell layout="listView" display />
                ) : (
                  <div style={{ padding: "10px 5px 10px 5px" }}>
                    <Alert variant="outlined" severity="warning">
                      {LBL_NO_RESULTS_FOUND}
                    </Alert>
                  </div>
                ),
                toolTip: LBL_TABLE_SORT_TITLE,
              },
              pagination: {
                next: LBL_TABLE_PAGE_NEXT_TITLE,
                previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
                rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
                displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
              },
            },
            customFooter: (
              count,
              page,
              rowsPerPage,
              changeRowsPerPage,
              changePage,
            ) => {
              return (
                <Button
                  size="small"
                  className={classes.addBtn}
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddBtn("outbound")}
                >
                  Add New
                </Button>
              );
            },
          }}
        />
      </Box>
      <Box>
        <MUIDataTable
          title={
            <Typography variant="h6" style={{ fontSize: "1.25rem" }}>
              SIGNATURE LIST
            </Typography>
          }
          //data={data.map((it) => it.attributes)}
          data={signatureList}
          columns={sign}
          options={{
            filter: false,
            sort: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: false,
            page: false,
            search: false,
            rowsPerPage: false,
            fixedHeader: true,
            serverSide: true,
            rowsPerPageOptions: false,
            textLabels: {
              body: {
                noMatch: loading ? (
                  <SkeletonShell layout="listView" display />
                ) : (
                  <div style={{ padding: "10px 5px 10px 5px" }}>
                    <Alert variant="outlined" severity="warning">
                      {LBL_NO_RESULTS_FOUND}
                    </Alert>
                  </div>
                ),
                toolTip: LBL_TABLE_SORT_TITLE,
              },
              pagination: {
                next: LBL_TABLE_PAGE_NEXT_TITLE,
                previous: LBL_TABLE_PAGE_PREVIOUS_TITLE,
                rowsPerPage: LBL_TABLE_PER_PAGE_TITLE,
                displayRows: LBL_TABLE_DISPLAY_ROWS_TITLE,
              },
            },
            customFooter: (
              count,
              page,
              rowsPerPage,
              changeRowsPerPage,
              changePage,
            ) => {
              return (
                <Button
                  size="small"
                  className={classes.addBtn}
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddBtn("signature")}
                >
                  Add New
                </Button>
              );
            },
          }}
        />
      </Box>
      <ConfirmBox
        title={LBL_CONFIRM_DELETE_TITLE}
        msg={LBL_CONFIRM_DELETE_RECORD_DESCRIPTION}
        open={alertVisible}
        agreeText={LBL_CONFIRM_YES}
        disagreeText={LBL_CONFIRM_NO}
        handleClose={() => setAlertVisibility(!alertVisible)}
        onAgree={handleDeleteBtn}
      />
    </MuiThemeProvider>
  );
}
