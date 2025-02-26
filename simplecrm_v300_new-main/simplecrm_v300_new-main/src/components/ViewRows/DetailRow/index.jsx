import React, { useState } from "react";
import {
  Grid,
  useTheme,
  Chip,
  Checkbox,
  useMediaQuery,
  Tooltip,
  Typography as MuiTypography,
} from "@material-ui/core";
import useStyles, { getMuiTheme } from "./styles";
import Lineitemdetailview from "../Lineitemdetailview";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";
import parse from "html-react-parser";
import { checkMaskingCondition, isValidURL } from "../../../common/utils";
import { Link } from "react-router-dom";
import {
  Reminders,
  ReminderTime,
  EmailString,
  AddressString,
  PhoneString,
  FileString,
  ParentString,
  StatusString,
  RelateString,
} from "../../FormComponents";
import BadgeGroup from "../../FormComponents/recipient/components/badgeGroup";
import blankImage from "../../../assets/blank-image.jpg";
import { Typography } from "../../Wrappers/Wrappers";
import { Button } from "@/components/SharedComponents/Button";
import CustomDialog from "@/components/SharedComponents/CustomDialog";
import IFrameContainer from "@/components/SharedComponents/IFrameContainer";
import { sendLatLongToNative } from "@/common/mobile-utils";
import { useIsMobileView } from "@/hooks/useIsMobileView";
const DetailRow = ({
  field,
  mode,
  view,
  row,
  recordId,
  recordName,
  module,
  errors,
  fieldConfiguratorData = [],
  recordInfo = {},
}) => {
  const classes = useStyles();
  const currentTheme = useTheme();
  const config = useSelector((state) => state?.config?.config);
  const statusBackground = pathOr([], ["fields_background", module], config);
  let statusField = Object.keys(statusBackground);
  const cloudConnectConfig = pathOr("", ["cloudConnectConfig"], config);
  const parseFieldValue = (field, value) => {
    if (
      statusField &&
      statusField.length > 0 &&
      statusField.indexOf(field.field_key) >= 0 &&
      view === "detailview"
    ) {
      return (
        <StatusString
          field={field}
          value={value}
          module={module}
          fieldConfiguratorData={fieldConfiguratorData}
        />
      );
    }
    if (field.name === "location_c" && view === "detailview") {
      return <GeoLocationButton field={field} />;
    }
    if (
      field.field_key === "opportunities_scoring_c" ||
      field.field_key === "lead_scoring_c"
    ) {
      if (value && value != null && typeof value == "string") {
        let tmp = document.createElement("SPAN");
        tmp.innerHTML = value;
        value = tmp.textContent || tmp.innerText || "";
        const valueData = checkMaskingCondition(
          fieldConfiguratorData,
          { [field.field_key]: value },
          "masking",
        );
        return valueData[field.field_key];
      }
    }
    if (
      /<\/?[a-z][\s\S]*>/i.test(value) &&
      view !== "editview" &&
      field.type === "wysiwyg"
    ) {
      return (
        <div style={{ wordWrap: "break-word", overflow: "scroll" }}>
          {parse(value)}
        </div>
      );
    }
    if (field.field_key === "description") {
      if (value && value != null && typeof value == "string") {
        switch (view) {
          case "createview":
            return (value = "");

          case "detailview":
            const valueData = checkMaskingCondition(
              fieldConfiguratorData,
              { [field.field_key]: value },
              "masking",
            );
            value = valueData[field.field_key] ?? value;
            let tmp = document.createElement("div");
            tmp.textContent = parse(value);
            if (field.type === "wysiwyg" || field.type == "text") {
              const formattedText = value
                .replace(/\r\n/g, "<br />")
                .replace(/\n\n/g, "<br />")
                .replace(/\n/g, "<br />");

              return (
                <div
                  style={{ wordWrap: "break-word", overflow: "scroll" }}
                  dangerouslySetInnerHTML={{ __html: formattedText }}
                >
                  {/* {parse(value)} */}
                </div>
              );
            }
            if (module === "Emails") {
              return parse(value);
            }
            value = tmp.textContent || tmp.innerText || "";
            return valueData[field.field_key];

          default:
            let tmp1 = document.createElement("div");
            tmp1.textContent = value;
            value = tmp1.textContent || tmp1.innerText || "";
            return valueData[field.field_key];
        }
      }
    }
    if (
      field.field_key ===
      field.field_key.substr(0, field.field_key.indexOf("_")) +
        "_address_street"
    ) {
      return (
        <div style={{ wordWrap: "break-word", overflow: "scroll" }}>
          <AddressString
            field={field}
            fieldConfiguratorData={fieldConfiguratorData}
          />
        </div>
      );
    }
    if (
      (field.field_key == "email1" || field.type === "email") &&
      Array.isArray(field.value)
    ) {
      return (
        <EmailString
          field={field}
          parent_name={recordName}
          parent_id={recordName}
          parent_type={module}
          fieldConfiguratorData={fieldConfiguratorData}
        />
      );
    }
    if (field.field_key === "converted" && view === "detailview") {
      return field.value == 1 ? "Yes" : "No";
    }
    if (field.type === "bool" && view === "detailview") {
      return (
        <Checkbox
          disabled
          checked={field.value == 1}
          style={{ padding: 0 }}
          id={field?.name}
        />
      );
    }
    if (field.type === "parent" && view === "detailview") {
      return (
        <ParentString
          field={field}
          value={value}
          fieldConfiguratorData={fieldConfiguratorData}
        />
      );
    }
    if (field.type === "relate" && view === "detailview") {
      return (
        <RelateString
          field={field}
          value={value}
          fieldConfiguratorData={fieldConfiguratorData}
        />
      );
    }
    if (field.type === "file" && view === "detailview") {
      return (
        <FileString
          value={value}
          module={module}
          recordId={recordId}
          field_id={field.name}
          fieldConfiguratorData={fieldConfiguratorData}
          recordInfo={recordInfo}
        />
      );
    }
    if (field.type === "radioenum" && view === "detailview") {
      return pathOr(field.value || "", ["options", field.value], field);
    }
    if (field.type === "image" && field.value && view === "detailview") {
      return (
        <img
          src={field.value}
          alt={field.label}
          className={classes.photo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = blankImage;
          }}
          id={field?.name}
        />
      );
    }
    if (field.type === "url" && field.value && view === "detailview") {
      let url = field.value;
      url = url && !url.includes("http") ? `http://${url}` : url;
      const valueData = checkMaskingCondition(
        fieldConfiguratorData,
        { [field.field_key]: field.value },
        "masking",
      );
      let value = valueData[field.field_key];
      return (
        <>
          {isValidURL(url) ? (
            <a
              className={classes.link}
              variant="body2"
              //onClick={() => window.open(url, "_blank")}
              href={url}
              target="_blank"
              key={field.name}
              id={field?.name}
              style={{
                overflow: "scroll",
              }}
            >
              {value}
            </a>
          ) : (
            value
          )}
        </>
      );
    }
    if (field.name == "reminders") {
      return (
        <Reminders
          field={field}
          onChange={(val) => {
            return val;
          }}
          errors={""}
          variant="outlined"
          value={field.value}
          small={false}
          disabled={true}
          view={"detailview"}
        />
      );
    }
    if (field.name == "reminder_time") {
      return (
        <ReminderTime
          field={field}
          errors={""}
          value={field.value}
          disabled={true}
          onChange={(val) => {
            return val;
          }}
          view={"detailview"}
        />
      );
    }
    if (mode === "rightpanel" && field.type === "text" && field.color) {
      const valueData = checkMaskingCondition(
        fieldConfiguratorData,
        { [field.field_key]: field.value },
        "masking",
      );
      let value = valueData[field.field_key];
      return (
        <Typography style={{ color: field.color }} id={field?.name}>
          {value}
        </Typography>
      );
    }
    if (
      field.type === "phone" &&
      field.value &&
      view === "detailview"
      // && cloudConnectConfig.api_url
    ) {
      return (
        <PhoneString
          field={field}
          value={value}
          fieldConfiguratorData={fieldConfiguratorData}
        />
      );
    }
    if (field.type == "recipients" && field.value && view === "detailview") {
      const formateValue = {
        optionType: Object.keys(value)[0],
        idsArr: Object.values(value)[0],
      };
      return <BadgeGroup fieldValues={formateValue} />;
    }
    if (
      field.field_key === "shipping_address_street" ||
      field.field_key === "billing_address_street"
    ) {
      return value;
    }
    const valueData = checkMaskingCondition(
      fieldConfiguratorData,
      { [field.field_key]: field.value },
      "masking",
    );
    return (
      <MuiTypography noWrap className={classes.textStyle}>
        {valueData[field.field_key]}
      </MuiTypography>
    );
  };
  return (
    <Grid
      container
      direction="column"
      justify={
        (field.field_key === "total_amt" ||
          field.field_key === "discount_amount" ||
          field.field_key === "subtotal_amount" ||
          field.field_key === "shipping_amount" ||
          field.field_key === "shipping_tax_amt" ||
          field.field_key === "shipping_tax" ||
          field.field_key === "tax_amount" ||
          field.field_key === "total_amount") &&
        (module === "AOS_Quotes" ||
          module === "AOS_Invoices" ||
          module === "AOS_Contracts")
          ? "flex-end"
          : "space-between"
      }
      alignItems="stretch"
      spacing={2}
    >
      <Grid
        style={{ paddingBottom: "0px", maxWidth: "100%" }}
        item
        xs={mode === "rightpanel" ? 12 : row.length === 2 ? 12 : 12}
        sm={
          mode === "rightpanel"
            ? 12
            : (row.length === 2 && field.field_key === "reminder_time") ||
                field.field_key === "reminders"
              ? 12
              : row.length === 2
                ? 4
                : 2
        }
        md={
          mode === "rightpanel"
            ? 12
            : field.field_key === "reminder_time"
              ? 2
              : row.length === 2
                ? 4
                : 2
        }
        className={classes.mobileLabelLayoutPadding}
      >
        {errors[field.name] !== "InVisible" ? (
          <Typography className={classes.text} variant="subtitle2">
            {field.label ? field.label : ""}
          </Typography>
        ) : null}
      </Grid>
      {field.field_key === "description" ? (
        <Grid
          item
          xs={mode === "rightpanel" ? 12 : row.length === 2 ? 12 : 12}
          sm={mode === "rightpanel" ? 12 : row.length === 2 ? 8 : 10}
          md={mode === "rightpanel" ? 12 : row.length === 2 ? 8 : 10}
          style={{
            maxWidth:
              (field.field_key === "total_amt" ||
                field.field_key === "discount_amount" ||
                field.field_key === "subtotal_amount" ||
                field.field_key === "shipping_amount" ||
                field.field_key === "shipping_tax_amt" ||
                field.field_key === "shipping_tax" ||
                field.field_key === "tax_amount" ||
                field.field_key === "total_amount") &&
              (module === "AOS_Quotes" ||
                module === "AOS_Invoices" ||
                module === "AOS_Contracts")
                ? "150px"
                : "100%",
            whiteSpace: field.type === "wysiwyg" ? "unset" : "break-spaces",
            paddingTop: "0px",
          }}
        >
          {errors[field.name] !== "InVisible" ? (
            <Typography
              className={classes.text}
              variant="subtitle1"
              style={{
                paddingLeft: row.length === 2 ? 6 : null,
                textAlign:
                  (field.field_key === "total_amt" ||
                    field.field_key === "discount_amount" ||
                    field.field_key === "subtotal_amount" ||
                    field.field_key === "shipping_amount" ||
                    field.field_key === "shipping_tax_amt" ||
                    field.field_key === "shipping_tax" ||
                    field.field_key === "tax_amount" ||
                    field.field_key === "total_amount") &&
                  (module === "AOS_Quotes" ||
                    module === "AOS_Invoices" ||
                    module === "AOS_Contracts")
                    ? "right"
                    : "unset",
              }}
            >
              {field.field_key === "line_items" &&
              (module === "AOS_Quotes" ||
                module === "AOS_Invoices" ||
                module == "AOS_Contracts") ? (
                <Lineitemdetailview data={field.linedata} module={module} />
              ) : (
                parseFieldValue(field, field.value)
              )}
            </Typography>
          ) : null}
        </Grid>
      ) : (
        <Grid
          item
          xs={mode === "rightpanel" ? 12 : row.length === 2 ? 12 : 12}
          sm={
            mode === "rightpanel"
              ? 12
              : (row.length === 2 && field.field_key === "reminder_time") ||
                  field.field_key === "reminders"
                ? 12
                : row.length === 2
                  ? 8
                  : 10
          }
          md={
            mode === "rightpanel"
              ? 12
              : field.field_key === "reminder_time"
                ? 10
                : row.length === 2
                  ? 8
                  : 10
          }
          style={{
            maxWidth:
              (field.field_key === "total_amt" ||
                field.field_key === "discount_amount" ||
                field.field_key === "subtotal_amount" ||
                field.field_key === "shipping_amount" ||
                field.field_key === "shipping_tax_amt" ||
                field.field_key === "shipping_tax" ||
                field.field_key === "tax_amount" ||
                field.field_key === "total_amount") &&
              (module === "AOS_Quotes" ||
                module === "AOS_Invoices" ||
                module === "AOS_Contracts")
                ? "150px"
                : "100%",
            paddingTop: "0px",
          }}
        >
          {errors[field.name] !== "InVisible" ? (
            <Typography
              className={classes.text}
              variant="subtitle1"
              style={{
                paddingLeft: row.length === 2 ? 6 : null,
                textAlign:
                  (field.field_key === "total_amt" ||
                    field.field_key === "discount_amount" ||
                    field.field_key === "subtotal_amount" ||
                    field.field_key === "shipping_amount" ||
                    field.field_key === "shipping_tax_amt" ||
                    field.field_key === "shipping_tax" ||
                    field.field_key === "tax_amount" ||
                    field.field_key === "total_amount") &&
                  (module === "AOS_Quotes" ||
                    module === "AOS_Invoices" ||
                    module === "AOS_Contracts")
                    ? "right"
                    : "unset",
              }}
            >
              {field.field_key === "line_items" &&
              (module === "AOS_Quotes" ||
                module === "AOS_Invoices" ||
                "AOS_Contracts") ? (
                <Lineitemdetailview data={field.linedata} module={module} />
              ) : (
                parseFieldValue(field, field.value)
              )}
            </Typography>
          ) : null}
        </Grid>
      )}
    </Grid>
  );
};

const GeoLocationButton = ({ field }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobileView();
  const handleClose = () => {
    setOpen(false);
  };
  const handleButtonClick = () => {
    if (isMobile) {
      sendLatLongToNative({
        lat: !!field?.lat_c ? field.lat_c : "",
        long: !!field?.long_c ? field.long_c : "",
      });
    } else {
      setOpen(true);
    }
  };
  return (
    <>
      <Button
        label={field.label}
        disabled={!!field.disabled}
        onClick={handleButtonClick}
      />
      <CustomDialog
        isDialogOpen={open}
        handleCloseDialog={handleClose}
        title={field.label}
        maxWidth="md"
        bodyContent={
          <>
            <IFrameContainer
              url={`https://maps.google.com/maps?q=${field.lat_c},${field.long_c}&hl=es;z=14&output=embed`}
              height={"100vh"}
              style={{
                height: "100vh",
              }}
            />
          </>
        }
      />
    </>
  );
};

export default DetailRow;
