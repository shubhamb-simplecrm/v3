import React from "react";
import AddIcon from "@material-ui/icons/Add";
import useStyles from "./styles";

const DefaultAddView = (props) => {
  const { title, onAddClick } = props;
  const classes = useStyles();
  return (
    <div className={classes.alignCenter}>
      <div className={classes.addBox} onClick={() => onAddClick()}>
        <AddIcon className={classes.addIcon} />
        <p className={classes.text}>{title}</p>
      </div>
    </div>
  );
};

export default DefaultAddView;
