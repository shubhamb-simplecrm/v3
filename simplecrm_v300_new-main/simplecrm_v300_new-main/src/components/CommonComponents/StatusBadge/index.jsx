import React, { memo, useEffect} from "react";
import { Chip, useTheme } from "@material-ui/core";
import useStyles from "./styles";
import { useSelector } from "react-redux";
import { isEmpty, pathOr } from "ramda";

const StatusBadge = (props) => {
  const { size = "small", title, style = {}, bgColorParam = {} } = props;
  const classes = useStyles();
  const currentTheme = useTheme();
  const { config } = useSelector((state) => state.config);
  let statusBackgroundColor = "";
  let statusTextColor = "";
  let statusStyleObj = {};
  useEffect(() => {
    if (bgColorParam) {
      const moduleName = pathOr("", ["module"], bgColorParam);
      const fieldName = pathOr("", ["fieldName"], bgColorParam);
      const optionName = pathOr("", ["optionName"], bgColorParam);
      if (!isEmpty(moduleName) && !isEmpty(fieldName) && !isEmpty(optionName)) {
        const optionObj = pathOr(
          "",
          ["fields_background", moduleName, fieldName, optionName],
          config,
        );
        statusBackgroundColor = pathOr("", ["background_color"], optionObj);
        statusTextColor = pathOr("", ["text_color"], optionObj);

        if (currentTheme.palette.type === "dark") {
          statusStyleObj = {
            color: statusBackgroundColor,
            fontWeight: "bolder",
            background: "transparent",
            border: "1px solid",
          };
        } else {
          statusStyleObj = {
            color: statusBackgroundColor,
            background: statusBackgroundColor + "20",
            border: "none",
          };
        }
      }
    }
  }, [bgColorParam]);

  return (
    <Chip
      size={size}
      className={classes.root}
      style={{ ...style, ...statusStyleObj }}
      label={title}
    />
  );
};
export default memo(StatusBadge);
