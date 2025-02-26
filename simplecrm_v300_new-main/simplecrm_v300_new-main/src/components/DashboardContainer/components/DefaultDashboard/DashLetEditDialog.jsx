import React, { memo, useEffect, useState } from "react";
import CustomDialog from "../../../SharedComponents/CustomDialog";
import {
  LBL_CANCEL_BUTTON_TITLE,
  LBL_DASHLET_EDIT_CHARTS_LABEL,
  LBL_DASHLET_EDIT_COLUMNS,
  LBL_DASHLET_EDIT_FILTER_OPTION_TITLE,
  LBL_DASHLET_EDIT_FILTER_TITLE,
  LBL_DASHLET_EDIT_GENERAL_TITLE,
  LBL_DASHLET_EDIT_SHOW_CHART_LABEL,
  LBL_DASHLET_EDIT_SHOW_MY_ITEM_LABEL,
  LBL_DASHLET_EDIT_TITLE_FIELD_LABEL,
  LBL_DASHLET_EDIT_TITLE_REPORT_LABEL,
  LBL_DASHLET_EDIT_WEBSITE_LOCATION_LABEL,
  LBL_DASHLET_EDIT_WEB_OPTION_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
} from "../../../../constant";
import { Button } from "../../../SharedComponents/Button";
import CustomCircularProgress from "../../../SharedComponents/CustomCircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import useStyles from "./styles";
import { Box, Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  editDashLetAction,
  getDashLetEditDialogDataAction,
} from "../../../../store/actions/dashboard.actions";
import { isEmpty, isNil, pathOr } from "ramda";
import { AORConditions, FormInput, Skeleton } from "../../..";
import DashLetColumnChooser from "./DashLetColumnChooser";
import { toast } from "react-toastify";
const optionsTypes = Object.freeze({
  generalOptions: "generalOptions",
  webOptions: "webOptions",
  searchFilter: "searchFilter",
  reportFilter: "reportFilter",
  columnChooser: "columnChooser",
});
const dashLetGeneralEditFields = {
  optionFields: [
    {
      field_key: "dashletTitle",
      name: "dashletTitle",
      label: LBL_DASHLET_EDIT_TITLE_FIELD_LABEL,
      type: "varchar",
      comment: LBL_DASHLET_EDIT_TITLE_FIELD_LABEL,
    },
    {
      field_key: "aor_report_id",
      name: "aor_report_id",
      label: LBL_DASHLET_EDIT_TITLE_REPORT_LABEL,
      type: "relate",
      module: "AOR_Reports",
      comment: LBL_DASHLET_EDIT_TITLE_REPORT_LABEL,
    },
    {
      field_key: "onlyCharts",
      name: "onlyCharts",
      label: LBL_DASHLET_EDIT_SHOW_CHART_LABEL,
      type: "bool",
      comment: LBL_DASHLET_EDIT_SHOW_CHART_LABEL,
    },
    {
      field_key: "chartOptions",
      name: "chartOptions",
      label: LBL_DASHLET_EDIT_CHARTS_LABEL,
      type: "multienum",
      comment: LBL_DASHLET_EDIT_CHARTS_LABEL,
    },
  ],
  websiteOptionFields: [
    {
      field_key: "title",
      name: "title",
      label: LBL_DASHLET_EDIT_TITLE_FIELD_LABEL,
      type: "varchar",
      comment: LBL_DASHLET_EDIT_TITLE_FIELD_LABEL,
    },
    {
      field_key: "url",
      name: "url",
      label: LBL_DASHLET_EDIT_WEBSITE_LOCATION_LABEL,
      type: "url",
      comment: LBL_DASHLET_EDIT_WEBSITE_LOCATION_LABEL,
    },
  ],
  myItemsOnlyField: [
    {
      field_key: "myItemsOnly",
      name: "myItemsOnly",
      label: LBL_DASHLET_EDIT_SHOW_MY_ITEM_LABEL,
      type: "bool",
      comment: LBL_DASHLET_EDIT_SHOW_MY_ITEM_LABEL,
    },
  ],
};
const DashLetEditDialog = (props) => {
  const {
    dialogOpenStatus,
    handleCloseDialog,
    dashLetData,
    dashboardData,
    handleOnDashLetEditStatus,
  } = props;
  const classes = useStyles();
  const [formMetaData, setFormMetaData] = useState({});
  const [initialFormValues, setInitialFormValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [onSaveLoading, setOnSaveLoading] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const dispatch = useDispatch();
  const dashLetTitle = pathOr(
    pathOr("", ["data", "module"], dashLetData),
    ["data", "meta", "dashlet_title"],
    dashLetData,
  );
  const dashLetModule = pathOr("", ["data", "module"], dashLetData);
  const dashboardIndex = pathOr("", ["current_tab"], dashboardData);

  const getDialogData = () => {
    setLoading(true);
    let payload = {
      dashlet_module: pathOr("HomeApp", ["module"], dashboardData),
      dashlet_id: pathOr(null, ["id"], dashLetData),
    };
    getDashLetEditDialogDataAction(payload)
      .then((res) => {
        if (res.ok) {
          const data = pathOr({}, ["data"], res);
          setInitialFieldValues(data);
          handleOnDashLetEditStatus(false);
          setDialogTitle(pathOr("", ["dashletTitle"], data));
        } else {
          toast(SOMETHING_WENT_WRONG);
          handleCloseDialog();
        }
        setLoading(false);
      })
      .catch((e) => {
        handleCloseDialog();
        setLoading(false);
      });
  };
  const setInitialFieldValues = (data) => {
    const outputObj = { ...data };
    const generalFieldArr = [];
    const webOptionFieldArr = [];
    const searchFilterFieldArr = pathOr([], ["searchFields"], data);
    const reportFilterFieldArr = pathOr([], ["parameters"], data);
    const columnChooserMetaData = pathOr([], ["columnChooser"], data);
    const tempInitialObj = {
      [optionsTypes.generalOptions]: {},
      [optionsTypes.webOptions]: {},
      [optionsTypes.searchFilter]: {},
      [optionsTypes.reportFilter]: [],
      [optionsTypes.columnChooser]: {},
    };
    dashLetGeneralEditFields?.optionFields.forEach((field) => {
      if (dashLetModule == "AOR_Reports") {
        if (field.name == "onlyCharts" || field.name == "chartOptions") {
          if (
            !isEmpty(pathOr("", ["aor_report_id", "id"], data)) &&
            !isEmpty(pathOr([], ["chartoptionslist"], data))
          ) {
            if (field.name == "chartOptions") {
              field.options = pathOr([], ["chartoptionslist"], data);
            }
            generalFieldArr.push(field);
            tempInitialObj[optionsTypes.generalOptions][field.name] =
              data[field.name];
          }
        } else {
          generalFieldArr.push(field);
          tempInitialObj[optionsTypes.generalOptions][field.name] =
            data[field.name];
        }
      } else if (
        field.name == "dashletTitle" &&
        data.hasOwnProperty("dashletTitle")
      ) {
        generalFieldArr.push(field);
        tempInitialObj[optionsTypes.generalOptions][field.name] =
          data[field.name];
      }
    });
    dashLetGeneralEditFields?.websiteOptionFields.forEach((field) => {
      if (dashLetModule == "Home") {
        webOptionFieldArr.push(field);
        tempInitialObj[optionsTypes.webOptions][field.name] = pathOr(
          "",
          [field.name],
          data,
        );
      }
    });
    if (data.hasOwnProperty("myItemsOnly")) {
      searchFilterFieldArr.unshift(
        dashLetGeneralEditFields?.myItemsOnlyField[0],
      );
      tempInitialObj[optionsTypes.searchFilter][
        dashLetGeneralEditFields?.myItemsOnlyField[0].name
      ] = pathOr(
        "",
        [dashLetGeneralEditFields?.myItemsOnlyField[0].name],
        data,
      );
    }
    searchFilterFieldArr?.forEach((field) => {
      if (field.name != "myItemsOnly") {
        tempInitialObj[optionsTypes.searchFilter][field.name] = pathOr(
          "",
          ["value"],
          field,
        );
      }
    });
    outputObj[optionsTypes?.generalOptions] = generalFieldArr;
    outputObj[optionsTypes?.webOptions] = webOptionFieldArr;
    outputObj[optionsTypes?.searchFilter] = searchFilterFieldArr;
    outputObj[optionsTypes?.reportFilter] = reportFilterFieldArr;
    outputObj[optionsTypes?.columnChooser] = columnChooserMetaData;
    setInitialFormValues(tempInitialObj);
    setFormMetaData(outputObj);
  };
  const handleFieldChange = (field, value, type) => {
    if (type == optionsTypes?.generalOptions) {
      const tempOptionMetaField = [];
      initialFormValues[type][field.name] = value;
      if (field.name === "aor_report_id") {
        const newCharts = pathOr(
          [],
          ["rowData", "attributes", "aor_charts"],
          value,
        );
        if (initialFormValues[type].hasOwnProperty("dashletTitle")) {
          const reportTitle = pathOr("", ["value"], value);
          initialFormValues[type]["dashletTitle"] = reportTitle;
        }
        if (isEmpty(newCharts)) {
          formMetaData[type].splice(2, 1);
        } else {
          tempOptionMetaField.push({
            field_key: "onlyCharts",
            name: "onlyCharts",
            label: LBL_DASHLET_EDIT_SHOW_CHART_LABEL,
            type: "bool",
            default: false,
            value: false,
            comment: LBL_DASHLET_EDIT_SHOW_CHART_LABEL,
          });
          tempOptionMetaField.push({
            field_key: "chartOptions",
            name: "chartOptions",
            label: LBL_DASHLET_EDIT_CHARTS_LABEL,
            type: "multienum",
            options: newCharts,
            default: [],
            value: [],
            comment: LBL_DASHLET_EDIT_CHARTS_LABEL,
          });
          initialFormValues[type]["onlyCharts"] = false;
          initialFormValues[type]["chartOptions"] = [];
          initialFormValues[type]["chartoptionslist"] = [];
        }
        initialFormValues[type]["chartOptions"] = [];
        initialFormValues[optionsTypes?.reportFilter] = [];
        setFormMetaData((v) => {
          const filterFields = v[optionsTypes?.generalOptions].filter(
            (o) => o.name != "onlyCharts" && o.name != "chartOptions",
          );
          v[optionsTypes?.generalOptions] = [
            ...filterFields,
            ...tempOptionMetaField,
          ];
          v[optionsTypes?.reportFilter] = [];
          return { ...v };
        });
        setInitialFormValues({ ...initialFormValues });
      }
    } else if (
      type == optionsTypes?.webOptions ||
      type == optionsTypes?.searchFilter
    ) {
      if (field.type === "relate" && isEmpty(value)) {
        initialFormValues[type][field.name] = { id: "", value: "" };
      } else {
        initialFormValues[type][field.name] = value;
      }
      setInitialFormValues({ ...initialFormValues });
    } else if (
      type === optionsTypes?.reportFilter ||
      type === optionsTypes?.columnChooser
    ) {
      initialFormValues[type] = value;
      setInitialFormValues({ ...initialFormValues });
    }
  };
  const handleOnSubmit = () => {
    const requestPayload = {};
    if (dashLetModule === "AOR_Reports") {
      let chartOptionsValue = pathOr(
        "",
        [optionsTypes?.generalOptions, "chartOptions"],
        initialFormValues,
      );
      const aorReportName = pathOr(
        "",
        [optionsTypes?.generalOptions, "aor_report_id", "value"],
        initialFormValues,
      );
      const aorReportId = pathOr(
        "",
        [optionsTypes?.generalOptions, "aor_report_id", "id"],
        initialFormValues,
      );
      if (!Array.isArray(chartOptionsValue) && !isEmpty(chartOptionsValue)) {
        if (chartOptionsValue.indexOf(",") > -1) {
          chartOptionsValue =
            chartOptionsValue &&
            chartOptionsValue.replace(/\^/g, "").split(",");
        } else {
          chartOptionsValue = [chartOptionsValue.replace(/\^/g, "")];
        }
      }
      let reportParameterIds = [];
      let reportParameterOperator = [];
      let reportParameterType = [];
      let reportParameterValue = [];
      initialFormValues[optionsTypes?.reportFilter].map(
        (reportFilter, rNum) => {
          if (reportFilter !== undefined) {
            if (reportFilter["id"] !== null) {
              reportParameterIds[rNum] =
                reportFilter["parameter_id"] ||
                formMetaData[optionsTypes?.reportFilter][rNum].id;
              reportParameterOperator[rNum] =
                reportFilter["parameter_operator"] ||
                formMetaData[optionsTypes?.reportFilter][rNum].operator;
              reportParameterType[rNum] =
                reportFilter["parameter_type"] ||
                formMetaData[optionsTypes?.reportFilter][rNum].value_type;
              reportParameterValue[rNum] =
                reportFilter["parameter_value"] ||
                formMetaData[optionsTypes?.reportFilter][rNum].value;
            }
          }
        },
      );
      requestPayload["id"] = formMetaData["id"];
      requestPayload["module"] = "HomeApp";
      requestPayload["configure"] = "true";
      requestPayload["dashletTitle"] = pathOr(
        "",
        [optionsTypes?.generalOptions, "dashletTitle"],
        initialFormValues,
      );
      requestPayload["aor_report_name"] = aorReportName;
      requestPayload["aor_report_id"] = aorReportId;
      requestPayload["charts"] = chartOptionsValue;
      requestPayload["onlyCharts"] = pathOr(
        "",
        [optionsTypes?.generalOptions, "onlyCharts"],
        initialFormValues,
      );
      requestPayload["parameter_id"] = reportParameterIds.filter(
        (e) => !isNil(e),
      );
      requestPayload["parameter_operator"] = reportParameterOperator.filter(
        (e) => !isNil(e),
      );
      requestPayload["parameter_type"] = reportParameterType.filter(
        (e) => !isNil(e),
      );
      requestPayload["parameter_value"] = reportParameterValue.filter(
        (e) => !isNil(e),
      );
    } else if (dashLetModule === "Home") {
      requestPayload["id"] = formMetaData["id"];
      requestPayload["module"] = "HomeApp";
      requestPayload["configure"] = "true";
      requestPayload["title"] = pathOr(
        "",
        [optionsTypes?.webOptions, "title"],
        initialFormValues,
      );
      requestPayload["url"] = pathOr(
        "",
        [optionsTypes?.webOptions, "url"],
        initialFormValues,
      );
      requestPayload["height"] = pathOr(
        "",
        [optionsTypes?.webOptions, "height"],
        initialFormValues,
      );
    } else {
      requestPayload["id"] = formMetaData["id"];
      requestPayload["module"] = "HomeApp";
      requestPayload["configure"] = "true";
      requestPayload["to_pdf"] = "true";
      requestPayload["displayColumnsDef"] = pathOr(
        [],
        [optionsTypes?.columnChooser, "transferListLeftColumns"],
        initialFormValues,
      );
      requestPayload["hideTabsDef"] = pathOr(
        [],
        [optionsTypes?.columnChooser, "transferListRightColumns"],
        initialFormValues,
      );
      requestPayload["dashletTitle"] = pathOr(
        [],
        [optionsTypes?.generalOptions, "dashletTitle"],
        initialFormValues,
      );
      requestPayload["dashletTitle"] = pathOr(
        [],
        [optionsTypes?.generalOptions, "dashletTitle"],
        initialFormValues,
      );
      requestPayload["dashletType"] = "";
      requestPayload["displayRows"] = 5;
      requestPayload["autoRefresh"] = 10;
      requestPayload["myItemsOnly"] = pathOr(
        false,
        [optionsTypes?.searchFilter, "myItemsOnly"],
        initialFormValues,
      );
      requestPayload["Filter_itms"] = pathOr(
        false,
        [optionsTypes?.searchFilter],
        initialFormValues,
      );
    }
    const requestFinalPayload = { configureDashlet: requestPayload };
    setOnSaveLoading(false);
    dispatch(
      editDashLetAction(requestFinalPayload, dashboardIndex, (res) => {
        if (res?.ok) {
          setOnSaveLoading(false);
          handleOnDashLetEditStatus(true);
          handleCloseDialog();
        } else {
          handleCloseDialog();
          setOnSaveLoading(false);
        }
      }),
    );
  };
  useEffect(() => {
    getDialogData();
  }, []);
  return (
    <CustomDialog
      isDialogOpen={dialogOpenStatus}
      handleCloseDialog={handleCloseDialog}
      title={dialogTitle}
      maxWidth={"md"}
      bodyContent={
        loading ? (
          <Skeleton />
        ) : (
          <EditDialogBody
            formMetaData={formMetaData}
            handleFieldChange={handleFieldChange}
            initialFormValues={initialFormValues}
            fieldErrors={fieldErrors}
            dashLetModule={dashLetModule}
          />
        )
      }
      bottomActionContent={
        <Box className={classes.buttonGroupRoot}>
          <Button
            label={onSaveLoading ? "Saving..." : LBL_SAVE_BUTTON_TITLE}
            startIcon={
              onSaveLoading ? (
                <CustomCircularProgress size={16} />
              ) : (
                <SaveIcon />
              )
            }
            disabled={loading}
            onClick={handleOnSubmit}
          />
          <Button
            label={LBL_CANCEL_BUTTON_TITLE}
            startIcon={<CancelIcon />}
            disabled={loading}
            onClick={handleCloseDialog}
          />
        </Box>
      }
    />
  );
};
const EditDialogBody = ({
  formMetaData,
  handleFieldChange,
  initialFormValues,
  fieldErrors,
  dashLetModule,
}) => {
  const generalFieldsMetaData = pathOr(
    [],
    [optionsTypes?.generalOptions],
    formMetaData,
  );
  const webOptionFieldsMetaData = pathOr(
    [],
    [optionsTypes?.webOptions],
    formMetaData,
  );
  const searchFilterFieldsMetaData = pathOr(
    [],
    [optionsTypes?.searchFilter],
    formMetaData,
  );
  const reportFilterFieldsMetaData = pathOr(
    [],
    [optionsTypes?.reportFilter],
    formMetaData,
  );
  const columnChooserMetaData = pathOr(
    [],
    [optionsTypes?.columnChooser],
    formMetaData,
  );
  return (
    <Box>
      <GeneralFieldContainer
        generalFieldsMetaData={generalFieldsMetaData}
        initialFormValues={initialFormValues}
        handleFieldChange={handleFieldChange}
        fieldErrors={fieldErrors}
      />
      <DashLetColumnChooserContainer
        columnChooserMetaData={columnChooserMetaData}
        initialFormValues={initialFormValues}
        handleFieldChange={handleFieldChange}
        fieldErrors={fieldErrors}
      />
      <WebOptionFieldContainer
        webOptionFieldsMetaData={webOptionFieldsMetaData}
        initialFormValues={initialFormValues}
        handleFieldChange={handleFieldChange}
        fieldErrors={fieldErrors}
      />
      <SearchFilterFieldContainer
        searchFilterFieldsMetaData={searchFilterFieldsMetaData}
        initialFormValues={initialFormValues}
        handleFieldChange={handleFieldChange}
        fieldErrors={fieldErrors}
      />
      <DashLetReportFilerContainer
        searchFilterFieldsMetaData={reportFilterFieldsMetaData}
        handleFieldChange={handleFieldChange}
        fieldErrors={fieldErrors}
        dashLetModule={dashLetModule}
      />
    </Box>
  );
};

const GeneralFieldContainer = memo(
  ({
    generalFieldsMetaData,
    handleFieldChange,
    initialFormValues,
    fieldErrors,
  }) => {
    if (isEmpty(generalFieldsMetaData)) return null;
    return (
      <>
        <h3>{LBL_DASHLET_EDIT_GENERAL_TITLE}</h3>
        <Grid container>
          {generalFieldsMetaData &&
            generalFieldsMetaData.map((field, fieldNum) => (
              <Grid
                item
                xs={12}
                sm={12}
                key={field?.name}
                style={{ marginBottom: 10 }}
              >
                <FormInput
                  field={field}
                  value={
                    initialFormValues[optionsTypes?.generalOptions][field.name]
                  }
                  errors={fieldErrors}
                  module={field?.module ? field.module : "Users"}
                  onChange={(val) =>
                    handleFieldChange(field, val, optionsTypes?.generalOptions)
                  }
                  small={true}
                />
              </Grid>
            ))}
        </Grid>
      </>
    );
  },
);

const WebOptionFieldContainer = memo(
  ({
    webOptionFieldsMetaData,
    handleFieldChange,
    initialFormValues,
    fieldErrors,
  }) => {
    if (isEmpty(webOptionFieldsMetaData)) return null;
    return (
      <>
        <h3>{LBL_DASHLET_EDIT_WEB_OPTION_TITLE}</h3>
        <Grid container>
          {webOptionFieldsMetaData &&
            webOptionFieldsMetaData.map((field, fieldNum) => (
              <Grid
                item
                xs={12}
                sm={12}
                key={field?.name}
                style={{ marginBottom: 10 }}
              >
                <FormInput
                  field={field}
                  value={
                    initialFormValues[optionsTypes?.webOptions][field.name]
                  }
                  errors={fieldErrors}
                  module={field?.module ? field.module : "Users"}
                  onChange={(val) =>
                    handleFieldChange(field, val, optionsTypes?.webOptions)
                  }
                  small={true}
                />
              </Grid>
            ))}
        </Grid>
      </>
    );
  },
);

const SearchFilterFieldContainer = memo(
  ({
    searchFilterFieldsMetaData,
    handleFieldChange,
    initialFormValues,
    fieldErrors,
  }) => {
    if (isEmpty(searchFilterFieldsMetaData)) return null;
    return (
      <>
        <h3>{LBL_DASHLET_EDIT_FILTER_TITLE}</h3>
        <Grid container>
          {searchFilterFieldsMetaData &&
            searchFilterFieldsMetaData.map((field, fieldNum) => (
              <Grid
                item
                xs={12}
                sm={12}
                key={field?.name}
                style={{ marginBottom: 10 }}
              >
                <FormInput
                  field={field}
                  value={
                    initialFormValues[optionsTypes?.searchFilter][field.name]
                  }
                  errors={fieldErrors}
                  module={field?.module ? field.module : "Users"}
                  onChange={(val) =>
                    handleFieldChange(field, val, optionsTypes?.searchFilter)
                  }
                  small={true}
                  view={"SearchLayout"}
                />
              </Grid>
            ))}
        </Grid>
      </>
    );
  },
);

const DashLetReportFilerContainer = memo(
  ({ reportFilterFieldsMetaData, handleFieldChange, dashLetModule }) => {
    if (isEmpty(reportFilterFieldsMetaData)) return null;
    return (
      <AORConditions
        type="Dashlet"
        data={reportFilterFieldsMetaData}
        module={dashLetModule}
        handleOnChange={(value) =>
          handleFieldChange(
            reportFilterFieldsMetaData,
            value,
            optionsTypes?.reportFilter,
          )
        }
      />
    );
  },
);

const DashLetColumnChooserContainer = memo(
  ({ columnChooserMetaData, handleFieldChange, initialFormValues }) => {
    const [transferListLeftColumns, setTransferListLeftColumns] =
      useState(null);
    const [transferListRightColumns, setTransferListRightColumns] =
      useState(null);
    useEffect(() => {
      handleFieldChange(
        columnChooserMetaData,
        {
          transferListLeftColumns,
          transferListRightColumns,
        },
        optionsTypes?.columnChooser,
      );
    }, [transferListLeftColumns, transferListRightColumns]);
    if (isEmpty(columnChooserMetaData)) return null;
    return (
      <>
        <h3> {LBL_DASHLET_EDIT_COLUMNS}</h3>
        <DashLetColumnChooser
          columnChooser={columnChooserMetaData}
          setTransferListLeftColumns={setTransferListLeftColumns}
          setTransferListRightColumns={setTransferListRightColumns}
        />
      </>
    );
  },
);

export default DashLetEditDialog;
