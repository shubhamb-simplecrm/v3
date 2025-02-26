import React, { useEffect, useState } from "react";
import {
  InputAdornment,
  Tooltip,
  TextField,
  Paper,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close, Search as SearchIcon } from "@material-ui/icons";
import useStyles from "./styles";
import { pathOr, isEmpty } from "ramda";
import { NAME, NO_OPTION, VARIANT } from "../../../../../../../constant";
import { getRelateFieldData } from "../../../../../../../store/actions/module.actions";
const CustomPaper = (props) => {
  return <Paper elevation={8} {...props} />;
};

const RelateFieldTextInput = (props) => {
  const {
    field,
    onChange,
    value,
    errors = {},
    variant = VARIANT,
    toggleDialogVisibility,
    onCopy = null,
  } = props;
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(value?.value ?? "");
  const [loading, setLoading] = useState(false);
  let iserror = pathOr(false, [field?.name], errors);
  useEffect(() => {
    setInputValue(value?.value);
  }, [value?.value]);

  const onAutoCompleteChange = async (inputProps) => {
    setInputValue(inputProps);
    if (!isEmpty(value?.value) && !isEmpty(value?.id)) {
      onChange({
        id: value?.id,
        value: inputProps,
      });
    }
    if (!isEmpty(inputProps) && inputProps?.length > 2) {
      let sort = NAME;
      let query = `filter[name][lke]=${inputProps}&`;
      const queryParams = pathOr({}, ["queryParams"], field);
      if (!isEmpty(queryParams)) {
        query += queryParams;
      }
      let module = field.module;
      let pageSize = 20;
      let pageNo = 1;
      let reportsTo = null;
      setLoading(true);
      setOptions([]);
      getRelateFieldData(module, pageSize, pageNo, sort, query, reportsTo).then(
        (res) => {
          if (res.ok) {
            const { listview } =
              !!res?.data?.data?.templateMeta && res?.data?.data?.templateMeta;
            setOptions(!!listview?.data ? listview?.data : []);
          }
          setLoading(false);
        },
      );
    } else {
      setOptions([]);
      setLoading(false);
    }
    if (isEmpty(inputProps)) {
      onClearButton();
    }
  };

  const onSelectOptionFromSearchList = async (value) => {
    let data = {
      id: value.id,
      value: value?.attributes?.name,
    };
    onChange(data);
  };

  const onClearButton = () => {
    onChange("");
    setInputValue("");
    setOptions([]);
  };

  return (
    <Tooltip
      title={field.comment || ""}
      disableHoverListener={field.comment ? false : true}
      placement="top-start"
      disableFocusListener={field.comment ? false : true}
      disableTouchListener={field.comment ? false : true}
    >
      <Autocomplete
        id={field.name}
        name={field.name}
        disableClearable={true}
        options={options}
        noOptionsText={isEmpty(options) ? "" : NO_OPTION}
        getOptionLabel={(option) => option?.attributes?.name}
        onChange={(event, value) => onSelectOptionFromSearchList(value)}
        onInputChange={(event, newInputValue) =>
          onAutoCompleteChange(newInputValue)
        }
        disabled={errors[field.name] === "ReadOnly" ? true : field?.disabled}
        getOptionSelected={(options) => options?.attributes?.name}
        PaperComponent={CustomPaper}
        freeSolo
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            error={errors[field.name] === "ReadOnly" ? null : iserror}
            helperText={
              errors[field.name] === "ReadOnly"
                ? ""
                : pathOr(null, [field?.name], errors)
            }
            ref={params.InputProps.ref}
            variant={variant}
            required={field.required == "true"}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              ...params.inputProps,
              value: !isEmpty(inputValue) ? inputValue : "",
              className: classes.inputPadding,
            }}
            disabled={
              errors[field.name] === "ReadOnly" ? true : field?.disabled
            }
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment className={classes.adornment}>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {value.value && (
                    <IconButton
                      disabled={
                        errors[field.name] === "ReadOnly"
                          ? true
                          : field?.disabled
                      }
                      style={{ padding: "0px" }}
                    >
                      <Close
                        className={classes.cstmBtn}
                        onClick={() => onClearButton()}
                      />
                    </IconButton>
                  )}
                  <IconButton
                    disabled={
                      errors[field.name] === "ReadOnly" ? true : field?.disabled
                    }
                    style={{ padding: "0px" }}
                  >
                    <SearchIcon
                      className={classes.cstmBtn}
                      onClick={() => toggleDialogVisibility()}
                      id={`seach-btn-${field?.name}`}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label={field.label}
            onCut={onCopy}
            onCopy={onCopy}
            onPaste={onCopy}
            onContextMenu={onCopy}
          />
        )}
      />
    </Tooltip>
  );
};

export default RelateFieldTextInput;
