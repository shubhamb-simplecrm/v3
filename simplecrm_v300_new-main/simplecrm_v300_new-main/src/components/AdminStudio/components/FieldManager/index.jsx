import React, { useCallback, useEffect, useState } from "react";
import CustomList from "../CustomList";
import { Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import { FormInput, Skeleton } from "@/components";
import FilterNoneIcon from "@material-ui/icons/FilterNone"; //do not remove
import InfoIcon from '@material-ui/icons/Info';
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SaveIcon from "@material-ui/icons/Save";
import {
  LBL_ADD_FIELD,
  LBL_ADD_OPTION,
  LBL_CLONE_BUTTON_TITLE, //do not remove
  LBL_CONFIRM_DELETE_BUTTON_TITLE,
  LBL_DELETE_BUTTON_TITLE,
  LBL_DELETE_FIELD_MSG,
  LBL_DELETE_INPROGRESS,
  LBL_DUPLICATE_FIELD,
  LBL_EDIT_OPTION,
  LBL_INVALID_FIELD,
  LBL_INVALID_FIELD_NAME,
  LBL_INVALID_MAX_SIZE,
  LBL_INVALID_NUMBER_ERROR,
  LBL_PRECISION_ERROR,
  LBL_REQUIRED_FIELD,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
  LBL_SEARCH_FIELD_PLACEHOLDER,
  SOMETHING_WENT_WRONG,
  LBL_SAVE_FIELD_WARNING,
} from "../../../../constant";
import { useSelector } from "react-redux";
import useStyles from "./styles";
import { useDispatch } from "react-redux";
import {
  getFieldData,
  getTabView,
  setSelectedParameter,
} from "@/store/actions/studio.actions";
import AlertDialog from "@/components/Alert";
import { isEmpty, isNil, pathOr, clone } from "ramda";
import DefaultAddView from "../../DefaultAddView";
import parse from "html-react-parser";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import EditOptionView from "./EditOptionView";
import { api } from "@/common/api-utils";
import { isValidPrecision } from "@/common/utils";
import { toast } from "react-toastify";
import {
  LBL_DELETE_FIELD_BPM_CONTENT,
  LBL_WARNING_TITLE,
} from "@/constant/language/en_us";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const FieldManager = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { module, manager, view, action } = useParams();
  const [fieldData, setFieldData] = useState([]);
  const globalPreference = useSelector(
    (state) => state.config.userPreference.attributes.global,
  );
  const [fieldDataLoading, setFieldDataLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const tabViewData = useSelector((state) => state.studio?.tabViewData);
  const [errors, setErrors] = useState({});
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [deleteFieldData, setDeleteFieldData] = useState(false);
  const [layout, setLayout] = useState([]);
  const [dropdownList, setDropdownList] = useState({});

  const handleOpenPopup = (field) => {
    setDeleteFieldData(field);
    setOpenDeletePopup(true);
  };
  const handleGetFieldData = (params) => {
    setErrors({});
    history.push(
      `/app/studio/${module}/${manager}/${!isNil(view) ? view : "addField"}`,
    );
    if (isEmpty(params.field)) {
      dispatch(setSelectedParameter(LBL_ADD_FIELD));
    } else {
      tabViewData?.fieldsData.map((item) => {
        if (item.name === view) {
          dispatch(setSelectedParameter(item.label));
        }
      });
    }
    setFieldDataLoading(true);
    dispatch(getFieldData(params)).then((response) => {
      if (response.ok) {
        let tempObj = {};
        response.data.data.layout.map((field) => {
          tempObj[field.name] = field.value;
          if (!isEmpty(field.comment) && !isNil(field.comment)) {
            field.comment = parse(field.comment);
          }
        });
        setInitialValues(tempObj);
        setFieldData(response.data.data);
        setFieldDataLoading(false);
      } else {
        setFieldDataLoading(false);
      }
    });
  };
  const handleOptionDisplay = (action) => {
    if (
      (isEmpty(initialValues.name) || isNil(initialValues)) &&
      action == "addOptions"
    ) {
      setErrors({ name: LBL_REQUIRED_FIELD });
    } else {
      history.push(`/app/studio/${module}/${manager}/${view}/${action}`);
    }
  };

  const handleUpdateDefaultOptions = async (dropdownName) => {
    const payload = {
      module: module,
      view_package: "",
      dropdown_name: dropdownName,
    };
    const res = await api.get(`V8/studio/getDropdownOptions`, payload);
    fieldData.layout.map((field, index) => {
      if (field.field_key === "default" && !isEmpty(res?.data?.data)) {
        fieldData["layout"][index]["options"] = res?.data?.data;
      }
    });
    setFieldData({ ...fieldData });
  };
  const handleFieldChange = (val, fieldName) => {
    if (fieldName === "type") {
      handleGetFieldData({
        module: module,
        field: "",
        type: val,
        is_custom: fieldData["is_custom"] == true ? 1 : 0,
      });
    } else {
      if (
        (fieldName === "ext3" || fieldName === "flo") &&
        (initialValues["type"] === "url" || initialValues["type"] === "iframe")
      ) {
        if (!val) {
          initialValues["flo"] = "";
        }
        if (fieldName === "flo") {
          initialValues["default"] = initialValues["default"].concat(
            `{${val}}`,
          );
        }
        setInitialValues({ ...initialValues, [fieldName]: val });
      } else if (fieldName === "name" && !isEmpty(val)) {
        initialValues["label"] = `LBL_${val.toUpperCase().replace(/ /g, "_")}`;
        initialValues[fieldName] = val;
        setInitialValues({ ...initialValues });
      } else if (fieldName === "options") {
        if (
          initialValues["type"] === "enum" ||
          initialValues["type"] === "dynamicenum" ||
          initialValues["type"] === "radioenum" ||
          initialValues["type"] === "multienum"
        ) {
          handleUpdateDefaultOptions(val);
        }
        initialValues[fieldName] = val;
        setInitialValues({ ...initialValues });
      } else if (fieldName === "maxLen") {
        if (val != "custom") {
          setLayout((v) => {
            v.map((field, index) => {
              if (field.name === "len") {
                v[index]["type"] = "hidden";
              }
            });
            return v;
          });
          setInitialValues({ ...initialValues, [fieldName]: val, len: val });
        } else {
          setLayout((v) => {
            v.map((field, index) => {
              if (field.name === "len") {
                v[index]["type"] = "varchar";
              }
            });
            return v;
          });
          setInitialValues({ ...initialValues, [fieldName]: val, len: "" });
        }
      } else {
        initialValues[fieldName] = val;
        setInitialValues(initialValues);
      }
    }
  };
  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getDropDownList = async () => {
    const res = await api.get(`V8/studio/getDropdownList`);
    if (res.ok) {
      let tempData = {};
      res.data.data.map((item) => {
        tempData[item] = { label: item, name: item };
      });
      setDropdownList(tempData);
    }
  };

  const handleSubmit = async () => {
    if (!isEmpty(initialValues["name"])) {
      const fieldName = initialValues["name"].trim();
      initialValues["name"] = initialValues["name"].trim().toLowerCase();
      if (view == "addField") {
        if (fieldData.field_name_exceptions.includes(fieldName.toUpperCase())) {
          errors["name"] = LBL_INVALID_FIELD_NAME;
        } else if (fieldName.includes(" ")) {
          errors["name"] = LBL_INVALID_FIELD;
        } else {
          delete errors["name"];
        }
        tabViewData?.fieldsData.map((field) => {
          if (
            (field.name === `${initialValues["name"].trim()}_c` ||
              field.name === initialValues["name"].trim() ||
              field.labelValue === initialValues["labelValue"].trim()) &&
            (isEmpty(errors["name"]) || isNil(errors["name"]))
          ) {
            errors["name"] = LBL_DUPLICATE_FIELD;
          }
        });
      }
      if (isEmpty(initialValues["labelValue"])) {
        initialValues["labelValue"] = capitalizeFirstLetter(
          fieldName.replace(/_/g, " "),
        );
        setInitialValues({ ...initialValues });
      }
      if (isEmpty(initialValues["label"])) {
        setInitialValues({
          ...initialValues,
          label: `LBL_${fieldName.toUpperCase().replace(/ /g, "_")}`,
        });
      }
    }
    fieldData.layout.map((field) => {
      if (initialValues["type"] === "relate" && field.name === "ext2") {
        initialValues["ext3"] = field.id_name ?? "";
      }
      if (initialValues["type"] === "address" && field.name === "len") {
        initialValues["orig_len"] = initialValues["len"] ?? "";
      }
      if (
        (initialValues["type"] === "iframe" ||
          initialValues["type"] === "url") &&
        field.name === "ext3"
      ) {
        initialValues["genCheck"] = 0;
      }
      setInitialValues({ ...initialValues });
      if (field.required && isEmpty(initialValues[field.name])) {
        errors[field.name] = LBL_REQUIRED_FIELD;
      }
    });
    if (!isEmpty(initialValues["len"]) && initialValues["len"]) {
      if (
        !/^[+-]?[0-9]*$/.test(parseInt(initialValues["len"])) ||
        initialValues["len"] > 255 ||
        initialValues["len"] < 8
      ) {
        errors["len"] = LBL_INVALID_MAX_SIZE;
      } else {
        delete errors["default"];
        delete errors["len"];
      }
    }
    if (
      initialValues["type"] === "float" ||
      initialValues["type"] === "decimal"
    ) {
      if (
        !isValidPrecision(
          initialValues["default"],
          initialValues["precision"],
          globalPreference?.dec_sep,
          globalPreference?.num_grp_sep,
        )
      ) {
        errors["default"] = LBL_PRECISION_ERROR;
      } else {
        delete errors["default"];
      }
    }
    if (initialValues["type"] === "int") {
      const fieldsToCheck = ["default", "min", "max", "len"];
      const regex = /^\d+$/;
      fieldsToCheck.map((field) => {
        if (
          !(isEmpty(initialValues[field]) || isNil(initialValues[field])) &&
          !regex.test(initialValues[field])
        ) {
          errors[field] = LBL_INVALID_NUMBER_ERROR;
        } else {
          delete errors[field];
        }
      });
    }

    setErrors({ ...errors });

    if (initialValues?.inline_edit) {
      initialValues["inline_edit"] = 1;
    } else {
      initialValues["inline_edit"] = "";
    }

    if (isEmpty(errors)) {
      setFormSubmitLoading(true);
      const payload = {
        module: module,
        field: view != "addField" ? view : "",
        type: initialValues["type"],
        field_data: initialValues,
        is_field_update: view === "addField" ? false : true,
        view_package: "",
        is_custom: fieldData["is_custom"].toString(),
      };
      const res = await api
        .post(`V8/studio/createModuleField`, payload)
        .then((res) => {
          if (res) {
            if (res?.ok && res?.data?.data?.success) {
              dispatch(getTabView(module, manager));
              if (view === "addField") {
                history.push(
                  `/app/studio/${module}/${manager}/${initialValues["name"]}_c`,
                );
              }
            }
            toast(
              pathOr(SOMETHING_WENT_WRONG, ["data", "data", "message"], res),
            );
            setFormSubmitLoading(false);
          }
        });
    }
  };
  const handleDeleteField = async (data) => {
    setDeleteLoading(true);
    const payload = {
      module: module,
      field: isEmpty(data["name"]) ? view : data["name"],
      type: data["type"],
      field_data: {
        name: data["name"],
        labelValue: data["labelValue"],
        label: data["label"],
      },
      view_package: "",
    };
    const res = await api.delete(`V8/studio/deleteModuleField`, payload);
    if (res) {
      if (res?.data?.data?.success) {
        history.push(`/app/studio/${module}/${manager}/addField`);
        dispatch(getTabView(module, manager));
      }
      setOpenDeletePopup(false);
      toast(pathOr(SOMETHING_WENT_WRONG, ["data", "data", "message"], res));
      setDeleteLoading(false);
    }
  };
  const onBlur = () => {
    if (!isEmpty(initialValues["name"])) {
      const fieldName = initialValues["name"].trim();
      if (view == "addField") {
        if (fieldName.includes(" ")) {
          errors["name"] = LBL_INVALID_FIELD;
          setErrors({ ...errors });
        } else if (
          fieldData.field_name_exceptions.includes(fieldName.toUpperCase())
        ) {
          errors["name"] = LBL_INVALID_FIELD_NAME;
          setErrors({ ...errors });
        } else {
          delete errors["name"];
          setErrors({ ...errors });
        }
      }
      if (isEmpty(initialValues["labelValue"])) {
        initialValues["labelValue"] = capitalizeFirstLetter(
          fieldName.replace(/_/g, " "),
        );
        setInitialValues({ ...initialValues });
      }
      if (isEmpty(initialValues["label"])) {
        initialValues["label"] = `LBL_${fieldName
          .toUpperCase()
          .replace(/ /g, "_")}`;
        setInitialValues({ ...initialValues });
      }
    }
  };

  const handleUpdateDropdownList = (dropdown) => {
    let tempLayout = [];
    layout.map((field, index) => {
      if (field.field_key == "options") {
        field["options"] = { [dropdown]: dropdown, ...field["options"] };
        initialValues["options"] = dropdown;
      }
      if (field.field_key == "default") {
        handleUpdateDefaultOptions(dropdown);
      }
      tempLayout.push(field);
    });
    setLayout(tempLayout);
  };

  useEffect(() => {
    setLayout(pathOr([], ["layout"], fieldData));
  }, [fieldData]);

  useEffect(() => {
    console.log("iresrdfghj", fieldData);
    handleGetFieldData({
      module: module,
      field: view != "addField" ? view : "",
      type: "varchar",
      is_custom: fieldData["is_custom"] == true ? 1 : 0,
    });
  }, [view]);

  useEffect(() => {
    getDropDownList();
  }, [action]);
  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");

  return (
    <>
      <AlertDialog
        msg={LBL_DELETE_FIELD_MSG}
        content={
          fieldData?.is_bpm_applied || deleteFieldData?.is_bpm_applied ? (
            <Typography color="error" variant="subtitle2">
              {LBL_DELETE_FIELD_BPM_CONTENT}
            </Typography>
          ) : (
            ""
          )
        }
        title={LBL_WARNING_TITLE}
        onAgree={() => handleDeleteField(deleteFieldData)}
        loading={deleteLoading}
        agreeText={
          deleteLoading
            ? LBL_DELETE_INPROGRESS
            : LBL_CONFIRM_DELETE_BUTTON_TITLE
        }
        handleClose={() => setOpenDeletePopup(false)}
        open={openDeletePopup}
      />
      <Grid container lg={12} md={12} sm={12}>
        <Grid item lg={3} md={4} sm={4} className={classes.divider}>
          <CustomList
            placeHolder={LBL_SEARCH_FIELD_PLACEHOLDER}
            data={tabViewData?.fieldsData ? tabViewData?.fieldsData : []}
            fieldList={true}
            addTitle={LBL_ADD_FIELD}
            handleGetData={(field) =>
              history.push(
                `/app/studio/${module}/${manager}/${
                  field ? field : "addField"
                }`,
              )
            }
            handleDelete={(val) => handleOpenPopup(val)}
            deleteLoading={deleteLoading}
          />
        </Grid>
        <Grid item lg={9} md={8} sm={8} className={classes.spaceAround}>
          {view ? (
            <Grid container lg={12} md={12} sm={12}>
              <Grid
                item
                lg={action ? 6 : 12}
                md={12}
                sm={12}
                style={{ padding: "4px" }}
              >
                <FieldEditView
                  fieldData={fieldData}
                  fieldDataLoading={fieldDataLoading}
                  initialValues={initialValues}
                  handleFieldChange={handleFieldChange}
                  handleOptionDisplay={handleOptionDisplay}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  formSubmitLoading={formSubmitLoading}
                  deleteLoading={deleteLoading}
                  handleOpenPopup={handleOpenPopup}
                  onBlur={onBlur}
                  layout={layout}
                  action={action}
                  isTabMd={isTabMd}
                  isTabSm={isTabSm}
                />
              </Grid>
              {action && (
                <Grid item lg={6} md={12} sm={12} style={{ padding: "4px" }}>
                  <EditOptionView
                    fieldName={initialValues["name"]}
                    selectedDropdown={initialValues["options"]}
                    handleUpdateDropdownList={handleUpdateDropdownList}
                    handleUpdateDefaultOptions={handleUpdateDefaultOptions}
                    dropdownList={dropdownList}
                  />
                </Grid>
              )}
            </Grid>
          ) : (
            <DefaultAddView
              title={LBL_ADD_FIELD}
              onAddClick={() =>
                history.push(`/app/studio/${module}/${manager}/addField`)
              }
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default FieldManager;

export const FieldEditView = (props) => {
  const {
    fieldData,
    fieldDataLoading,
    initialValues,
    handleFieldChange,
    handleOptionDisplay,
    handleSubmit,
    formSubmitLoading,
    errors,
    deleteLoading,
    handleOpenPopup,
    onBlur,
    layout = [],
    action,
    isTabMd,
    isTabSm,
  } = props;
  const classes = useStyles();
  const { view } = useParams();
  const renderFields = (field) => {
    if (
      ((initialValues["type"] === "url" ||
        initialValues["type"] === "iframe") &&
        field.name === "flo" &&
        (!initialValues["ext3"] ||
          isEmpty(initialValues["ext3"]) ||
          isNil(initialValues["ext3"]))) ||
      field.type === "hidden"
    ) {
      return;
    }
    return (
      <Grid container lg={12} md={12} sm={12} spacing={2}>
        <Grid item lg={4} md={4} sm={4} className={classes.subText}>
          {`${field.label}:`}
        </Grid>
        <Grid item lg={8} md={8} sm={8}>
          <FormInput
            field={field}
            value={initialValues[field.name]}
            onChange={(val) => {
              handleFieldChange(val, field.name);
            }}
            onBlur={onBlur}
            label={field.label}
            required={field.required}
            disabled={field.disabled}
            displayLabel={false}
            small={true}
            errors={errors}
            isSearchEnumDisabled={true}
          />
          {field.name === "options" && (
            <Grid container spacing={1} direction="row" className={classes.btn}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleOptionDisplay("addOptions")}
                >
                  {LBL_ADD_OPTION}
                </Button>
              </Grid>
              {initialValues["options"] && (
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleOptionDisplay(initialValues["options"])
                    }
                  >
                    {LBL_EDIT_OPTION}
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  };

  if (isEmpty(layout) && fieldDataLoading) {
    return <Skeleton layout={"Studio"} />;
  }
  return (
    <Grid
      container
      lg={12}
      md={12}
      sm={12}
      direction="row"
      spacing={2}
      className={classes.borderBox}
      style={{ border: "1px solid #dedede" }}
    >
      <Grid item lg={12} md={12} sm={12} className={classes.heading}>
        {fieldData.title}
      </Grid>
      <Grid
        item
        lg={12}
        md={12}
        sm={12}
        className={classes.scroll}
        style={{ height: (isTabMd || isTabSm) && action ? "30vh" : "" }}
      >
        {layout.map((field) => {
          return fieldDataLoading ? (
            <Skeleton layout={"StudioFields"} height={40} />
          ) : (
            renderFields(field)
          );
        })}
      </Grid>
      <div
        className={classes.bottomActions}>
        <div className={classes.infoContainer} >
          <InfoIcon color="action" className={classes.infoIcon} />
          <Typography color="textSecondary" variant="caption" className={classes.infoText}>
            {LBL_SAVE_FIELD_WARNING}
          </Typography>
        </div>
        {/* <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<FilterNoneIcon />}
          >
            {LBL_CLONE_BUTTON_TITLE}
          </Button>
        </Grid> */}

        <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          {view != "addField" && fieldData?.is_custom && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={
                deleteLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <DeleteOutlineIcon />
                )
              }
              disabled={deleteLoading}
              onClick={() => handleOpenPopup(initialValues)}
            >
              {deleteLoading ? LBL_DELETE_INPROGRESS : LBL_DELETE_BUTTON_TITLE}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={formSubmitLoading}
            startIcon={
              formSubmitLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
            onClick={() => handleSubmit()}
          >
            {formSubmitLoading ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE}
          </Button>
        </div>
      </div>
    </Grid >
  );
};
