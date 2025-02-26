import React, { useState, useCallback, useEffect } from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";
import {
  useTheme,
  Grid,
  Typography,
  Paper,
  List,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { getC360ProfileDetailView } from "../../../store/actions/detail.actions";
import { getMetaAssets } from "../../../store/actions/auth.actions";
import { pathOr } from "ramda";

export default function CustomerNameB2B({ id, selectedModule, data }) {
  let setLogo = ""
  const classes = useStyles();
  const theme = useTheme();
  const [customerInfo, setCustomerInfo] = useState({});
  const [customerAdd, setCustomerAdd] = useState({});
  const getDetailViewData = useCallback(async () => {
    let res = await getC360ProfileDetailView(selectedModule, id);
    const detailCustomerData = pathOr(
      [],
      ["data", "templateMeta", "data", "0", "attributes"],
      res,
    );
    const customerAddress = pathOr(
      [],
      [
        "data",
        "templateMeta",
        "data",
        "0",
        "panels",
        "1",
        "attributes",
        "0",
        "0",
      ],
      res,
    );
    let customerData = {};
    for (let item in detailCustomerData) {
      for (let fieldIndex in detailCustomerData[item]) {
        let field = detailCustomerData[item][fieldIndex];
        let value = field?.value;
        if (field.type === "enum" && field.name !== "gender_c") {
          value = pathOr(value, ["options", value], field);
        }
        customerData[field.name] = value;
      }
    }
    setCustomerInfo(customerData);
    setCustomerAdd(customerAddress);
  }, [id , selectedModule]);

  useEffect(() => {
    getDetailViewData();
  }, [getDetailViewData]);

  const getLogos = useCallback(async () => {
    try {
      const res = await getMetaAssets();
      setLogo=pathOr("No Logo", ["data", "logo_image"], res);
    } catch (ex) {
      console.log(ex);
    }
  },[setLogo]);
  
  useEffect(() => {
    getLogos();
  }, [getLogos]);

  let customerType = pathOr(
    pathOr("", ["attributes", "account_type"], data),
    ["account_type"],
    customerInfo,
  );
  let billing_address_street = pathOr(
    "",
    ["value", "billing_address_street"],
    customerAdd,
  );

  let billing_address_city = pathOr(
    "",
    ["value", "billing_address_city"],
    customerAdd,
  );
  let billing_address_country = pathOr(
    "",
    ["value", "billing_address_country"],
    customerAdd,
  );
  let billing_address_postalcode = pathOr(
    "",
    ["value", "billing_address_postalcode"],
    customerAdd,
  );
  let finalArray = [
    {
      label: "Mobile Number",
      value: pathOr(
        pathOr("", ["attributes", "phone_office"], data),
        ["phone_office"],
        customerInfo,
      ),
    },
    {
      label: "Email Address",
      value: pathOr("", ["email1", 0, "email"], customerInfo),
    },
    {
      label: "Date Of Birth",
      value: pathOr("", ["date_of_birth_c"], customerInfo),
    },
    {
      label: "Address",
      value: `${billing_address_street ? billing_address_street : ""}
      ${billing_address_city ? ", " + billing_address_city : ""}
      ${billing_address_country ? ", " + billing_address_country : ""}
      ${billing_address_postalcode ? ", " + billing_address_postalcode : ""}
      `,
    },
  ];

  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Paper className={classes.topRow} item xs={12}>
            <Grid container direction="column">
              <Grid container direction="row" xs={12} sm={12} md={12}>
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  className={classes.nameContent}
                >
                  <Typography className={classes.custName}>
                    {pathOr(
                      pathOr("", ["attributes", "name"], data),
                      ["name"],
                      customerInfo,
                    )}
                  </Typography>

                  <Typography className={classes.cardHeading}>
                    Preferred Language
                  </Typography>
                  <Typography className={classes.cardNo}>English</Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  md={2}
                  sm={2}
                  alignContent="right"
                  alignItems="right"
                >
                  <IconButton
                    aria-label="preview"
                    size="small"
                    target="_blank"
                    href={`/app/detailview/Accounts/${id}`}
                    style={{ padding: "3px 10px 0px 0px" }}
                  >
                    <VisibilityIcon className={classes.eyeIcon} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <Grid className={classes.bottomRow} item xs={12} md={12}>
            <Grid container xs={12} md={12} direction="row">
              <Grid item xs={10} md={10} alignContent="left" alignItems="left">
                <Typography className={classes.bottomHeading}>
                  {customerType !== "Customer"
                    ? "Customer Information"
                    : "Company Information"}
                </Typography>
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
                                  {item?.label}
                                </Grid>
                                <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  className={classes.infoValue}
                                >
                                  <React.Fragment>{item?.value}</React.Fragment>
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
