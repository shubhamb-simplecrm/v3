import React, { useEffect } from "react";
import { useState } from "react";
import useStyles from "./styles";
import {
  LBL_ADD,
  LBL_CANCEL_BUTTON_TITLE,
  LBL_DUPLICATE_DROPDOWN,
  LBL_DUPLICATE_KEY,
  LBL_INVALID_OPTION_NAME,
  LBL_MANAGE_OPTIONS,
  LBL_OPTION_LIST,
  LBL_RESTORE_DEFAULT_BUTTON_TITLE,
  LBL_SAVE_BUTTON_TITLE,
  LBL_SAVE_INPROGRESS,
  LBL_SORT_ASC,
  LBL_SORT_DSC,
  SOMETHING_WENT_WRONG,
} from "@/constant";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Tooltip,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import { FormInput } from "@/components";
import OptionColumnChooser from "./components/OptionColumnChooser";
import { api } from "@/common/api-utils";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import { isNil, pathOr, isEmpty } from "ramda";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const EditOptionView = (props) => {
  const {
    fieldName = "",
    handleUpdateDropdownList = null,
    handleUpdateDefaultOptions = null,
    selectedDropdown = "",
    dropdownList = {},
  } = props;

  const classes = useStyles();
  const history = useHistory();
  const isTabMd = useIsMobileView("md");
  const { module, view, manager, action, dropdown } = useParams();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [listTitle, setListTitle] = useState(
    view != "addField" ? `${view ?? ""}_list` : `${fieldName ?? ""}_list`,
  );
  const [optionList, setOptionList] = useState([]);

  const handleGetOptions = async () => {
    const payload = {
      module: module,
      view_package: "",
      dropdown_name: action
        ? action != "addOptions"
          ? action
          : ""
        : dropdown === "addDropdown"
          ? ""
          : dropdown,
      field: action != "addOptions" ? view : "",
    };
    const res = await api.get(`V8/studio/getDropdown`, payload);
    if (res.ok) {
      setOptionList(res.data.data.options);
    }
  };

  const handleSubmit = async () => {
    if (
      Object.keys(dropdownList).includes(listTitle) &&
      (action == "addOptions" || dropdown == "addDropdown")
    ) {
      setTitleError(LBL_DUPLICATE_DROPDOWN);
    } else {
      setFormSubmitLoading(true);
      setTitleError("");
      const payload = {
        module: module,
        view_package: "studio",
        dropdown_name: !isNil(action)
          ? action != "addOptions"
            ? action
            : listTitle
          : dropdown != "addDropdown"
            ? dropdown
            : listTitle,
        field: view != "addField" ? view : "",
        options: optionList,
      };
      const res = await api.post(`V8/studio/saveDropdown`, payload);
      if (res) {
        if (action) {
          if (action == "addOptions") {
            handleUpdateDropdownList(listTitle);
          } else if (action === selectedDropdown) {
            handleUpdateDefaultOptions(action);
          }
        } else {
          history.push(`/app/dropdownEditor/${listTitle}`);
        }
        toast(pathOr(SOMETHING_WENT_WRONG, ["data", "data", "message"], res));
        setFormSubmitLoading(false);
      }
    }
  };

  return (
    <Grid container direction="column" className={classes.borderBox}>
      <Grid item className={classes.heading}>
        {LBL_MANAGE_OPTIONS}
      </Grid>
      <Grid
        item
        className={classes.outerGrid}
        style={{
          height: isTabMd ? "30vh" : "72vh",
          overflow: "scroll",
        }}
      >
        <span className={classes.name}>Name:</span>
        {action === "addOptions" || dropdown === "addDropdown" ? (
          <TextField
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            className={classes.nameField}
            helperText={titleError}
            error={!isEmpty(titleError)}
          />
        ) : action ? (
          action
        ) : (
          dropdown
        )}
        <ManageOptions
          handleGetOptions={handleGetOptions}
          optionList={optionList}
          setOptionList={setOptionList}
        />
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="flex-end"
          className={classes.actionButtions}
          style={{ position: "sticky", bottom: "0" }}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() =>
                action
                  ? history.push(`/app/studio/${module}/${manager}/${view}`)
                  : history.push(`/app/dropdownEditor/`)
              }
            >
              {LBL_CANCEL_BUTTON_TITLE}
            </Button>
          </Grid>
          {action != "addOptions" && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SettingsBackupRestoreIcon />}
                onClick={() => handleGetOptions()}
              >
                {LBL_RESTORE_DEFAULT_BUTTON_TITLE}
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={formSubmitLoading}
              startIcon={
                formSubmitLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={() => handleSubmit()}
            >
              {formSubmitLoading ? LBL_SAVE_INPROGRESS : LBL_SAVE_BUTTON_TITLE}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default EditOptionView;

export const ManageOptions = ({
  handleGetOptions,
  optionList,
  setOptionList,
}) => {
  const classes = useStyles();
  const { action, dropdown } = useParams();
  const [isEditLabel, setIsEditLabel] = useState([]);
  const [errors, setErrors] = useState({});
  const [addOptionValues, setAddOptionValues] = useState({
    optionName: "",
    optionLabel: "",
  });
  const addFieldsArr = [
    {
      field_key: "optionName",
      name: "optionName",
      label: "Option Name:",
      type: "varchar",
      required: true,
      value: "",
    },
    {
      field_key: "optionLabel",
      name: "optionLabel",
      label: "Option Label:",
      type: "varchar",
      required: true,
      value: "",
    },
  ];
  const handleAddOption = () => {
    let optionKeyArr = [];
    optionList.map((option) => {
      optionKeyArr.push(option["optionName"]);
    });

    //error state managed for various conditions
    const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (
      !isEmpty(addOptionValues["optionName"]) &&
      !regex.test(addOptionValues["optionName"])
    ) {
      errors["optionName"] = LBL_INVALID_OPTION_NAME;
      setErrors({ ...errors });
    } else if (optionKeyArr.includes(addOptionValues["optionName"])) {
      errors["optionName"] = LBL_DUPLICATE_KEY;
      setErrors({ ...errors });
    } else {
      delete errors["optionName"];
      setErrors({ ...errors });
    }

    if (isEmpty(errors)) {
      setOptionList([addOptionValues, ...optionList]);
      setAddOptionValues({
        optionName: "",
        optionLabel: "",
      });
    }
  };
  const onChange = (val, field) => {
    setAddOptionValues({ ...addOptionValues, [field]: val.trim() });
  };
  const onLabelChange = (val, index) => {
    optionList[index]["optionLabel"] = val;
    setOptionList([...optionList]);
  };
  const handleDeleteOption = (index) => {
    optionList.splice(index, 1);
    setOptionList([...optionList]);
  };
  const handleSaveLabel = (optionName, index) => {
    isEditLabel.map((name, i) => {
      if (name == optionName) {
        isEditLabel.splice(i, 1);
        setIsEditLabel([...isEditLabel]);
      }
    });
  };
  const handleSortOption = (type) => {
    optionList.sort((a, b) => {
      const nameA = a.optionLabel.toLowerCase();
      const nameB = b.optionLabel.toLowerCase();
      if (type === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    setOptionList([...optionList]);
  };
  useEffect(() => {
    handleGetOptions();
  }, [action, dropdown]);

  return (
    <>
      <Grid
        lg={12}
        md={12}
        sm={12}
        xs={12}
        container
        spacing={1}
        style={{ paddingTop: "15px" }}
      >
        {addFieldsArr.map((field) => (
          <Grid item lg={5} md={5} sm={5} xs={5}>
            <FormInput
              field={field}
              value={addOptionValues[field.name]}
              onChange={(val) => {
                onChange(val, field.name);
              }}
              errors={errors}
              label={field.label}
              required={field.required}
              displayLabel={false}
              small={true}
            />
          </Grid>
        ))}
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleAddOption()}
          >
            {LBL_ADD}
          </Button>
        </Grid>
      </Grid>
      {!isEmpty(optionList) && (
        <Box className={classes.optionList}>
          <Grid container justifyContent="space-between" direction="row">
            <Grid item className={classes.optionListTitle}>
              {LBL_OPTION_LIST}
            </Grid>
            <Grid item className={classes.sort}>
              <Tooltip title={LBL_SORT_ASC}>
                <ArrowDownwardIcon
                  onClick={() => handleSortOption("asc")}
                  color="primary"
                  className={classes.sortIcon}
                />
              </Tooltip>
              <Tooltip title={LBL_SORT_DSC}>
                <ArrowUpwardIcon
                  className={classes.sortIcon}
                  color="primary"
                  onClick={() => handleSortOption("des")}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <div className={classes.optionBox}>
            <OptionColumnChooser
              list={optionList}
              setList={setOptionList}
              setIsEditLabel={setIsEditLabel}
              handleSaveLabel={handleSaveLabel}
              handleDeleteOption={handleDeleteOption}
              onLabelChange={onLabelChange}
              isEditLabel={isEditLabel}
            />
          </div>
        </Box>
      )}
    </>
  );
};
