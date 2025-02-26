import { useCallback, useState } from "react";
import { TextField } from "@/components/SharedComponents/InputComponents";
import {
  LBL_EMAIL_INVALID,
  LBL_EMAIL_INVALID_ERROR,
  LBL_EMAIL_OPTED_OUT,
  LBL_EMAIL_PRIMARY,
  LBL_EMAIL_REQUIRED_ERROR,
} from "@/constant";
import CustomFormInput from "..";
import { InputAdornment, List, Popover, makeStyles } from "@material-ui/core";
import { AddCircleOutline, Close, Settings } from "@material-ui/icons";
import useCommonUtils from "@/hooks/useCommonUtils";
import { isEmpty, isNil, pathOr } from "ramda";
import { isValidEmail } from "@/common/validations";
import Tooltip from "@/components/SharedComponents/Tooltip";
import PropTypes from "prop-types";

const emailOptionList = [
  {
    key: "primary",
    name: "primary",
    label: LBL_EMAIL_PRIMARY,
    type: "bool",
  },
  {
    key: "optOut",
    name: "optOut",
    label: LBL_EMAIL_OPTED_OUT,
    type: "bool",
  },
  {
    key: "invalid",
    name: "invalid",
    label: LBL_EMAIL_INVALID,
    type: "bool",
  },
];
const useStyles = makeStyles(() => ({
  root: {
    padding: 10,
  },
  emailField: {
    marginBottom: 10,
  },
  adornment: {
    padding: 0,
    margin: 0,
    cursor: "pointer",
  },
}));

const EmailField = (props) => {
  const {
    fieldMetaObj,
    fieldState,
    onChange,
    variant,
    value = [],
    size,
    onBlur,
  } = props;
  const { maxAllowEmailEditView } = useCommonUtils();
  const [popOverInfo, setPopOverInfo] = useState({
    anchorEl: null,
    index: null,
  });
  const [emailError, setEmailError] = useState({});

  const handleOnPopOverOpen = useCallback((event, fIndex) => {
    setPopOverInfo({ anchorEl: event.currentTarget, index: fIndex });
  }, []);

  const handleOnPopOverClose = useCallback(() => {
    setPopOverInfo({ anchorEl: null, index: null });
  }, []);

  const handleAddEmailRow = useCallback(
    (fIndex) => {
      if (value.length >= maxAllowEmailEditView || !isEmpty(emailError)) {
        return;
      }
      if (Array.isArray(value)) {
        let errorValues = {};
        value?.forEach((emailValue, index) => {
          if (!emailValue.email) {
            errorValues[index] = LBL_EMAIL_REQUIRED_ERROR;
          } else if (!isValidEmail(value[fIndex].email)) {
            errorValues[index] = LBL_EMAIL_INVALID_ERROR;
          }
        });
        if (!isEmpty(errorValues)) {
          setEmailError(errorValues);
          return;
        }
      }
      const newFieldValue = [
        ...value,
        {
          optOut: false,
          invalid: false,
          deleted: false,
          error: false,
          email: "",
          primary: false,
        },
      ];
      onChange(newFieldValue);
    },
    [value, emailError, maxAllowEmailEditView, onChange],
  );
  const handleRemoveEmailRow = useCallback(
    (fIndex) => {
      const newFieldValue = [...value];
      newFieldValue.splice(fIndex, 1);
      onChange(newFieldValue);
    },
    [value, onChange],
  );

  const handleEmailChange = useCallback(
    (key, name, emailValue) => {
      const updatedFieldValue = [...value];

      if (name === "primary") {
        updatedFieldValue.forEach((email, index) => {
          email.primary = index === key ? emailValue : false;
        });
      } else {
        updatedFieldValue[key][name] = emailValue;
      }
      onChange(updatedFieldValue);

      if (emailValue && name === "email") {
        const updatedEmailError = { ...emailError };
        delete updatedEmailError[key];
        setEmailError(updatedEmailError);
      }
    },
    [value, emailError, onChange],
  );

  return (
    <>
      {value.map((emailField, index) => (
        <EmailRow
          key={`${fieldMetaObj?.name}${index}`}
          fieldMetaObj={fieldMetaObj}
          fieldState={fieldState}
          emailField={emailField}
          size={size}
          index={index}
          variant={variant}
          onEmailChange={handleEmailChange}
          onRemoveEmailRow={handleRemoveEmailRow}
          onAddEmailRow={handleAddEmailRow}
          onPopOverOpen={handleOnPopOverOpen}
          fieldValue={value}
          emailError={emailError}
        />
      ))}
      {popOverInfo?.index !== null && (
        <EmailOptionPopover
          emailField={value[popOverInfo.index]}
          popOverInfo={popOverInfo}
          handleOnPopOverClose={handleOnPopOverClose}
          handleEmailChange={handleEmailChange}
        />
      )}
    </>
  );
};

