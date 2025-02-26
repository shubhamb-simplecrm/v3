import React, { useEffect, useState } from "react";
import {
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  Button,
  TextField,
  Tooltip,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";

import { dispatch, text } from "d3";
import {
  getActivityFeeds,
  getListViewActivities,
  updateReply,
} from "../../../store/actions/module.actions";
import { toast } from "react-toastify";
import { LBL_REQUIRED_FIELD } from "../../../constant";
export default function TextFieldWithButton({
  field,
  onChange,
  errors = {},
  variant = "outlined",
  value,
  small = false,
  onBlur,
  activity_id,
  pageNo,
  pageSize,
  record,
  setIsRecentComment,
}) {
  let iserror = errors[field.name] ? true : false;
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setMessage(e.target.value);
    onChange(e.target.value);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const reply = async (data) => {
    try {
      const res = await updateReply(message, activity_id);
      setIsRecentComment(true);
    } catch (e) {
      toast("something went wrong");
    }
  };

  return (
    <>
      <FormControl
        id={field.name}
        error={iserror}
        required={field.required === 'true' ? true : errors[field.name] === LBL_REQUIRED_FIELD ? true : false}
        name={field.name}
        size={small ? "small" : "medium"}
        label={field.label}
        value={value}
        variant={variant}
        fullWidth
        onBlur={onBlur}
        InputLabelProps={{
          shrink: true,
        }}
      >
        <InputLabel htmlFor="outlined-adornment-password">
          {field.label}
        </InputLabel>
        <OutlinedInput
          multiline
          maxRows={2}
          fullWidth
          onBlur={onBlur}
          error={iserror}
          required={field.required === 'true' || errors[field.name] === LBL_REQUIRED_FIELD ? true : false}
          name={field.name}
          helperText={errors[field.name] ? errors[field.name] : null}
          id="outlined-adornment-password"
          type={"text"}
          value={value}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle-password-visibility"
                onClick={reply}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />
      </FormControl>
    </>
  );
}
