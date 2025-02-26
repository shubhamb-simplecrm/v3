import React, { useState, useRef, useEffect } from "react";

import { useTheme } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import { FormControl, InputLabel, Tooltip} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import useStyles from "./styles";
import { getMuiTheme } from "./styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { LBL_REQUIRED_FIELD } from "../../../constant";


const MultipleSelect = ({
  field,
  onChange,
  errors = {},
  helperText="",
  value = [],
  small = false,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  if (value !== undefined) {
    if (!Array.isArray(value) && value.length) {
      if (value.indexOf(',') > -1) {
        if (value.indexOf('^') > -1) {
          value = value && value.replace(/\^/g, "").split(",")
        } else {
          value = value && value.split(",")
        }

      } else {
        
        value = [value];//[value.replace(/\^/g, "")]
      }
      // myVarToTest is not an array
    } else if (value === false) {
      value = [];
    }
  }
   
  const [multipleValue, setMultipleValue] = useState(value);
  let InputLabelRef = useRef(null);
  useEffect(() => {
    onChange(multipleValue);
  }, [multipleValue])

  const handleChange = (event) => {
    let value = event.target.value;
    setMultipleValue(event.target.value);
    if (value.length !== 0) {
      let finalValue = value.reduce(function (acc, val) {
        acc.push(`^${val}^`);
        return acc;
      }, []);
      finalValue = finalValue.toString();
      onChange(finalValue);
      
    }  };

  let iserror = errors[field.name] ? true : false;

  const renderMenuItem = () => {
    const options = Object.keys(field.options);
    
    return options.map((key, index) => (
      <MenuItem key={"multiop" + index} value={key}>
        {field.options[key]}
      </MenuItem>
    ))
  }
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
    <FormControl variant="outlined" className={classes.formControl}>
      <Tooltip
        title={field.comment || ''}
        disableHoverListener={field.comment ? false : true}
        placement="top-start"
        disableFocusListener={field.comment ? false : true}
        disableTouchListener={field.comment ? false : true}
      >
        <InputLabel
          ref={(ref) => {
            InputLabelRef = ref;
          }}
          htmlFor="outlined-age-simple"
        >
          {field.label}
        </InputLabel>
      </Tooltip>
      <Select
      displayEmpty={true}
        key={"multisel" + field.name}
        id={field.name}
        name={field.name}
        error={iserror}
        required={field.required === 'true' || errors[field.name] === LBL_REQUIRED_FIELD ? true : false}
        multiple
        value={multipleValue?multipleValue:[]}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        label={field.label}
        size={small ? "small" : "medium"}

        // input={<Input inputProps={{ size: small ? "small" : "medium", variant: "outlined" }} />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              value && <Chip key={value} color="primary"  label={field.options[value]} className={classes.chip}  size="small" />
            ))}
          </div>
        )}
        helperText={errors[field.name] ? errors[field.name] : null}
      >
        
        {renderMenuItem()}
      </Select>
    </FormControl>
    </MuiThemeProvider>
  );
};

export default MultipleSelect;
