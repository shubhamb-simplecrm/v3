import React, { memo, useMemo, useState } from "react";
import {
  InputAdornment,
  CircularProgress,
  IconButton,
  Button,
} from "@material-ui/core";
import { Close, Search as SearchIcon } from "@material-ui/icons";
import useStyles from "./styles";
import { isEmpty, pathOr } from "ramda";
import { VARIANT, LBL_SELECT_BUTTON_LABEL } from "@/constant";
import useDebounce from "@/hooks/useDebounce";
import Tooltip from "@/components/SharedComponents/Tooltip";
import { AutoComplete } from "@/components/SharedComponents/InputComponents";
import useRelateFieldOptionFetch from "../hooks/useRelateFieldOptionFetch";

const RelateFieldInput = (props) => {
  const { customProps } = props;
  return customProps?.isIconBtn ? (
    <RelateFieldIconInput {...props} />
  ) : (
    <RelateFieldTextInput {...props} />
  );
};
const RelateFieldIconInput = memo((props) => {
  const {
    customProps,
    moduleMetaData,
    fieldState,
    variant,
    color = "",
    toggleDialogVisibility,
    size,
    fieldMetaObj,
  } = props;
  const classes = useStyles();

  const isCalendarView = moduleMetaData?.currentView === "calendar";
  const buttonLabel = customProps?.btnLabel
    ? customProps.btnLabel
    : `${LBL_SELECT_BUTTON_LABEL}${isCalendarView ? " Users" : ""}`;

  return customProps?.isSelectTypeBtn ? (
    <Tooltip title={fieldMetaObj?.comment || ""}>
      <Button
        className={classes.mobileLayoutButton}
        color={color}
        variant={variant}
        size={size}
        disabled={fieldState?.disabled}
        onClick={toggleDialogVisibility}
      >
        {customProps?.btnIcon}
        {buttonLabel}
      </Button>
    </Tooltip>
  ) : (
    <Tooltip title={fieldMetaObj?.comment || ""}>
      <IconButton
        onClick={toggleDialogVisibility}
        disabled={fieldState?.disabled}
      >
        {customProps?.btnIcon}
      </IconButton>
    </Tooltip>
  );
});

const RelateFieldTextInput = memo((props) => {
  const {
    fieldMetaObj,
    moduleMetaData,
    fieldState,
    onChange,
    onBlur,
    value,
    variant,
    toggleDialogVisibility,
  } = props;
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500);
  const fieldModuleName = useMemo(() => {
    return pathOr(
      pathOr("", ["currentModule"], moduleMetaData),
      ["module"],
      fieldMetaObj,
    );
  }, [fieldMetaObj, moduleMetaData]);

  const { loading, optionData } = useRelateFieldOptionFetch(
    isPopoverOpen,
    debouncedInputValue,
    fieldModuleName,
    fieldMetaObj,
  );

  const fieldInputValue = isPopoverOpen ? inputValue : value?.value || "";

  const handleInputChange = (_, newInputValue) => setInputValue(newInputValue);

  const handleClear = () => {
    onChange({ id: "", value: "" });
    setInputValue("");
  };
  const handleChange = (_, selectedValue) => {
    if (selectedValue) {
      onChange({
        id: selectedValue?.id || "",
        value: selectedValue?.attributes?.name || "",
      });
      setInputValue("");
    }
  };
  const handleClose = () => {
    setIsPopoverOpen(false);
    setInputValue("");
  };
  return (
    <AutoComplete
      {...fieldState}
      variant={variant}
      open={isPopoverOpen}
      name={fieldMetaObj?.name}
      label={fieldMetaObj?.label}
      tooltipTitle={fieldMetaObj?.comment}
      options={optionData}
      loading={loading}
      onBlur={onBlur}
      onOpen={() => setIsPopoverOpen(true)}
      onClose={handleClose}
      getOptionSelected={(option, val) =>
        option?.attributes?.name === val?.attributes?.name
      }
      getOptionLabel={(option) => option?.attributes?.name || ""}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderInput={(params) => ({
        ...fieldState,
        inputProps: {
          ...params.inputProps,
          value: fieldInputValue,
        },
        InputProps: {
          ...params.InputProps,
          className: classes.inputPadding,
          endAdornment: (
            <InputAdornment>
              {loading && <CircularProgress color="inherit" size={20} />}
              {value?.value && (
                <IconButton
                  disabled={fieldState?.disabled}
                  onClick={handleClear}
                >
                  <Close className={classes.cstmBtn} />
                </IconButton>
              )}
              <IconButton
                disabled={fieldState?.disabled}
                onClick={toggleDialogVisibility}
                style={{ padding: "0px" }}
                id={`search-btn-${fieldMetaObj?.name}`}
              >
                <SearchIcon className={classes.cstmBtn} />
              </IconButton>
            </InputAdornment>
          ),
        },
      })}
    />
  );
});

RelateFieldInput.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: VARIANT,
  size: "small",
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {
    isIconBtn: false,
    btnIcon: null,
    btnLabel: "",
    isSelectTypeBtn: false,
  },
};

export default memo(RelateFieldInput);
