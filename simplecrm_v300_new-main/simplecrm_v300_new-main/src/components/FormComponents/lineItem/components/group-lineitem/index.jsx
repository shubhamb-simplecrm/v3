import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, pathOr } from "ramda";
import {
  Grid,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useStyles from "./styles";
import LineItemGrandTotal from "./components/LineItemGrandTotal";
import LineItemGroupList from "./components/LineItemGroupList";
import { useFormContext } from "react-hook-form";
import GroupCurrencyField from "./components/group-currency-field";
export default function GroupLineItem(props) {
  const { field, module, initialValues } = props;
  const { control, reset, getValues } = useFormContext();
  const classes = useStyles();
  const [fieldObj, setFieldObj] = useState({});

  // group total fields names
  const singleGroupTotalFields = [
    "total_amt",
    "discount_amount",
    "subtotal_amount",
    // "shipping_amount",
    // "shipping_tax_amt",
    "tax_amount",
    "total_amount",
  ];
  // group total fields initialValues
  const singleGroupTotalFieldsInitialValue = useMemo(() => {
    return singleGroupTotalFields.reduce(function (o, val) {
      o[val] = "";
      return o;
    }, {});
  }, [singleGroupTotalFields]);
  // function to initialize value for edit view
  const initFields = (fieldObj) => {
    const initialValuesTemp = Object.values(
      pathOr([], ["linedata", "groups_data"], field),
    );

    const tempGrandInitialValue = {};
    fieldObj.grandTotal.map((field) => {
      tempGrandInitialValue[field.field_key] = field.value;
    });
    reset((formValues) => {
      formValues["line_items"]["grouped"] = initialValuesTemp;
      return {
        ...formValues,
        ...tempGrandInitialValue,
      };
    });
  };

  useEffect(() => {
    const tempFieldObj = {
      currencyField: null,
      lineItemField: null,
      grandTotal: [],
      singleGroupTotal: [],
    };
    const tempLineData = pathOr(null, ["linedata"], field);
    tempFieldObj["currencyField"] = pathOr(
      null,
      ["currency_field_datalabel", 0],
      tempLineData,
    );
    tempFieldObj["lineItemField"] = field;
    tempFieldObj["grandTotal"] = pathOr(
      null,
      ["total_field_datalabel"],
      tempLineData,
    );
    if (!isEmpty(tempFieldObj["grandTotal"])) {
      tempFieldObj["singleGroupTotal"] = tempFieldObj[
        "grandTotal"
      ].filter((field) => singleGroupTotalFields.includes(field.field_key));
    }
    initFields(tempFieldObj);
    setFieldObj({ ...tempFieldObj });
  }, [field]);

  return (
    <>
      <GroupCurrencyField
        {...props}
        field={fieldObj?.currencyField}
        control={control}
      />
      <LineItemGroupList
        module={module}
        groupTotalFields={fieldObj?.singleGroupTotal}
        field={field}
        singleGroupTotalFieldsInitialValue={singleGroupTotalFieldsInitialValue}
        initialValues={initialValues}
      />
      <Accordion expanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className={classes.headerBackground}
        >
          <Typography
            className={classes.text}
            weight="light"
            variant="subtitle2"
            // key={panel?.label}
          >
            {"Grand Total"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={1}
            className={classes.lineItemBox}
          >
            <Grid item xs={12} sm={12}>
              <LineItemGrandTotal
                module={module}
                fields={fieldObj?.grandTotal}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
