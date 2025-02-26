import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Tooltip,
} from "@material-ui/core";
import { FormInput, Skeleton } from "@/components";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import { truncate } from "./../../../../common/utils";
import HeightRoundedIcon from "@material-ui/icons/HeightRounded";
import ArrowRightAltRoundedIcon from "@material-ui/icons/ArrowRightAltRounded";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import {
  LBL_ADD_RELATIONSHIP,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SEARCH_RELATIONSHIP_PLACEHOLDER,
  LBL_EDIT_RELATIONSHIP,
  LBL_DELETE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
  LBL_DELETE_RELATIONSHIP_MSG,
  LBL_WARNING_TITLE,
  LBL_REMOVE_TABLES,
  LBL_DELETE_INPROGRESS,
  LBL_CONFIRM_DELETE_BUTTON_TITLE,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import DeleteIcon from "@material-ui/icons/Delete";
import useStyles from "./styles";
import { CustomHeader } from "../CustomList";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getRelationshipData,
  getTabView,
  setSelectedParameter,
} from "@/store/actions/studio.actions";
import DefaultAddView from "../../DefaultAddView";
import { isEmpty, isNil, pathOr } from "ramda";
import clsx from "clsx";
import { api } from "@/common/api-utils";
import { toast } from "react-toastify";
import AlertDialog from "@/components/Alert";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";

const RelationshipManager = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { module, manager, view } = useParams();
  const relViewData = useSelector((state) => state.studio?.relViewData);
  const [listData, setListData] = useState(relViewData?.relationshipList);
  const [fieldData, setFieldData] = useState([]);
  const [fieldDataLoading, setFieldDataLoading] = useState(null);
  const [onChangeFieldsLoading, setOnChangeFieldsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const handleSearchedData = (searchedData) => {
    setListData(searchedData);
  };
  const handleGetFieldData = (params, isOnChange = false) => {
    if (isOnChange) {
      setOnChangeFieldsLoading(true);
    } else {
      setFieldDataLoading(true);
    }
    history.push(
      `/app/studio/${module}/${manager}/${
        !isEmpty(params.relationship_name)
          ? params.relationship_name
          : "addRelationship"
      }`,
    );
    dispatch(
      setSelectedParameter(
        !isEmpty(params.relationship_name)
          ? LBL_EDIT_RELATIONSHIP
          : LBL_ADD_RELATIONSHIP,
      ),
    );
    dispatch(getRelationshipData(params)).then((response) => {
      if (response.ok) {
        setFieldData(response.data.data);
        Object.entries(response.data.data.layout).map(([key, field]) => {
          if (key != "moduleData") {
            initialValues[field.name] = field.value;
          } else {
            Object.values(field).map((data) => {
              Object.values(data.fields).map((nestedfield) => {
                initialValues[nestedfield.name] = nestedfield.value;
              });
            });
          }
        });
        setInitialValues({ ...initialValues });
        if (isOnChange) {
          setOnChangeFieldsLoading(false);
        } else {
          setFieldDataLoading(false);
        }
      } else {
        if (isOnChange) {
          setOnChangeFieldsLoading(false);
        } else {
          setFieldDataLoading(false);
        }
      }
    });
  };

  const handleFieldChange = (val, fieldName) => {
    if (fieldName === "relationship_type") {
      setInitialValues({});
      handleGetFieldData(
        {
          module: module,
          relationship_name: "",
          relationship_type: val,
          rhs_module: initialValues["rhs_module"],
        },
        true,
      );
    } else if (fieldName === "rhs_module") {
      setInitialValues({});
      handleGetFieldData(
        {
          module: module,
          relationship_name: "",
          relationship_type: initialValues["relationship_type"],
          rhs_module: val,
        },
        true,
      );
    } else {
      setInitialValues({ ...initialValues, [fieldName]: val });
    }
  };

  useEffect(() => {
    handleGetFieldData({
      module: module,
      relationship_name: view === "addRelationship" ? "" : view,
    });
  }, []);

  return (
    <Grid
      container
      direction="row"
      lg={12}
      md={12}
      sm={12}
      spacing={2}
      className={classes.outerGrid}
    >
      <Grid item lg={3} md={3} sm={3}className={classes.border}>
        {/* <CustomHeader
            placeHolder={LBL_SEARCH_RELATIONSHIP_PLACEHOLDER}
            tooltip={LBL_ADD_RELATIONSHIP}
            data={relViewData?.relationshipList}
            fieldList={true}
            addTitle={LBL_ADD_RELATIONSHIP}
            handleGetData={() =>
              handleGetFieldData({
                module: module,
                relationship_name: "",
              })
            }
            handleSearchedData={handleSearchedData}
          /> */}
        <Button
          variant="outlined"
          onClick={() =>
            handleGetFieldData({
              module: module,
              relationship_name: "",
            })
          }
          startIcon={<AddIcon />}
          color="primary"
          className={classes.addButton}
        >
          Add Relationship
        </Button>
        <RelationshipList
          relationshipData={listData}
          handleGetFieldData={handleGetFieldData}
        />
      </Grid>
      <Grid item className={classes.leftBorder} lg={9} md={9} sm={9}>
        {view && !isEmpty(fieldData) ? (
          <RelationshipEditView
            fieldData={fieldData}
            fieldDataLoading={fieldDataLoading}
            onChangeFieldsLoading={onChangeFieldsLoading}
            initialValues={initialValues}
            handleFieldChange={handleFieldChange}
          />
        ) : (
          <DefaultAddView
            title={LBL_ADD_RELATIONSHIP}
            onAddClick={() =>
              handleGetFieldData({
                module: module,
                relationship_name: "",
              })
            }
          />
        )}
      </Grid>
    </Grid>
  );
};

