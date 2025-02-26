import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {
  CircularProgress,
  Checkbox,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Tooltip,
  Grid,
  IconButton,
} from "@material-ui/core";
import FormInput from "../../../../../FormInput";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import useStyles from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { useSelector } from "react-redux";
import { getMergeData } from "../../../../../../store/actions/module.actions";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
} from "../../../../../../constant";
import { clone, pathOr } from "ramda";
import {
  EmailString,
  ParentString,
  RelateString,
} from "../../../../../FormComponents";
import { createOrEditRecordAction } from "../../../../../../store/actions/edit.actions";
import { toast } from "react-toastify";
import { Skeleton } from "../../../../..";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";

const MergeViewDialog = ({
  selectedRecords,
  currentModule,
  selectedRecordLength,
  dialogStatus,
  onClose,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [loader, setLoader] = useState(false);
  const [primaryRecord, setPrimaryRecord] = useState([]);
  const { selectedModule } = useSelector((state) => state.modules);
  //Configuring max no of records from config API
  const { config } = useSelector((state) => state.config);
  const maxRecords = config.max_merge_records;
  //Added variable notations to the texts
  const LBL_MERGE = "Merge View";
  const LBL_NOTE = "Note: Secondary record will be deleted";
  const LBL_PRIMARY = "Primary Record";
  const LBL_SECONDARY = "Secondary Record";
  const LBL_SELECT_ALL = "Select All";
  const LBL_RESTORE_ALL = "Restore All";

  //API call method change, Removed unnecessary code.

  let tableCounter = [],
    defaultObject = {};
  //Initialising first record as primary
  const primary_id = selectedRecords[0];
  const module_name = currentModule;

  //Secondary Record array added as per API changes
  const secondary_id = selectedRecords.filter((_, index) => index !== 0);

  //selected number of records should always be less than configured max records.
  if (selectedRecordLength > 1 && selectedRecordLength <= maxRecords) {
    for (let i = 0; i < selectedRecords.length; i++) {
      tableCounter[i] = i;
      // Added for dynamic secondary records
      if (i > 0) secondary_id.push(selectedRecords[i]);
    }
  }
  // Removed old methods.
  const getData = async () => {
    let tempData = [];
    const data = { module_name, primary_id, secondary_id };
    try {
      //Loader added for API data fetch
      setLoading(true);
      const res = await getMergeData(data);
      if (res.status === 200) {
        let resData = pathOr(
          [],
          ["data", "data", "templateMeta", "attributes"],
          res,
        );
        setDataArray(resData);
        // Added optimised loop for data handling
        for (const row of resData) {
          const {
            field_key: keys,
            value: [value],
          } = row;
          tempData[keys] = value;
        }
        setPrimaryRecord(tempData);
        setLoading(false);
      } else {
        //Exceptional handling for 400.
        if (res.status === 400) {
          toast(`Error 400: ${res.data.errors.detail}`);
          setLoading(false);
          history.push("/");
        } else {
          toast(`Error ${res.status} : ${res.data.errors.detail}`);
          setLoading(false);
          history.push("/");
        }
      }
    } catch (e) {
      //Added for Error handling
      console.log(e);
      toast("An error has occured");
      setLoading(false);
      history.push("/");
    }
  };

  const parseFieldValue = (field, value) => {
    //Added for options containing key value pairs of which the values has to be shown in the MergeView
    const options = field.options;
    if (options && options.hasOwnProperty(value))
      return (value = options[value]);

    switch (field.type) {
      case "":
        return value === "" && field.type !== "bool" ? "" : " " + value;
      // Removed Seperate logic for loan type as options are already handeling it.
      case "parent":
        return <ParentString field={field} value={value} />;
      case "relate":
        return <RelateString field={field} value={value?.value} />;
      case "email":
        return (
          <EmailString
            field={field}
            parent_name={pathOr("", ["value", 0], field)}
            parent_id={pathOr("", ["value", 0], field)}
            parent_type={module_name}
          />
        );
      case "bool":
        return (
          <Checkbox
            disabled
            id={field?.name}
            checked={field.value === 1}
            style={{ padding: 0 }}
          />
        );
      case "address":
        return value[0];
      default:
        return " " + value;
    }
  };
  useEffect(() => {
    //getForm();
    getData();
    refreshObject();
  }, []);

  useEffect(() => {
    getValues();
  }, [primaryRecord]);

  const refreshObject = () => {
    if (primaryRecord) defaultObject = clone(primaryRecord);
  };

  const renderForm = () => {
    return (
      <div className={classes.root}>
        <TableContainer>
          <Table className={classes.tableFixed}>
            <TableHead>
              <TableRow>
                <TableCell align="left" className={classes.sticky}>
                  <Tooltip title="Select all records">
                    <Button
                      size="small"
                      color="primary"
                      //endIcon={<SyncAltIcon fontSize="small"/>}
                      className={classes.selectAllbtn}
                      variant="contained"
                      onClick={() => restoreToDefault()}
                    >
                      {LBL_RESTORE_ALL}
                    </Button>
                  </Tooltip>
                </TableCell>
                <TableCell align="left" className={classes.sticky}>
                  {" "}
                  {LBL_PRIMARY}{" "}
                </TableCell>
                {selectedRecords.slice(1).map((column , index) => (
                  <TableCell className={classes.padL}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {`${LBL_SECONDARY} ${index+1}`}
                      <Tooltip title="Select all records">
                        <Button
                          key={column}
                          size="small"
                          color="primary"
                          //endIcon={<SyncAltIcon fontSize="small"/>}
                          className={classes.selectAllbtn}
                          variant="contained"
                          onClick={() => selectWholeColumnData(column)}
                        >
                          {" "}
                          {LBL_SELECT_ALL}
                        </Button>
                      </Tooltip>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataArray.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>
                    {row.label}
                    <Tooltip title="Restore Old values">
                      <IconButton
                        key={row.name}
                        size="small"
                        color="primary"
                        style={{marginLeft:"4px"}}
                        // endIcon={}
                        className={classes.restoreBtn}
                        onClick={() => restoreValue(row.value, row.field_key)}
                      ><SettingsBackupRestoreIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <FormInput
                      className={classes.FormControl}
                      key={row?.field_key}
                      field={{
                        ...row,
                        // Type handeling for each field in input form component. Removed unnecessary field type conversions.
                        name: row?.name === "email1" ? "email" : row?.name,
                        type:
                          row?.type === "dynamicenum"
                            ? "enum"
                            : row?.type === "datetime" || row?.type === "date"
                              ? "date"
                              : row?.type === "currency"
                                ? "varchar"
                                : row?.type,
                        value: pathOr("", [row?.name], primaryRecord),
                      }}
                      value={pathOr(
                        pathOr("", ["value", 0], row),
                        [row?.name],
                        primaryRecord,
                      )}
                      onChange={(val) => ArrowFunction(val, row?.field_key)}
                      initialValues={primaryRecord}
                      quickCreate={true}
                      small={true}
                    />
                  </TableCell>
                  {row?.value?.slice(1).map((item) => (
                    <TableCell>
                      <Box className={classes.box}>
                        <IconButton
                          key={item}
                          size="small"
                          color="primary"
                          style= {{marginRight:"4px"}}
                          // endIcon={}
                          className={classes.floatL}
                          onClick={() => ArrowFunction(item, row.field_key)}
                        ><ArrowBackIcon fontSize="sm" /></IconButton>
                        {/* Added options value for handeling values with options in UI */}
                        {parseFieldValue(
                          {
                            type: row.type,
                            value: item,
                            options: row.options,
                          },
                          item,
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const ArrowFunction = (value, key) => {
    const primaryRecordTemp = clone(primaryRecord);
    //Added condition for empty value in date field
    primaryRecordTemp[key] = value || " ";
    setPrimaryRecord(primaryRecordTemp);
    // Unnecessary Code removed
  };
  const restoreValue = (value, key) => {
    refreshObject();
    //Added condition for empty value in date
    const primaryRecordTemp = clone(defaultObject);
    primaryRecordTemp[key] = value[0] || " ";
    setPrimaryRecord(primaryRecordTemp);
  };

  const restoreToDefault = () => {
    let tempObj = {};
    dataArray.forEach((row) => {
      tempObj[row.name] = row.value[0] || " ";
    });
    setPrimaryRecord(tempObj);
  };

  const getValues = () => {
    setPrimaryRecord(primaryRecord);
  };

  const selectWholeColumnData = (column) => {
    let tempObj = {};
    dataArray.forEach((row) => {
      //Added condition for empty value in date
      tempObj[row.name] = row.value[column] || " ";
    });
    setPrimaryRecord(tempObj);
  };

  var submitData = {
    data: {
      type: module_name,
      id: primary_id,
      //Changes as per new patch request for deletion of secondary ids.
      merge_ids: secondary_id,
      attributes: Object.assign({}, primaryRecord),
    },
  };
  const submitForm = async (submitData) => {
    try {
      setLoader(true);
      //Changes required for save request as per API changes
      await dispatch(
        createOrEditRecordAction(
          submitData,
          LAYOUT_VIEW_TYPE?.editView,
          primary_id,
        ),
      ).then(function (res) {
        if (res.errors) {
          //Error handling on save request
          if (res.status === 400) {
            console.log(res.errors);
            history.push(`app/${module_name}`);
            toast("Error 400 has occured");
            setLoader(false);
          } else {
            console.log(res.errors);
            history.push(`app/${module_name}`);
            toast("An Unknown error has occured");
            setLoader(false);
          }
        } else {
          console.log(res);
          history.push("/app/detailview/" + module_name + "/" + res.data.id);
          toast("Record Updated");
          setLoader(false);
        }
      });
    } catch (e) {
      setLoader(false);
      console.log(e);
    }
  };

  return (
    <Dialog
      fullScreen
      fullWidth={true}
      maxWidth={"lg"}
      open={dialogStatus}
      onClose={onClose}
      aria-labelledby="max-width-dialog-title"
      className={classes.dialog_newabc}
    >
      <DialogTitle
        id="max-width-dialog-title"
        align="center"
        className={classes.titleMerge}
      >
        {LBL_MERGE}
        <Grid item xs={12} className={classes.sideNote}>
          {LBL_NOTE}
        </Grid>
      </DialogTitle>
      {/* Added loader for UI enhancement */}
      <DialogContent>
        {loading ? <Skeleton></Skeleton> : renderForm()}
      </DialogContent>

      <DialogActions>
        {!loader && (
          <Button
            variant="contained"
            onClick={onClose}
            color="primary"
            size="medium"
            fullWidth
            disabled={loader}
            disableElevation
            className={classes.cancelBtn}
          >
            {LBL_CANCEL_BUTTON_TITLE}
          </Button>
        )}
        {loader ? (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            disabled={true}
            disableElevation
            className={classes.saveBtn}
          >
            {LBL_SAVE_INPROGRESS}{" "}
            <CircularProgress
              size={25}
              style={{ marginLeft: 10, color: "White" }}
            />{" "}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => submitForm(submitData)}
            color="primary"
            size="medium"
            fullWidth
            //disabled={updateLoader}
            disableElevation
            className={classes.saveBtn}
          >
            {LBL_SAVE_BUTTON_TITLE}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MergeViewDialog;