const EmailRow = ({
  fieldMetaObj,
  fieldState,
  size,
  variant,
  index,
  onAddEmailRow,
  onRemoveEmailRow,
  onPopOverOpen,
  onEmailChange,
  fieldValue,
  emailError,
  emailField,
}) => {
  const classes = useStyles();
  const { maxAllowEmailEditView } = useCommonUtils();
  const emailLabelIndex = index === 0 ? "" : index;
  const isError =
    fieldState?.error ||
    (emailError?.hasOwnProperty(index) && !isEmpty(emailError[index]));
  const innerErrorMessage = pathOr("", [index], emailError);
  const globalErrorMessage =
    typeof fieldState?.helperText === "object"
      ? pathOr("", ["helperText", `${fieldMetaObj.name}-${index}`], fieldState)
      : pathOr("", ["helperText"], fieldState);

  return (
    <div style={{ marginBottom: 5 }}>
      <Tooltip title={fieldMetaObj?.comment}>
        <TextField
          {...fieldState}
          name={`${fieldMetaObj.name}-${index}`}
          label={`${fieldMetaObj.label} ${emailLabelIndex}`}
          size={size}
          variant={variant}
          onChange={(e) => onEmailChange(index, "email", e.target.value)}
          error={isError}
          value={emailField?.email}
          helperText={
            <>
              <span>{globalErrorMessage} </span>
              <span>{innerErrorMessage}</span>
            </>
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="start" className={classes.adornment}>
                {index !== 0 && (
                  <Close
                    onClick={() => onRemoveEmailRow(index)}
                    id={`remove-email-btn-${index}`}
                  />
                )}
                {fieldValue.length - 1 === index &&
                  fieldValue.length < maxAllowEmailEditView && (
                    <AddCircleOutline
                      onClick={() => onAddEmailRow(index)}
                      id={`add-email-btn-${index}`}
                    />
                  )}
                <Settings
                  onClick={(event) => onPopOverOpen(event, index)}
                  aria-controls={`add-email-setting-btn-${index}`}
                  id={`add-email-setting-btn-${index}`}
                  aria-haspopup="true"
                />
              </InputAdornment>
            ),
          }}
        />
      </Tooltip>
    </div>
  );
};

const EmailOptionPopover = ({
  emailField,
  popOverInfo,
  handleOnPopOverClose,
  handleEmailChange,
}) => {
  const classes = useStyles();
  return (
    <Popover
      id={`add-email-setting-btn-${popOverInfo?.index}`}
      open={!isNil(popOverInfo?.index)}
      anchorEl={popOverInfo?.anchorEl}
      onClose={handleOnPopOverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <List className={classes.root}>
        {emailOptionList?.map((option) => (
          <CustomFormInput
            key={`email-option-btn-${option.key}-${popOverInfo?.index}`}
            fieldMetaObj={option}
            value={emailField[option.key]}
            onChange={() =>
              handleEmailChange(
                popOverInfo?.index,
                option.key,
                !emailField[option.key],
              )
            }
          />
        ))}
      </List>
    </Popover>
  );
};

EmailField.propTypes = {
  fieldMetaObj: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
  fieldState: PropTypes.object,
  moduleMetaData: PropTypes.object,
  customProps: PropTypes.object,
};

EmailField.defaultProps = {
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

export default EmailField;
