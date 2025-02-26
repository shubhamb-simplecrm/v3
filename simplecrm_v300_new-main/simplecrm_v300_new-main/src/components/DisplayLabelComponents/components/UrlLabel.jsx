import React from "react";
import useStyles from "./../styles";
import { isValidURL } from "../../../common/utils";
import { TextLabel } from "./TextLabel";
import { Link } from "@material-ui/core";

export const UrlLabel = (props) => {
  const { fieldValue } = props;
  const classes = useStyles();
  const url = fieldValue && isValidURL(fieldValue) ? fieldValue : `http://${fieldValue}`;
  return isValidURL(url) ? (
    <Link className={classes.link} href={url} target="_blank">
      {fieldValue}
    </Link>
  ) : (
    <TextLabel {...props} />
  );
};
