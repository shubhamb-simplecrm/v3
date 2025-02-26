import React from "react";
import { FormInput } from "../../";
import { Grid, Tooltip } from "@material-ui/core";
import useStyles from "./styles";
import { isEmpty, pathOr } from "ramda";

const SYMBOL = {
  "=": "=",
  not_equal: "!=",
  greater_than: ">",
  greater_than_equals: ">=",
  less_than: "<",
  less_than_equals: "<=",
  between: "-",
};
const CurrencySearch = ({ field, onChange, value }) => {
  const classes = useStyles();
  const rangeValue = pathOr("", ["range"], value);
  const handleRangeFieldChange = (field, inputValue) => {
    const valueObj = {};
    valueObj["range"] = inputValue;
    onChange(valueObj);
  };
  const handleAmountFieldValueChange = (fieldName, inputValue) => {
    const valueObj = { ...value };
    valueObj[fieldName] = inputValue;
    onChange(valueObj);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs="12">
        <Tooltip
          title={field.comment || ""}
          disableHoverListener={field.comment ? false : true}
          placement="top-start"
          disableFocusListener={field.comment ? false : true}
          disableTouchListener={field.comment ? false : true}
        >
          <FormInput
            field={{ ...field, type: "enum" }}
            onChange={(value) => handleRangeFieldChange(field.name, value)}
            small={true}
            value={rangeValue}
            view={"SearchLayout"}
          />
        </Tooltip>
      </Grid>
      {!isEmpty(rangeValue) && rangeValue !== "between" && (
        <Grid item xs="12">
          <FormInput
            field={{
              ...field,
              field_key: `range_${field.name}`,
              name: `range_${field.name}`,
              type: "int",
              label: SYMBOL[rangeValue],
            }}
            onChange={(value) =>
              handleAmountFieldValueChange(`range_${field.name}`, value)
            }
            small={true}
            value={pathOr("", [`range_${field.name}`], value)}
          />
        </Grid>
      )}
      {rangeValue === "between" && (
        <>
          <Grid item xs="5">
            <FormInput
              field={{
                ...field,
                field_key: `start_range_${field.name}`,
                name: `start_range_${field.name}`,
                type: "int",
                label: SYMBOL[rangeValue],
              }}
              onChange={(value) =>
                handleAmountFieldValueChange(`start_range_${field.name}`, value)
              }
              small={true}
              value={pathOr("", [`start_range_${field.name}`], value)}
            />
          </Grid>
          <Grid item xs="2">
            <div className={classes.betweenSeparator}>
              <span>-</span>
            </div>
          </Grid>
          <Grid item xs="5">
            <FormInput
              field={{
                ...field,
                field_key: `end_range_${field.name}`,
                name: `end_range_${field.name}`,
                type: "int",
                label: SYMBOL[rangeValue],
              }}
              onChange={(value) =>
                handleAmountFieldValueChange(`end_range_${field.name}`, value)
              }
              small={true}
              value={pathOr("", [`end_range_${field.name}`], value)}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CurrencySearch;
