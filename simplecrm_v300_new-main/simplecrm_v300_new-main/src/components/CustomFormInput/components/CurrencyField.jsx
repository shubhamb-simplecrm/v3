import useStyles from "./styles";
import { LAYOUT_VIEW_TYPE } from "@/common/layout-constants";
import { PropTypes } from "prop-types";
import { isEmpty, pathOr } from "ramda";
import { Grid } from "@material-ui/core";
import CustomFormInput from "..";
import AutoCompleteEnumField from "./AutoCompleteEnumField";

const SYMBOL = {
  "=": "=",
  not_equal: "!=",
  greater_than: ">",
  greater_than_equals: ">=",
  less_than: "<",
  less_than_equals: "<=",
  between: "-",
};
const CurrencyField = (props) => {
  const { moduleMetaData } = props;
  return moduleMetaData.currentView === LAYOUT_VIEW_TYPE?.searchLayoutView ? (
    <CurrencySearchField {...props} />
  ) : (
    <AutoCompleteEnumField {...props} />
  );
};
const CurrencySearchField = ({
  fieldMetaObj,
  onChange,
  value,
  moduleMetaData,
  fieldState,
  size,
}) => {
  const classes = useStyles();
  const rangeValue = pathOr("", ["range"], value);
  const handleRangeFieldChange = (e) => {
    const valueObj = {};
    valueObj["range"] = e.target.value;
    onChange(valueObj);
  };
  const handleAmountFieldValueChange = (fieldName, e) => {
    const valueObj = { ...value };
    valueObj[fieldName] = e.target.value;
    onChange(valueObj);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs="12">
        <CustomFormInput
          fieldMetaObj={{
            ...fieldMetaObj,
            type: "enum",
          }}
          onChange={handleRangeFieldChange}
          size={size}
          value={rangeValue}
          moduleMetaData={{
            ...moduleMetaData,
            currentView: LAYOUT_VIEW_TYPE?.searchLayoutView,
          }}
          fieldState={fieldState}
        />
      </Grid>
      {!isEmpty(rangeValue) && rangeValue !== "between" && (
        <Grid item xs="12">
          <CustomFormInput
            fieldMetaObj={{
              ...fieldMetaObj,
              field_key: `range_${fieldMetaObj?.name}`,
              name: `range_${fieldMetaObj?.name}`,
              type: "varchar",
              label: SYMBOL[rangeValue],
            }}
            onChange={(e) =>
              handleAmountFieldValueChange(`range_${fieldMetaObj?.name}`, e)
            }
            size={size}
            value={pathOr("", [`range_${fieldMetaObj?.name}`], value)}
            fieldState={fieldState}
          />
        </Grid>
      )}
      {rangeValue === "between" && (
        <>
          <Grid item xs="5">
            <CustomFormInput
              fieldMetaObj={{
                ...fieldMetaObj,
                field_key: `start_range_${fieldMetaObj?.name}`,
                name: `start_range_${fieldMetaObj?.name}`,
                type: "varchar",
                label: SYMBOL[rangeValue],
              }}
              onChange={(e) =>
                handleAmountFieldValueChange(
                  `start_range_${fieldMetaObj?.name}`,
                  e,
                )
              }
              size={size}
              value={pathOr("", [`start_range_${fieldMetaObj?.name}`], value)}
              fieldState={fieldState}
            />
          </Grid>
          <Grid item xs="2">
            <div className={classes.betweenSeparator}>
              <span>-</span>
            </div>
          </Grid>
          <Grid item xs="5">
            <CustomFormInput
              fieldMetaObj={{
                ...fieldMetaObj,
                field_key: `end_range_${fieldMetaObj?.name}`,
                name: `end_range_${fieldMetaObj?.name}`,
                type: "varchar",
                label: SYMBOL[rangeValue],
              }}
              onChange={(e) =>
                handleAmountFieldValueChange(
                  `end_range_${fieldMetaObj?.name}`,
                  e,
                )
              }
              size={size}
              value={pathOr("", [`end_range_${fieldMetaObj?.name}`], value)}
              fieldState={fieldState}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};
CurrencyField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.function,
  onBlur: PropTypes.function,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

CurrencyField.defaultProps = {
  onChange: () => {},
  onBlur: () => {},
  variant: "outlined",
  size: "small",
  fieldState: {
    disabled: false,
    required: false,
    error: false,
    visible: true,
    helperText: null,
  },
  moduleMetaData: {},
  customProps: {},
};
export default CurrencyField;
