import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles, { getMuiTheme } from "./styles";
import { Grid, useTheme, useMediaQuery } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { RelateTile } from "./Tiles";
import CustomerName from "./CustomerName";
import { Responsive, WidthProvider } from "react-grid-layout";
import Scrollbars from "react-custom-scrollbars";
import PointsTiles from "./PointsTiles";
import CreateCase from "./CreateCase";
import CustomerNameB2B from "./CustomerNameB2B";
import QuickNotesAccordion from "./QuickNotesAccordian";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function Customer360({ relData, open, handleClose }) {
  const classes = useStyles();
  const currentTheme = useTheme();
  const { module } = useParams();
  const id = relData.id;
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));
  const [countDataOpportunites, setCountDataOpportunites] = useState(0);
  const [countDataCases, setCountDataCases] = useState(0);
  const [countDataAccounts, setCountDataAccounts] = useState(0);
  const [countDataDocument, setCountDataDocument] = useState(0);
  let customer_name = [
    {
      module_name: "Accounts",
    },
  ];
  let relateData1 = [];
  if (module == "Accounts") {
    relateData1 = [
      {
        related_module_name: "Opportunities",
        related_back_module_name: "Opportunities",
        subpanel: "opportunities",
        subpanel_module: "Opportunities",
        icon: {
          faicon: "fas fa-dollar-sign",
          bgcolor: "#90be6d",
        },
        record_count: countDataOpportunites,
        is_api_fire: true,
      },
      {
        related_module_name: "Cases",
        related_back_module_name: "Cases",
        subpanel: "cases",
        subpanel_module: "Cases",
        icon: {
          faicon: "fas fa-exclamation",
          bgcolor: "#f94144",
        },
        record_count: countDataCases,
        is_api_fire: true,
      },
      {
        related_module_name: "Activities",
        related_back_module_name: "Activities",
        subpanel: "activities",
        subpanel_module: "Activities",
        icon: {
          faicon: "far fa-clipboard",
          bgcolor: "#277da1",
        },

        record_count: countDataAccounts,
        is_api_fire: true,
      },
      {
        related_module_name: "Smart Suggestions",
        related_back_module_name: "AISuggestions",
        subpanel: "AISuggestions",
        subpanel_module: "AISuggestions",
        icon: {
          faicon: "fas fa-wave-square",
          bgcolor: "#4d908e",
        },
        record_count: "",
        is_api_fire: false,
      },
      {
        related_module_name: "Documents",
        related_back_module_name: "Documents",
        subpanel: "documents",
        subpanel_module: "Documents",
        icon: {
          faicon: "far fa-file",
          bgcolor: "#f9c74f",
        },
        record_count: countDataDocument,
        is_api_fire: true,
      },
    ];
  } else {
    relateData1 = [
      // {
      //   related_module_name: "Products Purchased",
      //   related_back_module_name: "Prod_Product_Purchased",
      //   subpanel: "contacts_prod_product_purchased_1",
      //   subpanel_module: "Prod_Product_Purchased",
      //   icon: {
      //     faicon: "fa fa-shopping-cart",
      //     bgcolor: "#1b268b",
      //   },
      //   record_count: "",
      //   is_api_fire: true,
      // },
      {
        related_module_name: "Jobs & Tickets",
        related_back_module_name: "Cases",
        subpanel: "cases",
        subpanel_module: "Cases",
        icon: {
          faicon: "fa fa-exclamation",
          bgcolor: "#DC1F1F",
        },
        record_count: "",
        is_api_fire: true,
      },
      {
        related_module_name: "Activities",
        related_back_module_name: "Activities",
        subpanel: "activities",
        subpanel_module: "Activities",
        icon: {
          faicon: "fa-solid fa-sms",
          bgcolor: "#1B268B",
        },

        record_count: "",
        is_api_fire: true,
      },
      {
        related_module_name: "Smart Suggestions",
        related_back_module_name: "AOS_Invoices",
        subpanel: "contact_aos_invoices",
        subpanel_module: "AOS_Invoices",
        icon: {
          faicon: "fa-solid fa-sms",
          bgcolor: "#1B268B",
        },
        record_count: "",
        is_api_fire: false,
      },
    ];
  }
  return (
    <MuiThemeProvider theme={getMuiTheme(currentTheme)}>
      <React.Fragment>
        <Dialog
          fullScreen={true}
          open={open}
          aria-labelledby="max-width-dialog-title"
          className={classes.container}
        >
          <Scrollbars style={{ height: "100vh", paddingTop: "0px" }}>
            <DialogContent
              className={classes.content}
              style={{ paddingTop: "0px" }}
            >
              {mobileDevice == true ? (
                <Grid className={classes.headingInfo}>
                  <CreateCase
                    handleClose={handleClose}
                    id={id}
                    module={module}
                  />
                </Grid>
              ) : (
                ""
              )}
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="left"
              >
                <Grid
                  container
                  direction="row"
                  xs="12"
                  md="3"
                  alignItems="left"
                  className={classes.leftCustomerInfo}
                >
                  {module === "Contacts" ? (
                    <CustomerName
                      id={id}
                      data={relData}
                      relData={customer_name}
                      customer_name={relData.attributes.name}
                      selectedModule={module}
                    />
                  ) : (
                    <CustomerNameB2B
                      id={id}
                      data={relData}
                      relData={customer_name}
                      customer_name={relData.attributes.name}
                      selectedModule={module}
                    />
                  )}
                </Grid>

                <Grid
                  xs="12"
                  md="9"
                  conatiner
                  direction="row"
                  className={classes.rightSide}
                >
                  <Grid item xs="12" md="12" className={classes.topRightSide}>
                    {mobileDevice == false ? (
                      <Grid className={classes.headingInfo1}>
                        <CreateCase
                          handleClose={handleClose}
                          id={id}
                          customer_name={relData.attributes.name}
                          module={module}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                    <Grid className={classes.pointTiles}>
                      <PointsTiles
                        data={relData}
                        id={id}
                        setCountDataOpportunites={setCountDataOpportunites}
                        setCountDataCases={setCountDataCases}
                        setCountDataAccounts={setCountDataAccounts}
                        setCountDataDocument={setCountDataDocument}
                      />
                    </Grid>
                    <Grid className={classes.quickCreate}>
                      <QuickNotesAccordion data={relData} />
                    </Grid>
                  </Grid>

                  <Grid container className={classes.tile} spacing={2}>
                    {relateData1.map((item) => (
                      <Grid item xs="12" sm="4" md="4">
                        <div className={classes.tile1}>
                          <RelateTile
                            id={relData.id}
                            data={item}
                            pid={1}
                            pmodule={item.related_module_name}
                          />
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </Scrollbars>
        </Dialog>
      </React.Fragment>
    </MuiThemeProvider>
  );
}
