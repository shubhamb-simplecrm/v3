import React, { useState } from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";

import { Grid, useTheme, useMediaQuery } from "@material-ui/core";

// FormInput
import { FormInput } from "../";
import { pathOr } from "ramda";
import { useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import EditRow from "./EditRow";
import DetailRow from "./DetailRow";

const ViewRows = ({
  data,
  module,
  initialValues,
  errors = {},
  onChange,
  onBlur,
  view = "editview",
  recordName,
  recordId,
  quickCreate = false,
  hiddenAll,
  mode = "detailpanel",
  fieldConfiguratorData = [],
  recordInfo = {},
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const { currentUserData } = useSelector((state) => state.config);
  const isAdmin = pathOr(
    0,
    ["data", "attributes", "is_admin"],
    currentUserData,
  );

  const currentTheme = useTheme();
  const isMobile = useMediaQuery(currentTheme.breakpoints.down("xs"), {
    defaultMatches: true,
  });
  const isQuoteEditView = (view, field, module) => {
    let moduleArr = ["AOS_Quotes", "AOS_Invoices", "AOS_Contracts"];
    let fieldArr = [
      "total_amt",
      "discount_amount",
      "subtotal_amount",
      "shipping_amount",
      "shipping_tax_amt",
      "shipping_tax",
      "tax_amount",
      "total_amount",
      "total_amount",
    ];
    if (
      view === "editview" &&
      moduleArr.includes(module) &&
      fieldArr.includes(field.name)
    ) {
      return (
        <>
          <Grid item xs className={classes.mobileLayoutHide}></Grid>
          <Grid item xs className={classes.mobileLayoutHide}></Grid>
        </>
      );
    }
  };
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container>
        {data.attributes.map((row, rowNum) => (
          <Grid container spacing={isMobile ? 0 : 3} key={rowNum}>
            {row.map((field, fieldNum) =>
              hiddenAll &&
              hiddenAll["hidden"] &&
              !hiddenAll["hidden"].find((o) => o === field.name) ? (
                <Grid
                  item
                  xs={12}
                  sm={row.length == 2 ? 6 : 12}
                  key={fieldNum}
                  className={classes.mobileLayoutPadding}
                >
                  <Grid
                    container
                    className={
                      errors[field.name] !== "InVisible"
                        ? classes.fieldSpacing
                        : null
                    }
                    direction="row"
                    justify="space-between"
                    alignItems="stretch"
                  >
                    {isQuoteEditView(view, field, module)}
                    <Grid item xs>
                      {view === "editview" && field.field_key ? (
                        <EditRow
                          errors={errors}
                          initialValues={initialValues}
                          field={field}
                          onChange={onChange}
                          onBlur={onBlur}
                          view={view}
                          quickCreate={quickCreate}
                          mode={mode}
                          hiddenAll={hiddenAll}
                          isAdmin={isAdmin}
                          recordId={recordId}
                          recordName={recordName}
                          module={module}
                        />
                      ) : (
                        <DetailRow
                          field={field}
                          view={view}
                          mode={mode}
                          errors={errors}
                          row={row}
                          recordId={recordId}
                          recordName={recordName}
                          module={module}
                          fieldConfiguratorData={fieldConfiguratorData}
                          recordInfo={recordInfo}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null,
            )}
          </Grid>
        ))}
        {/* {previewFile.open ? (
          <FileViewerComp
            previewFile={previewFile}
            setPreviewFile={setPreviewFile}
          />
        ) : (
          ""
        )} */}
      </Grid>
    </MuiThemeProvider>
  );
};

export default ViewRows;
