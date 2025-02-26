import React from "react";
import useStyles from "./styles";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import {
  LBL_LIST_LOADING_TITLE,
  LBL_LIST_LOADING_DESCRIPTION,
} from "../../constant";

const SearchingRecord = () => {
  const classes = useStyles();
  return (
    <div className={classes.notFoundContainer}>
      <div className={classes.textboxClass}>
        <FindInPageIcon />
        <h2>{LBL_LIST_LOADING_TITLE}</h2>
        <p>{LBL_LIST_LOADING_DESCRIPTION}</p>
      </div>
    </div>
  );
};

export default SearchingRecord;
