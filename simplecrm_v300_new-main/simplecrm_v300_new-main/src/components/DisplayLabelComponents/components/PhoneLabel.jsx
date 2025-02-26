import useStyles from "./../styles";

export const PhoneLabel = ({ fieldValue }) => {
  const classes = useStyles();
  return <a href={`tel:${fieldValue}`} className={classes.phoneLink}>{fieldValue}</a>;
};
