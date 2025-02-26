import React from "react";
import { Link as MuiLink, makeStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  linkStyle: {
    textDecoration: "none !important",
  },
}));

const StyledMuiLink = withStyles({
  root: {
    "&[disabled]": {
      color: "grey",
      cursor: "none",
      "&:hover": {
        textDecoration: "none",
      },
    },
  },
})(MuiLink);
const Link = ({ onClick, children, ...props }) => {
  const { underline = "none", disabled = false, style = {} } = props;
  const classes = useStyles();
  return (
    <StyledMuiLink
      style={{
        cursor: disabled ? "default" : "pointer",
        ...style,
      }}
      className={classes.linkStyle}
      onClick={onClick}
      underline={underline}
      {...props}
    >
      {children}
    </StyledMuiLink>
  );
};

export default Link;
