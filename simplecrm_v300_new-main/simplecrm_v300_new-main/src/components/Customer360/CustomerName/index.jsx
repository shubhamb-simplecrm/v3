import React, { useCallback, useEffect, useRef, useState } from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";
import {
  useTheme,
  Grid,
  Typography,
  Paper,
  List,
  ListItemText,
  Avatar,
  IconButton,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import { getDetailView } from "../../../store/actions/detail.actions";
import { getMetaAssets } from "../../../store/actions/auth.actions";

export default function CustomerNameB2B({
  id,
  data,
  customer_name,
  selectedModule,
}) {
  const classes = useStyles();
  const [logo, setLogo] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const getDetailViewData = useCallback(() => {
    dispatch(getDetailView(selectedModule, id));
  }, [dispatch, selectedModule, id]);

  useEffect(() => {
    getDetailViewData();
  }, [getDetailViewData]);

  const getLogos = useCallback(() => {
    try {
      const res = getMetaAssets();
      setLogo(pathOr("No Logo", ["data", "logo_image"], res));
    } catch (ex) {
      console.log(ex);
    }
  }, []);
  useEffect(() => {
    getLogos();
  }, [getLogos]);

  const { detailViewTabData } = useSelector((state) => state.detail);
  const customerInfoPhoneNo = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "3",
      "1",
      "value",
    ],
    detailViewTabData,
  );
  const customerInfoAddress = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "7",
      "0",
      "value",
      "primary_address_street",
    ],
    detailViewTabData,
  );
  const customerInfoId = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "1",
      "0",
      "value",
    ],
    detailViewTabData,
  );
  const customerInfoGender = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "15",
      "0",
      "value",
    ],
    detailViewTabData,
  );
  const customerInfoDob = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "15",
      "1",
      "value",
    ],
    detailViewTabData,
  );
  const customerInfoEmail = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "5",
      "0",
      "value",
      "0",
      "email",
    ],
    detailViewTabData,
  );
  const customerInfoProffesion = pathOr(
    [],
    [
      selectedModule,
      "data",
      "templateMeta",
      "data",
      "0",
      "attributes",
      "18",
      "0",
      "value",
    ],
    detailViewTabData,
  );
  let finalArray = [
    {
      label: "Address",
      value: customerInfoAddress,
    },
    {
      label: "Mobile Number",
      value: customerInfoPhoneNo,
    },
    {
      label: "Email Address",
      value: customerInfoEmail,
    },
    {
      label: "Gender",
      value: customerInfoGender,
    },
    {
      label: "Proffesion",
      value: customerInfoProffesion,
    },
    {
      label: "Date of Birth",
      value: customerInfoDob,
    },
    {
      label: "Customer ID",
      value: customerInfoId,
    },
  ];
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Paper className={classes.topRow} item xs={12}>
            <Grid container direction="row">
              <Grid item xs={12} sm={12} className={classes.nameContent}>
                <Typography className={classes.custName}>
                  {customer_name}
                </Typography>
                <Typography className={classes.cardHeading}>
                  National Identity Card
                </Typography>
                <Typography className={classes.cardNo}>
                  911833872873V
                </Typography>
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Paper>

          <Grid className={classes.bottomRow} item xs={12} md={12}>
            <Grid container xs={12} md={12} direction="row">
              <Grid item xs={10} md={10} alignContent="left" alignItems="left">
                <Typography className={classes.bottomHeading}>
                  Customer Information
                </Typography>
              </Grid>
              <Grid item xs={2} md={2} alignContent="right" alignItems="right">
                <IconButton
                  aria-label="preview"
                  size="small"
                  target="_blank"
                  href={`/app/detailview/Contacts/${id}`}
                  style={{ padding: "0px" }}
                >
                  <VisibilityIcon className={classes.eyeIcon} />
                </IconButton>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12} direction="row">
              <List dense className={classes.bottomHeading}>
                {finalArray.map((item, index) => {
                  return (
                    <ListItemText
                      id={`checkbox-list-secondary-label-${index.index1}`}
                      primary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            <Grid item xs={12}>
                              <Grid container>
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.infoLabel}
                                >
                                  {item.label}
                                </Grid>
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.infoValue}
                                >
                                  <React.Fragment>{item.value}</React.Fragment>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}
