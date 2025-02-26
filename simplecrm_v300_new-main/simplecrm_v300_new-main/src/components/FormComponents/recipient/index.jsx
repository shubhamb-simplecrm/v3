import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import BadgeGroup from "./components/badgeGroup";
import SpitButton from "./components/spitButton";
import { isEmpty, pathOr } from "ramda";

function Recipient(props) {
  const {
    field,
    onChange,
    errors = {},
    value,
    small = false,
    helperText = "",
    variant = "outlined",
    fullWidth = true,
    disabled,
  } = props;
  const [recipientFieldValues, setRecipientFieldValues] = useState({
    optionType:!isEmpty(Object.keys(value))?pathOr("",[0],Object.keys(value)):"",
    idsArr: !isEmpty(Object.values(value))?pathOr([],[0],Object.values(value)):[],
  });
  useEffect(() => {
    onChange({
      [recipientFieldValues.optionType]: recipientFieldValues.idsArr,
    });
  }, [recipientFieldValues]);
  return (
    <Grid container spacing={2} direction="row" justifyContent="space-between">
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <SpitButton
          field={field}
          setFieldValues={setRecipientFieldValues}
          fieldValues={recipientFieldValues}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <BadgeGroup fieldValues={recipientFieldValues} />
      </Grid>
    </Grid>
  );
}

export default Recipient;
