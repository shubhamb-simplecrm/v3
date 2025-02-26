import React from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import useStyles from "./styles";
import { Typography } from "@material-ui/core";

const JSONeditor = ({
  field,
  onChange,
  errors = {},
  value = {},
  disabled = false,
}) => {
  const classes = useStyles();
  const currentTheme = useSelector((state) =>
    pathOr("", ["config", "V3SelectedTheme"], state.config),
  );

  return (
    <>
      <Typography style={{ color: "grey" }}>
        <b>{field.label}</b>
      </Typography>
      <div className={classes.editor}>
        <JSONInput
          id="a_unique_id"
          placeholder={value ? value : []}
          colors={
            currentTheme === "dark"
              ? { background: "white" }
              : { background: "black" }
          }
          reset={false}
          onChange={(e) => (e.jsObject ? onChange(e.jsObject) : [])}
          locale={locale}
          height="400px"
          width="100%"
          disabled={errors[field.name] === "ReadOnly" ? true : false}
        />
      </div>

      {errors[field.name] && errors[field.name] !== "ReadOnly" ? (
        <Typography variant="body2" className={classes.danger} gutterBottom>
          {errors[field.name]}
        </Typography>
      ) : null}
    </>
  );
};

export default JSONeditor;
