import { Checkbox, FormControlLabel } from "@material-ui/core";
import React, { useState } from "react";

function CheckBoxGroup({
  field,
  onChange,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  disabled = false,
  initialValues,
}) {
  const checkedValues = value.split(",").filter((n) => n);
  const [checkedCheckBox, setCheckedCheckBox] = useState(checkedValues);
  const handleOnChange = (e, fieldIndex) => {
    let tempArr = [...checkedCheckBox];
    if (e.target.checked) {
      tempArr.push(fieldIndex);
    } else {
      tempArr = tempArr.filter((e) => e != fieldIndex);
    }
    setCheckedCheckBox(tempArr);
    onChange(tempArr.toString());
  };
  const renderOptions = () => {
    let optionsToRender = [];
    let count = 0;
    for (let fieldLabel in field.options) {
      optionsToRender.push(
        <FormControlLabel
          control={
            <Checkbox
              name={field.options[fieldLabel]}
              value={checkedValues.includes(fieldLabel)}
              defaultChecked={checkedValues.includes(fieldLabel)}
              onChange={(e) => handleOnChange(e, fieldLabel)}
              color="primary"
            />
          }
          label={field.options[fieldLabel]}
        />,
      );
    }
    count++;
    return optionsToRender;
  };
  return renderOptions();
}

export default CheckBoxGroup;
