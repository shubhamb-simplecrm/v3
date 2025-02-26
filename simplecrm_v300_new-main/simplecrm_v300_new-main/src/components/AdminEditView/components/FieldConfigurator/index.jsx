import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isEmpty, isNil, pathOr } from "ramda";
import { Paper } from "@material-ui/core";
import { LBL_REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../constant";
import {
  saveConfigureData,
  getEditLayout,
  getPortalAdminModuleList,
} from "../../../../store/actions/portalAdmin.actions";
import { ErrorBoundary, Skeleton } from "../../..";
import { toast } from "react-toastify";
import "./styles.css";
import FieldListEditView from "./FieldListEditView";
import { tabpanels } from "./metaData";

const FieldConfigurator = () => {
  const dispatch = useDispatch();
  const { section, module, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [moduleFields, setModuleFields] = useState([]);
  let [editLayout, setEditLayout] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(0);
  const defaultQuery = { combinator: "and", rules: [] };
  const [query, setQuery] = useState(defaultQuery);
  const [initialQuery, setInitialQuery] = useState(defaultQuery);
  let [initialValues, setInitialValues] = useState({});

  const getEditViewLayout = useCallback(() => {
    setLoading(true);
    const payload = {
      data: { category: [section], module: module, field: id, type: value },
    };
    dispatch(getEditLayout(payload)).then((res) => {
      dispatch(getPortalAdminModuleList(section, module)).then((resFields) => {
        setModuleFields(
          pathOr([], ["data", "templateMeta", "data"], resFields),
        );
        let tempValues = {};
        const newLayout = pathOr([], ["data", "templateMeta"], res);
        newLayout[value].map((row) => {
          row.map((field) => {
            tempValues[field.field_key] = field.value;
          });
        });
        const queryData = pathOr(
          { combinator: "and", rules: [] },
          ["data", "fileData", "conditionGroup"],
          res,
        );
        const fileData = pathOr({}, ["data", "fileData"], res);
        Object.entries(fileData).map(([field, value]) => {
          tempValues[field] = value;
        });
        tempValues = {
          ...tempValues,
          module: module,
          field: id,
          type: pathOr("visible", [value, "tab"], tabpanels),
          priorValues: tempValues["duplicate_config"],
        };
        setInitialValues(tempValues);
        setEditLayout(newLayout);
        setQuery(queryData);
        setInitialQuery(queryData);
        setLoading(false);
      });
    });
  }, [value]);

  const handleFieldChange = (field, val) => {
    initialValues[field.name] = val;
    setInitialValues({ ...initialValues });
  };

  const validateForm = (query, isDelete = false) => {
    if (isDelete) {
      setErrors({});
    } else {
      editLayout[value].map((fields) => {
        fields.map((field, index) => {
          if (value < 4 && query?.rules?.length === 0) {
            errors["query"] = LBL_REQUIRED_FIELD;
          } else {
            delete errors[field.name];
          }
          if (field.required) {
            if (
              isEmpty(initialValues[field.name]) ||
              isNil(initialValues[field.name])
            ) {
              errors[field.name] = LBL_REQUIRED_FIELD;
            } else {
              delete errors[field.name];
            }
            setErrors({ ...errors });
          }
        });
      });
    }
  };
  const handleSubmit = (event, isDelete = false) => {
    event.preventDefault();
    setFormLoading(true);
    try {
      const initialState = { ...initialValues };
      initialState["query"] = query;
      initialState["type"] = pathOr("visible", [value, "tab"], tabpanels);
      if (initialState.type != "masking" && initialState.type != "validation") {
        Object.keys(initialState).map((item) => {
          if (item.startsWith("validation") && item.startsWith("masked")) {
            delete initialState[item];
          }
        });
      }
      if (initialState.query.rules.length === 0) {
        initialState["views"] = [];
      }
      if (isDelete) {
        initialState["views"] = [];
        initialState["validation_view"] = [];
        initialState["duplicate_config"] = [];
        initialState["masked_view"] = [];
        initialState["validation_regExp"] = "";
        initialState["validation_message"] = "";
        initialState["masked_pattern"] = "";
        initialState["query"] = defaultQuery;
      }
      if (isEmpty(errors)) {
        dispatch(saveConfigureData({ data: initialState })).then(
          function (res) {
            initialValues["priorValues"] = initialValues["duplicate_config"];
            toast.success(res.data, {
              className: "toast-message",
            });
            setFormLoading(false);
            if (isDelete) {
              getEditViewLayout();
            }
          },
        );
      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
      setFormLoading(false);
    }
  };

  useEffect(() => {
    setErrors({});
    getEditViewLayout();
  }, [value]);

  if (loading && (isEmpty(editLayout) || isNil(editLayout)))
    return <Skeleton />;

  if (!isEmpty(editLayout) && !isNil(editLayout))
    return (
      <ErrorBoundary>
        <Paper style={{ height: "100vh", padding: "0px 10px" }}>
          <FieldListEditView
            moduleFields={moduleFields}
            initialValues={initialValues}
            setInitialValues={setInitialValues}
            handleSubmit={handleSubmit}
            handleFieldChange={handleFieldChange}
            formLoading={formLoading}
            query={query}
            loading={loading}
            setQuery={setQuery}
            initialQuery={initialQuery}
            setValue={setValue}
            value={value}
            errors={errors}
            editLayout={editLayout}
            validateForm={validateForm}
          />
        </Paper>
      </ErrorBoundary>
    );
};

export default FieldConfigurator;
