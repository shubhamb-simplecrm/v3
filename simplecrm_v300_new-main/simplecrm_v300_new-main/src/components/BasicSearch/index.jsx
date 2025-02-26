import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { pathOr, clone, isEmpty } from "ramda";
import {
  getFilterConfig,
  getListView,
  setIsFilterByBasicSearch,
} from "../../store/actions/module.actions";
import {
  Grid,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Search, Save } from "@material-ui/icons";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { FormInput } from "../../components";
import { BASIC_SEARCH, RESET, SEARCH } from "../../constant";
import useStyles, { getMuiTheme } from "./styles";

const BasicSearch = (props) => {
  const { search, setFilterQuery, setFilterQueryMeta, isLoading } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [filterValues, setFilterValues] = useState({});
  const [filterValuesMeta, setFilterValuesMeta] = useState({});
  const [isResetFilter, setIsResetFilter] = useState(false);
  const {
    filterConfig,
    listViewTabData,
    selectedModule,
    isClearBasicSearchData,
  } = useSelector((state) => state.modules);

  let basicFields = pathOr(
    [],
    [selectedModule, "templateMeta", "data", "basic_search"],
    filterConfig,
  );

  const dispatch = useDispatch();
  const resetFilter = () => {
    setIsResetFilter(true);
    basicFields = [];
    let filterQuery = `filter[reset][eq]=true&`;
    let rowsPerPage = "20";
    const sort = pathOr(
      {},
      ["data", "templateMeta", "sort"],
      listViewTabData[selectedModule],
    );
    dispatch(
      getListView(selectedModule, 0, rowsPerPage, sort, filterQuery),
    ).then(function (res) {
      dispatch(getFilterConfig(selectedModule));
      dispatch(setIsFilterByBasicSearch(false));
    });
  };

  useEffect(() => {
    if (isResetFilter || isClearBasicSearchData) {
      const nwAFields = clone(basicFields);
      const nwAFieldsMeta = [];
      const nwAFieldsCopy = [];
      for (let val in nwAFields) {
        let fieldName = nwAFields[val]["name"];
        if (nwAFields[val]["type"] === "multienum") {
          nwAFields[val]["value"] = [];
          nwAFieldsCopy[fieldName] = "";
          nwAFieldsMeta[fieldName] = nwAFields[val];
        } else if (nwAFields[val]["type"] === "parent") {
          nwAFields[val]["value"] = "";
          nwAFields[val]["parent_name"] = "";
          nwAFieldsCopy[fieldName] = "";
          nwAFieldsMeta[fieldName] = nwAFields[val];
        } else if (nwAFields[val]["type"] === "currency") {
          nwAFields[val]["value"] = "";
          nwAFields[val][fieldName] = "";
          nwAFields[val]["range_" + fieldName] = "";
          nwAFields[val]["start_range_" + fieldName] = "";
          nwAFields[val]["end_range_" + fieldName] = "";
          nwAFields[val][fieldName + "_range_choice"] = "";
          nwAFieldsCopy[fieldName] = "";
          nwAFieldsMeta[fieldName] = nwAFields[val];
        } else if (nwAFields[val]["type"] === "datetimecombo") {
          nwAFields[val]["value"] = "";
          nwAFields[val][fieldName] = "";
          nwAFields[val]["range_" + fieldName] = "";
          nwAFields[val]["start_range_" + fieldName] = "";
          nwAFields[val]["end_range_" + fieldName] = "";
          nwAFields[val][fieldName + "_range_choice"] = "";
          nwAFieldsCopy[fieldName] = "";
          nwAFieldsMeta[fieldName] = nwAFields[val];
        } else {
          nwAFields[val]["value"] = "";
          nwAFieldsCopy[fieldName] = "";
          nwAFieldsMeta[fieldName] = nwAFields[val];
        }
      }
      setIsResetFilter(false);
      basicFields = nwAFields;
      setFilterValuesMeta(nwAFieldsMeta);
      setFilterValues(nwAFieldsCopy);
      let filterQuery = `filter[reset][eq]=true&`;
      setFilterQuery(filterQuery);
      setFilterQueryMeta("");
      dispatch(setIsFilterByBasicSearch(false));
    }
  }, [isResetFilter, isClearBasicSearchData]);

  const buildFilterQuery = () => {
    let filterQuery = "";
    let filterFields = [];
    for (let key in filterValues) {
      if (filterValues[key] && filterValuesMeta[key]) {
        let operator = "eq";
        let likeTypes = ["name", "url"];
        if (likeTypes.includes(filterValuesMeta[key].type)) {
          operator = "lke";
        }
        let multiTypes = ["multienum"];
        if (multiTypes.includes(filterValuesMeta[key].type)) {
          operator = "multi";
        }
        if (typeof filterValues[key] !== "object") {
          if (
            filterValuesMeta[key].type === "datetime" ||
            filterValuesMeta[key].type === "datetimecombo"
          ) {
            let dateSingleValue = [
              "next_7_days",
              "last_7_days",
              "last_month",
              "this_month",
              "next_month",
              "last_30_days",
              "next_30_days",
              "this_year",
              "last_year",
              "next_year",
            ];
            let dateDoubleValue = [
              "=",
              "not_equal",
              "less_than",
              "greater_than",
              "less_than_equals",
              "greater_than_equals",
            ];
            let dateTripalValue = ["between"];
            if (dateSingleValue.some((item) => filterValues[key] === item)) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${`operator`}]=${filterValues[key]}&`;
            } else if (
              dateDoubleValue.some((item) => filterValues[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${operator}]=${filterValues["range_" + key]}&filter[${key}_range_choice][${`operator`}]=${filterValues[key]}&`;
            } else if (
              dateTripalValue.some((item) => filterValues[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[start_range_${key}][${operator}]=${filterValues["start_range_" + key]}&filter[end_range_${key}][${operator}]=${filterValues["end_range_" + key]}&filter[${key}_range_choice][${`operator`}]=${filterValues[key]}&`;
            }
          } else if (filterValuesMeta[key].type === "currency") {
            let dateDoubleValue = [
              "=",
              "not_equal",
              "less_than",
              "greater_than",
              "less_than_equals",
              "greater_than_equals",
            ];
            let dateTripalValue = ["between"];
            if (dateDoubleValue.some((item) => filterValues[key] === item)) {
              filterQuery =
                filterQuery +
                `filter[range_${key}][${operator}]=${filterValues["range_" + key]}&filter[${key}_range_choice][${`operator`}]=${filterValues[key]}&`;
            } else if (
              dateTripalValue.some((item) => filterValues[key] === item)
            ) {
              filterQuery =
                filterQuery +
                `filter[start_range_${key}][${operator}]=${filterValues["start_range_" + key]}&filter[end_range_${key}][${operator}]=${filterValues["end_range_" + key]}&filter[${key}_range_choice][${`operator`}]=${filterValues[key]}&`;
            }
          } else if (filterValuesMeta[key].type === "bool") {
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${filterValues[key] ? 1 : 0}&`;
          } else {
            let fval = encodeURIComponent(filterValues[key]);
            filterQuery = filterQuery + `filter[${key}][${operator}]=${fval}&`;
          }
          let fields = {};
          let value = filterValues[key];
          if (filterValuesMeta[key].type === "enum") {
            value = filterValuesMeta[key].options[value];
          }
          fields.value = value;
          fields.label = filterValuesMeta[key].label;
          fields.field = key;
          filterFields.push(fields);
        } else {
          let fields = {};
          if (filterValuesMeta[key].type === "relate") {
            let fval = encodeURIComponent(filterValues[key].value);
            filterQuery =
              filterQuery +
              `filter[${key}][]=${fval}&filter[${key}_id][]=${filterValues[key].id}&`;
            fields.value = filterValues[key].value;
          } else if (filterValuesMeta[key].type === "parent") {
            let fval = encodeURIComponent(filterValues[key].parent_name);
            filterQuery =
              filterQuery +
              `filter[parent_type][${operator}]=${filterValues[key].parent_type}&filter[parent_name][${operator}]=${fval}&`;
            fields.value = filterValues[key].value;
          } else {
            filterQuery =
              filterQuery +
              `filter[${key}][${operator}]=${filterValues[key].id}&`;
            fields.value = filterValues[key].id;
          }
          fields.label = filterValuesMeta[key].label;
          fields.field = key;
          filterFields.push(fields);
        }
      }
    }
    setFilterQuery(filterQuery);
    setFilterValuesMeta(filterValuesMeta);
    setFilterQueryMeta(filterFields);
    dispatch(setIsFilterByBasicSearch(true));
    if (filterQuery) {
      return filterQuery;
    } else {
      return `filter[reset][eq]=true&`;
    }
  };

  useEffect(() => {
    let initialValues1 = [];
    let initialMetaValues1 = [];
    let basicSearchFields = pathOr(
      [],
      [selectedModule, "templateMeta", "data", "basic_search"],
      filterConfig,
    );
    basicFields = basicSearchFields;
    basicSearchFields.forEach((fieldsMeta, key) => {
      let value = Array.isArray(fieldsMeta.value)
        ? fieldsMeta.value.toString()
        : fieldsMeta.value;
      if (value) {
        if (
          fieldsMeta.type === "datetimecombo" &&
          fieldsMeta.value === "between"
        ) {
          initialValues1[fieldsMeta.field_key] = fieldsMeta.value.toString();
          initialValues1["end_range_" + fieldsMeta.field_key] =
            fieldsMeta["end_range_" + fieldsMeta.field_key];
          initialValues1["start_range_" + fieldsMeta.field_key] =
            fieldsMeta["start_range_" + fieldsMeta.field_key];
          initialMetaValues1[fieldsMeta.field_key] = fieldsMeta;
          initialMetaValues1["end_range_" + fieldsMeta.field_key] = fieldsMeta;
          initialMetaValues1["start_range_" + fieldsMeta.field_key] =
            fieldsMeta;
        } else if (fieldsMeta.type === "relate") {
          let temp = [];
          temp["value"] = fieldsMeta.value.value;
          temp["id"] = fieldsMeta.value.id;
          initialValues1[fieldsMeta.field_key] = temp;
          initialMetaValues1[fieldsMeta.field_key] = fieldsMeta;
        } else if (fieldsMeta.type === "parent") {
          let temp = [];
          temp["parent_name"] = fieldsMeta.parent_name.parent_name;
          temp["parent_type"] = fieldsMeta.parent_name.parent_type;
          temp["parent_id"] = fieldsMeta.parent_name.parent_id;
          initialValues1[fieldsMeta.field_key] = temp;
          initialMetaValues1[fieldsMeta.field_key] = fieldsMeta;
        } else {
          initialValues1[fieldsMeta.field_key] = fieldsMeta.value.toString();
          initialMetaValues1[fieldsMeta.field_key] = fieldsMeta;
        }
      }
    });
    setFilterValuesMeta({ ...filterValuesMeta, ...initialMetaValues1 });
    setFilterValues({ ...filterValues, ...initialValues1 });
  }, [selectedModule]);

  const getBasicFields = useCallback(() => {
    let basicSearchFields = pathOr(
      [],
      [selectedModule, "templateMeta", "data", "basic_search"],
      filterConfig,
    );
    basicFields = basicSearchFields;
  }, [filterConfig]);

  useEffect(() => {
    if (isEmpty(basicFields) && !isLoading) {
      getBasicFields();
    }
  }, [selectedModule, isLoading, basicFields, getBasicFields]);

  const renderTabBody = () => {
    const currencyIndex = basicFields.findIndex((it) => it.type === "currency");
    const currencyField = basicFields.splice(currencyIndex, 1);
    basicFields.push(...currencyField);

    const searchFormHandle = (event) => {
      event.preventDefault();
      search(buildFilterQuery());
    };

    let savedSearchData = {
      field_key: "account_type",
      name: "account_type",
      label: "Type",
      type: "enum",
      required: "false",
      comment: "The Company is of this type",
      massupdate: "false",
      dom: "account_type_dom",
      options: {
        "": "",
        Analyst: "Analyst",
        Competitor: "Competitor",
        Customer: "Customer",
        Integrator: "Integrator",
        Investor: "Investor",
        Partner: "Partner",
        Press: "Press",
        Prospect: "Prospect",
        Reseller: "Reseller",
        Other: "Other",
      },
      len: 100,
    };

    savedSearchData = null;

    let namedData = {
      field_key: "saved_search_name",
      name: "saved_search_name",
      label: "Name",
      type: "name",
      required: "false",
      comment: "The Company is of this type",
      massupdate: "false",
      dom: "saved_search_name_dom",
      value: "",
    };

    const saveSavedSearch = () => {};

    return (
      <form
        id="filter-form2"
        onSubmit={searchFormHandle}
        noValidate
        autoComplete="off"
        className={`${classes.formCont} ${classes.mobileLayoutForm}`}
        style={{ marginTop: "5px", width: "100%" }}
      >
        <Grid
          container
          spacing={2}
          className={classes.fieldsGrid}
          style={{ marginTop: "5px", width: "100%" }}
          fullWidth
        >
          {basicFields &&
            basicFields.map((field) => {
              return (
                <Grid
                  item
                  xs={field.type === "currency" ? 12 : 6}
                  md={field.type === "currency" ? 8 : 3}
                  key={field.field_key}
                >
                  <FormInput
                    field={field}
                    dynamicEnumValue={filterValues[field.parentenum] || ""}
                    onChange={(val) => {
                      if (field.type === "multienum") {
                        if (Array.isArray(val)) {
                          val = val.toString();
                        }
                      }
                      if (
                        field.type === "datetime" ||
                        field.type === "datetimecombo"
                      ) {
                        let dateSingleValue = [
                          "next_7_days",
                          "last_7_days",
                          "last_month",
                          "this_month",
                          "next_month",
                          "last_30_days",
                          "next_30_days",
                          "this_year",
                          "last_year",
                          "next_year",
                        ];
                        let dateDoubleValue = [
                          "=",
                          "not_equal",
                          "less_than",
                          "greater_than",
                          "less_than_equals",
                          "greater_than_equals",
                        ];
                        let dateTripalValue = ["between"];
                        if (
                          dateSingleValue.some((item) => val["value"] === item)
                        ) {
                          setFilterValues({
                            ...filterValues,
                            [field.field_key]: val["value"],
                            [`range_${field.field_key}`]: "",
                          });
                        } else if (
                          dateDoubleValue.some((item) => val["value"] === item)
                        ) {
                          setFilterValues({
                            ...filterValues,
                            [field.field_key]: val["value"],
                            [`${field.field_key}_range_choice`]: "",
                            [`range_${field.field_key}`]:
                              val[`range_${field.field_key}`],
                          });
                        } else if (
                          dateTripalValue.some((item) => val["value"] === item)
                        ) {
                          setFilterValues({
                            ...filterValues,
                            [`range_${field.field_key}`]: "",
                            [`${field.field_key}_range_choice`]: "",
                            [field.field_key]: val[`${field.field_key}`],
                            [`start_range_${field.field_key}`]:
                              val[`start_range_${field.field_key}`],
                            [`end_range_${field.field_key}`]:
                              val[`end_range_${field.field_key}`],
                          });
                        } else {
                          setFilterValues({
                            ...filterValues,
                            [`range_${field.field_key}`]: "",
                            [`${field.field_key}_range_choice`]: "",
                            [field.field_key]: val[`${field.field_key}`],
                            [`start_range_${field.field_key}`]: "",
                            [`end_range_${field.field_key}`]: "",
                          });
                        }
                        setFilterValuesMeta({
                          ...filterValuesMeta,
                          [field.field_key]: field,
                          [`${field.field_key}_range_choice`]: field,
                          [`range_${field.field_key}`]: field,
                          [`start_range_${field.field_key}`]: field,
                          [`end_range_${field.field_key}`]: field,
                        });
                      } else if (field.type === "currency") {
                        let dateDoubleValue = [
                          "=",
                          "not_equal",
                          "less_than",
                          "greater_than",
                          "less_than_equals",
                          "greater_than_equals",
                        ];
                        let dateTripalValue = ["between"];
                        if (
                          dateDoubleValue.some(
                            (item) => val[field.field_key] === item,
                          )
                        ) {
                          setFilterValues({
                            ...filterValues,
                            [field.field_key]: val[field.field_key],
                            [`${field.field_key}_range_choice`]: "",
                            [`range_${field.field_key}`]:
                              val[`range_${field.field_key}`],
                          });
                        } else if (
                          dateTripalValue.some(
                            (item) => val[field.field_key] === item,
                          )
                        ) {
                          setFilterValues({
                            ...filterValues,
                            [`range_${field.field_key}`]: "",
                            [`${field.field_key}_range_choice`]: "",
                            [field.field_key]: val[`${field.field_key}`],
                            [`start_range_${field.field_key}`]:
                              val[`start_range_${field.field_key}`],
                            [`end_range_${field.field_key}`]:
                              val[`end_range_${field.field_key}`],
                          });
                        } else {
                          setFilterValues({
                            ...filterValues,
                            [`range_${field.field_key}`]: "",
                            [`${field.field_key}_range_choice`]: "",
                            [field.field_key]: val[`${field.field_key}`],
                            [`start_range_${field.field_key}`]: "",
                            [`end_range_${field.field_key}`]: "",
                          });
                        }
                        setFilterValuesMeta({
                          ...filterValuesMeta,
                          [field.field_key]: field,
                          [`${field.field_key}_range_choice`]: field,
                          [`range_${field.field_key}`]: field,
                          [`start_range_${field.field_key}`]: field,
                          [`end_range_${field.field_key}`]: field,
                        });
                      } else {
                        if (field) {
                          setFilterValues({
                            ...filterValues,
                            [field.field_key]: val,
                          });
                          setFilterValuesMeta({
                            ...filterValuesMeta,
                            [field.field_key]: field,
                          });
                        }
                      }
                    }}
                    small={true}
                    value={filterValues[field.field_key] || ""}
                    view={"SearchLayout"}
                  />
                </Grid>
              );
            })}
          <div className={classes.buttonsWrapper}>
            {savedSearchData && (
              <div style={{ display: "flex" }}>
                <div className={classes.subBtnWidth}>
                  <FormInput
                    field={savedSearchData}
                    small={true}
                    value={savedSearchData.options[1]}
                    onChange={(val) => {}}
                  />
                </div>
                <div className={classes.subBtnWidth}>
                  <FormInput
                    field={namedData}
                    small={true}
                    onChange={(val) => {}}
                  />
                </div>
                <Button
                  variant="contained"
                  onClick={() => saveSavedSearch()}
                  color="primary"
                  size="medium"
                  className={classes.btnSave}
                  disableElevation
                  type="button"
                >
                  <Save />
                </Button>
              </div>
            )}
            <div className={classes.buttonsWrapper}>
              <Button
                variant="contained"
                onClick={() => resetFilter()}
                color="primary"
                size="medium"
                fullWidth
                style={{ margin: 5, width: "100px" }}
                className={classes.basicSearchActionBtn}
              >
                {RESET}
              </Button>
              <Button
                variant="contained"
                onClick={() => search(buildFilterQuery())}
                color="primary"
                size="medium"
                fullWidth
                style={{ margin: 5, width: "100px" }}
                className={classes.basicSearchActionBtn}
              >
                <Search className={classes.basicSearchActionBtn} /> {SEARCH}
              </Button>
            </div>
          </div>
        </Grid>
      </form>
    );
  };

  return (
    <>
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        {!isEmpty(basicFields) ? (
          <Accordion
            style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}
            className={classes.accordionBox}
            defaultExpanded
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.headerBackground}
            >
              <Typography className={classes.heading}>
                {BASIC_SEARCH}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>{renderTabBody()}</AccordionDetails>
          </Accordion>
        ) : (
          ""
        )}
      </MuiThemeProvider>
    </>
  );
};

const mapStateToProps = (state) => {
  const { modules } = state;
  return {
    modules,
    state,
  };
};

export default connect(mapStateToProps, {})(BasicSearch);
