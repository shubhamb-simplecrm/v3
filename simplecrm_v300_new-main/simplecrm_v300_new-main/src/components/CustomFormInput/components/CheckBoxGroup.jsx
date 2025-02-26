import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "@/components/SharedComponents/InputComponents";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    marginTop: theme.spacing(1),
    fontSize: 20,
    marginLeft: theme.spacing(-1.25),
  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    gap: theme.spacing(2),
  },

  formControlLabel: {
    width: theme.spacing(8),
  },
}));

function CheckBoxGroup({
  fieldMetaObj,
  fieldState,
  onChange,
  value,
  fullWidth,
  size,
  variant,
}) {
  const classes = useStyles(); // Use the styles defined above
  const checkedValues = value.split(",").filter((n) => n);
  const [checkedCheckBox, setCheckedCheckBox] = useState(checkedValues);

  const handleOnChange = (e, fieldIndex) => {
    let tempArr = [...checkedCheckBox];
    if (e.target.checked) {
      tempArr.push(fieldIndex);
    } else {
      tempArr = tempArr.filter((e) => e !== fieldIndex);
    }
    setCheckedCheckBox(tempArr);
    onChange(tempArr.toString());
  };

  const renderOptions = () => {
    let optionsToRender = [];
    for (let fieldLabel in fieldMetaObj?.options) {
      optionsToRender.push(
        <FormControlLabel
          key={fieldLabel}
          className={classes.formControlLabel}
          control={
            <Checkbox
              {...fieldState}
              name={fieldMetaObj?.options[fieldLabel]}
              value={checkedValues.includes(fieldLabel)}
              defaultChecked={checkedValues.includes(fieldLabel)}
              onChange={(e) => handleOnChange(e, fieldLabel)}
              color="primary"
              className={classes.checkbox}
            />
          }
          label={fieldMetaObj?.options[fieldLabel]}
        />,
      );
    }
    return optionsToRender;
  };

  return (
    <FormControl
      disabled={!!fieldState?.disabled}
      required={!!fieldState?.required}
      error={!!fieldState?.error}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      name={fieldMetaObj?.name}
    >
      <InputLabel shrink className={classes.inputLabel}>
        {fieldMetaObj?.label}
      </InputLabel>
      <FormGroup row={true} className={classes.formGroup}>
        {renderOptions()}
      </FormGroup>
      <FormHelperText error={!!fieldState?.error}>
        {fieldState?.helperText}
      </FormHelperText>
    </FormControl>
  );
}

CheckBoxGroup.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  small: PropTypes.bool,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

CheckBoxGroup.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  small: true,
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};

export default CheckBoxGroup;