export default RelationshipManager;

export const RelationshipList = (props) => {
  const { relationshipData, handleGetFieldData } = props;
  const classes = useStyles();
  const { module, view } = useParams();
  return (
    <Grid container className={classes.scroll} spacing={1}>
      {relationshipData?.map((relationship) => {
        return (
          <Grid item lg={6} md={12} sm={12}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className={clsx(classes.listBox, {
                [classes.highlightedlistBox]:
                  view === relationship.relationship_name,
              })}
              onClick={() =>
                handleGetFieldData({
                  module: module,
                  relationship_name: relationship.relationship_name,
                })
              }
            >
              <Tooltip title={relationship.module}>
                <Grid item className={classes.moduleName}>
                  {truncate(relationship.module, 15)}
                  {relationship.is_custom ? " *" : ""}
                </Grid>
              </Tooltip>
              <Grid item>
                <div
                  className={classes.relationshipType}
                >{`(${relationship.relationship_type})`}</div>
              </Grid>
              <Grid item className={classes.outerGrid}>
                <div className={classes.icon}>
                  {relationship.relationship_type === "One to Many" ? (
                    <ArrowRightAltRoundedIcon className={classes.arrowIcon} />
                  ) : relationship.relationship_type === "Many to Many" ? (
                    <HeightRoundedIcon className={classes.roundedIcon} />
                  ) : (
                    <ImportExportIcon className={classes.roundedIcon} />
                  )}
                </div>
              </Grid>
              <Tooltip title={relationship.relatedModule}>
                <Grid item className={classes.font}>
                  {truncate(relationship.relatedModule, 15)}
                  {relationship.is_custom ? " *" : ""}
                </Grid>
              </Tooltip>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export const RelationshipEditView = (props) => {
  const {
    fieldData,
    fieldDataLoading,
    initialValues,
    handleFieldChange,
    onChangeFieldsLoading,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { module, manager, view } = useParams();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [removeTables, setRemoveTables] = useState(true);
  const [errors, setErrors] = useState({});

  const fieldLayout = pathOr({}, ["layout"], fieldData);

  const handleSubmit = async () => {
    if (
      isEmpty(initialValues["rhs_module"]) ||
      isNil(initialValues["rhs_module"])
    ) {
      errors["rhs_module"] = LBL_REQUIRED_FIELD;
    }
    if (
      isEmpty(initialValues["lhs_module"]) ||
      isNil(initialValues["lhs_module"])
    ) {
      errors["lhs_module"] = LBL_REQUIRED_FIELD;
    }
    setErrors({ ...errors });
    if (isEmpty(errors)) {
      setFormSubmitLoading(true);
      let payload = {
        module: module,
        view_package: "",
        relationshipData: {
          ...initialValues,
          relationship_lang: "en_us",
          relationship_name: view === "addRelationship" ? "" : view,
        },
      };
      let res = null;
      try {
        if (view === "addRelationship") {
          res = await api.post(`/V8/studio/createRelationship`, payload);
        } else {
          res = await api.post(`/V8/studio/saveRelationship`, payload);
        }
        if (res && res.ok) {
          toast(res.data.data.message);
          setFormSubmitLoading(false);
          if (view === "addRelationship") {
            dispatch(getTabView(module, manager));
          }
        }
      } catch (e) {
        setFormSubmitLoading(false);
        toast(SOMETHING_WENT_WRONG);
      }
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    let payload = {
      module: module,
      view_package: "",
      relationshipData: {
        ...initialValues,
        relationship_lang: "en_us",
        relationship_name: view,
        remove_tables: !removeTables,
      },
    };
    try {
      const res = await api.post(`/V8/studio/deleteRelationship`, payload);
      if (res && res.ok) {
        history.push(`/app/studio/${module}/${manager}`);
        setDeleteLoading(false);
        toast(res.data.data.message);
        setOpenDeletePopup(false);
        dispatch(getTabView(module, manager));
        dispatch(
          setSelectedParameter({
            name: null,
            label: null,
          }),
        );
      } else {
        setDeleteLoading(false);
        setOpenDeletePopup(false);
        toast(SOMETHING_WENT_WRONG);
      }
    } catch (e) {
      setDeleteLoading(false);
      setOpenDeletePopup(false);
      toast(SOMETHING_WENT_WRONG);
    }
  };

  if (fieldDataLoading) {
    return <Skeleton layout={"Studio"} />;
  }

  return (
    <>
      <AlertDialog
        msg={LBL_DELETE_RELATIONSHIP_MSG}
        title={LBL_WARNING_TITLE}
        onAgree={handleDelete}
        loading={deleteLoading}
        agreeText={
          deleteLoading
            ? LBL_DELETE_INPROGRESS
            : LBL_CONFIRM_DELETE_BUTTON_TITLE
        }
        content={
          <FormControlLabel
            control={
              <Checkbox
                checked={removeTables}
                onChange={(e) => setRemoveTables(e.target.checked)}
                name={LBL_REMOVE_TABLES}
                color="primary"
              />
            }
            label={LBL_REMOVE_TABLES}
          />
        }
        handleClose={() => setOpenDeletePopup(false)}
        open={openDeletePopup}
      />
      <Grid item lg={12} className={classes.heading}>
        {fieldData?.title?.toUpperCase()}
      </Grid>
      {Object.entries(fieldLayout).map(([key, field]) => {
        return key != "moduleData" ? (
          <Grid item lg={12} className={classes.topFields}>
            <Grid
              container
              lg={12}
              direction="row"
              spacing={2}
              className={classes.topField}
              alignContent="center"
              alignItems="center"
            >
              <Grid item lg={1} className={classes.upperLabel}>
                {onChangeFieldsLoading ? (
                  <Skeleton layout={"StudioFields"} height={40} />
                ) : (
                  `${field.label}:`
                )}
              </Grid>
              <Grid item lg={4} className={classes.field}>
                {onChangeFieldsLoading ? (
                  <Skeleton layout={"StudioFields"} height={40} />
                ) : (
                  <FormInput
                    field={field}
                    value={initialValues[field.name]}
                    onChange={(val) => {
                      handleFieldChange(val, field.name);
                    }}
                    small={true}
                    label={field.label}
                    required={field.required}
                    disabled={field.disabled}
                    errors={errors}
                    isSearchEnumDisabled={true}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} className={classes.topFields}>
            {Object.values(field).map((data) => {
              return (
                <Grid item lg={6}>
                  {onChangeFieldsLoading ? (
                    <Skeleton layout={"StudioFields"} height={33} />
                  ) : (
                    <p className={classes.title}>{`${data.title}:`}</p>
                  )}
                  {Object.values(data.fields).map((field) => {
                    return (
                      <Grid
                        container
                        lg={12}
                        direction="row"
                        spacing={2}
                        className={classes.spacing}
                        alignContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Grid item lg={4} className={classes.label}>
                          {onChangeFieldsLoading ? (
                            <Skeleton layout={"StudioFields"} height={40} />
                          ) : (
                            `${field.label}:`
                          )}
                        </Grid>
                        <Grid item lg={8}>
                          {onChangeFieldsLoading ? (
                            <Skeleton layout={"StudioFields"} height={40} />
                          ) : (
                            <FormInput
                              field={field}
                              value={initialValues[field.name]}
                              onChange={(val) => {
                                handleFieldChange(val, field.name);
                              }}
                              small={true}
                              label={field.label}
                              required={field?.required}
                              disabled={field?.disabled}
                              displayLabel={false}
                              size={"small"}
                              errors={errors}
                              isSearchEnumDisabled={true}
                            />
                          )}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })}
          </Grid>
        );
      })}
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="flex-end"
        className={classes.actionButtons}
      >
        {fieldData.is_custom && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setOpenDeletePopup(true)}
              disabled={formSubmitLoading}
            >
              {LBL_DELETE_BUTTON_TITLE}
            </Button>
          </Grid>
        )}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              handleSubmit();
            }}
            disabled={formSubmitLoading}
            startIcon={
              formSubmitLoading ? <CircularProgress size={16} /> : <SaveIcon />
            }
          >
            {formSubmitLoading ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};