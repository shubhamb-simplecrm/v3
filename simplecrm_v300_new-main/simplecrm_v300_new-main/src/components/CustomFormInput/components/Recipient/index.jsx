import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import BadgeGroup from "./components/badgeGroup";
import SpitButton from "./components/spitButton";
import { isEmpty, pathOr } from "ramda";
import { PropTypes } from "prop-types";

const Recipient = (props) => {
  const { fieldMetaObj, onChange, value } = props;
  const [recipientFieldValues, setRecipientFieldValues] = useState({
    optionType: !isEmpty(Object.keys(value))
      ? pathOr("", [0], Object.keys(value))
      : "",
    idsArr: !isEmpty(Object.values(value))
      ? pathOr([], [0], Object.values(value))
      : [],
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
          field={fieldMetaObj}
          setFieldValues={setRecipientFieldValues}
          fieldValues={recipientFieldValues}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <BadgeGroup fieldValues={recipientFieldValues} />
      </Grid>
    </Grid>
  );
};
Recipient.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  small: PropTypes.bool,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

Recipient.defaultProps = {
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

export default Recipient;
