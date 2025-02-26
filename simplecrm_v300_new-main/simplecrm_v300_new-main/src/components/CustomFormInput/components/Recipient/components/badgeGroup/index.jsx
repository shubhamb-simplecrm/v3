import {
  Avatar,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import React, { memo, useState, useRef } from "react";
import { stringToColor } from "@/common/utils";
import SimpleDialog from "../simpleDialog";

function BadgeGroup(props) {
  const { fieldValues } = props;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AvatarGroup max={8} onClick={handleClickOpen}>
        {fieldValues?.idsArr.map((f) => (
          <Avatar
            style={{
              backgroundColor: stringToColor(f.name),
            }}
            alt={f.name}
          >
            {f.name.charAt(0).toUpperCase().trim()}
          </Avatar>
        ))}
      </AvatarGroup>
      <SimpleDialog valueArr={fieldValues} open={open} onClose={handleClose} />
    </>
  );
}

export default memo(BadgeGroup);
