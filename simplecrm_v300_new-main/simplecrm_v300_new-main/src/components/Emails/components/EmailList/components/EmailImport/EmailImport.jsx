import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
// styles
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useStyles from "./styles";
import {
  getEmailImportView,
  submitImportView,
} from "../../../../../../store/actions/emails.actions";
import { toast } from "react-toastify";
import {
  Grid,
  useTheme,
  Paper,
  Button,
  Dialog,
  CircularProgress,
} from "@material-ui/core";
import { TabPanel, ControlledAccordions } from "../../../../..";
import { pathOr, clone } from "ramda";
import { Scrollbars } from "react-custom-scrollbars";
import { Skeleton } from "../../../../../../components";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
  SOMETHING_WENT_WRONG,
} from "../../../../../../constant";

const EmailImport = (props) => {
  const {
    openEmailImportDialog,
    setOpenEmailImportDialog,
    emailinbound,
    selectedEmails,
    emailRecords,
    setEmailRecords,
    module,
    ...rest
  } = props;
  let view = "EmailImport";
  const dispatch = useDispatch();
  const [moduleLable, setModuleLable] = useState("Email Import");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  let [initialValues, setInitialValues] = useState({});
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [emailImportLoading, setEmailImportLoading] = useState(false);

  const classes = useStyles();
  const currentTheme = useTheme();
  const fullScreen = useMediaQuery(currentTheme.breakpoints.down("sm"));
  var isTab = false;

  const getEmailImportData = useCallback(
    (module) => {
      dispatch(getEmailImportView()).then(function (res) {
        if (res) {
          setData(pathOr([], ["data", "templateMeta", "data"], res));
        } else {
          toast(SOMETHING_WENT_WRONG);
        }
        setLoading(false);
      });
    },
    [dispatch],
  );
  useEffect(() => {
    setLoading(true);
    getEmailImportData(module);
    setErrors({});
    setFields({});
    setInitialValues({});
  }, [module]);

  useEffect(() => {
    if (data.length) {
      let initialState = [];
      let fieldState = [];
      Object.keys(data).map((row) => {
        setValues(data[row].attributes, initialState, fieldState);
        data[row].panels &&
          data[row].panels.map((panelRow) => {
            setValues(panelRow.attributes, initialState, fieldState);
          });
      });

      initialValues = initialState;
      setInitialValues({ ...initialValues, ...initialState });
    }
  }, [data]);

  const setValues = (attributes, initialState, fieldState) => {
    attributes.map((rowField) => {
      rowField.map((field) => {
        return (
          field.name
            ? (initialState[field.name] = field.value ? field.value : "")
            : null,
          field.name ? (fields[field.name] = field) : null
        );
      });
    });
  };

  const onChange = (field, value) => {
    if (field.type === "relate") {
      setInitialValues({
        ...initialValues,
        [field.name]: { value: value.value, id: value.id },
      });
      return;
    }
    initialValues[field.name] = value;
  };
  const getFormatedValue = () => {
    let init = clone(initialValues);

    for (let key in init) {
      /*if (typeof init[key] === "object" && key === 'parent_name') {
                init = { ...init, ...init[key] }
            }*/
      if (key === "assigned_user_name") {
        init["SET_AFTER_IMPORT_assigned_user_name"] =
          init["assigned_user_name"].value;
        init["SET_AFTER_IMPORT_assigned_user_id"] =
          init["assigned_user_name"].id;
        init = { ...init, ...init[key] };
      }

      init["SET_AFTER_IMPORT_parent_type"] = init["parent_type"]
        ? init["parent_type"]
        : "";
      init["SET_AFTER_IMPORT_parent_name"] = init["parent_name"]
        ? init["parent_name"]
        : "";
      init["SET_AFTER_IMPORT_parent_id"] = init["parent_id"]
        ? init["parent_id"]
        : "";
      init = { ...init, ...init[key] };

      init["SET_AFTER_IMPORT_inbound_email_id"] = emailinbound
        ? emailinbound
        : "";

      init = { ...init, ...init[key] };
    }

    return init;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    var submitData = {
      data: {
        type: "InboundEmail",
        attributes: getFormatedValue(),
      },
      folder_name: "INBOX",
      folder: "",
      inbound_email_record: emailinbound ? emailinbound : "",
      emailuid: selectedEmails,
    };
    onSubmit(submitData);
  };
  const onSubmit = async (data) => {
    let view = "QuickCreate";
    try {
      setEmailImportLoading(true);
      dispatch(submitImportView(data)).then(function (res) {
        if (res.data.status) {
          toast(res.data.message);
          emailRecords.map((email, key) => {
            if (selectedEmails.includes(email.attributes.uid)) {
              emailRecords[key].attributes.is_imported = "true";
            }
          });
          setEmailRecords(emailRecords);
          setEmailImportLoading(false);
          setOpenEmailImportDialog(false);
        } else {
          toast(res.data.message);
          setEmailImportLoading(false);
          setOpenEmailImportDialog(false);
        }
      });
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };
  const handleClose = () => {
    setOpenEmailImportDialog(false);
  };

  const innerView = () => {
    return (
      <div className={classes.root}>
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <Paper className={classes.paper}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={2}
            >
              {loading && !data.length && !initialValues.length ? (
                ""
              ) : (
                <>
                  <Grid item>
                    <strong style={{ fontSize: "16px" }}>{moduleLable}</strong>
                  </Grid>
                  <Grid item>
                    {emailImportLoading ? (
                      <Button variant="contained" size="small" color="primary">
                        {LBL_SAVE_INPROGRESS}{" "}
                        <CircularProgress
                          size={14}
                          style={{ marginLeft: 10, color: "White" }}
                        />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        color="primary"
                      >
                        {LBL_SAVE_BUTTON_TITLE}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={handleClose}
                      className={classes.margin}
                    >
                      {LBL_CANCEL_BUTTON_TITLE}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
          <Scrollbars autoHide autoHeight autoHeightMax={500}>
            <Paper className={classes.paperEdit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm container>
                  {loading ? (
                    <div style={{ minHeight: "500px", minWidth: "500px" }}>
                      <Skeleton />
                    </div>
                  ) : isTab ? (
                    initialValues ? (
                      <TabPanel
                        data={data}
                        errors={errors}
                        initialValues={initialValues}
                        module={module}
                        onChange={onChange}
                      />
                    ) : null
                  ) : initialValues ? (
                    <ControlledAccordions
                      data={data}
                      errors={errors}
                      initialValues={initialValues}
                      module={module}
                      headerBackground="true"
                      onChange={onChange}
                      // getDataLine={getDataLine}
                      quickCreate={true}
                      hiddenAll={{ hidden: [], disabled: [] }}
                    />
                  ) : null}
                </Grid>
              </Grid>
            </Paper>
          </Scrollbars>
        </form>
      </div>
    );
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <div>
        {view !== "Calendar" ? (
          <Dialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={"md"}
            open={openEmailImportDialog}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            {innerView()}
          </Dialog>
        ) : (
          innerView()
        )}
      </div>
    </MuiThemeProvider>
  );
};

EmailImport.propTypes = {
  openEmailImportDialog: PropTypes.bool,
  emailinbound: PropTypes.string,
  selectedEmails: PropTypes.array,
};
export default EmailImport;
