import React, { useState, useEffect } from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";
import ZoomOutMapSharpIcon from "@material-ui/icons/ZoomOutMapSharp";
import {
  useTheme,
  Chip,
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  Avatar,
  IconButton,
  Button,
  useMediaQuery,
} from "@material-ui/core";

import { MuiThemeProvider } from "@material-ui/core/styles";
// import CloseIcon from '@mui/icons-material/Close';
import { FaIcon } from "../..";
import { textEllipsis } from "../../../common/utils";
import { pathOr } from "ramda";
import Rating from "@material-ui/lab/Rating";
import image from "../../../assets/company_logo.png";
import { base64encode } from "@/common/encryption-utils";
import useCommonUtils from "@/hooks/useCommonUtils";

export default function CreateCase({ handleClose, id, customer_name, module }) {
  // const [spacing, setSpacing] = React.useState(1);
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(2);
  const { allowC360ModulesList } = useCommonUtils();
  const recordCreationButtons =
    allowC360ModulesList[module]["recordCreationBtn"] ?? [];

  const customLabels = {
    converted: "Leads Converted",
    open: "Open Leads",
    total: "Leads Generated",
    closed_won: "Won Opportunities",
  };

  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleCreateBtn = (type, item) => {
    let relateBeanData = {
      type: module,
      id: id,
      relationshipName: item.relationshipName,
      relationshipModule: item.relationshipModule,
    };

    window.open(
      `/app/createrelateview/${type}/Accounts/${id}/${base64encode(
        JSON.stringify(relateBeanData),
      )}`,
      "_blank",
    );
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid xs={12} md={12} container direction="row" className={classes.root}>
        <Grid item xs={2} md={2} justifyContent="flex-start">
          <Typography className={classes.heading}>
            {module == "Accounts" ? "Customer360" : "Contact360"}
          </Typography>
        </Grid>

        <Grid
          container
          xs={10}
          md={10}
          alignItems="right"
          className={classes.buttons}
        >
          {Object.entries(recordCreationButtons)?.map(([type, item]) => (
            <Grid item alignItems="right">
              <Button
                target="_blank"
                onClick={() => handleCreateBtn(type, item)}
                size="small"
                className={classes.btn}
                color="primary"
                variant="contained"
              >
                {mobileDevice === false ? (
                  <FaIcon icon={"fas fa-plus"} size="1x" />
                ) : null}
                <Typography className={classes.text}>
                  {"CREATE "}
                  {type}
                </Typography>
              </Button>
            </Grid>
          ))}

          <Grid
            item
            alignItems="right"
            className={classes.closeIcon}
            onClick={handleClose}
          >
            <FaIcon icon={"fas fa-times"} />
          </Grid>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}
