import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import SelectAllIcon from "@material-ui/icons/SelectAll";
import FormInput from "../../../../FormInput";
import { isEmpty, pathOr } from "ramda";
export default function SplitButton({ field, setFieldValues, fieldValues }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const handleMenuItemClick = (event, index) => {
    field.relate_field_array["module"] = Object.entries(field.options)[
      index
    ][0];
    fieldValues["optionType"] = field.relate_field_array["module"];
    fieldValues["idsArr"] = [];
    setFieldValues(fieldValues);
    setSelectedIndex(index);
    handleToggle();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleOnRecipientChange = (inputValue) => {
    const inputData = pathOr({}, ["selectedRecords"], inputValue);
    const inputDataObj = Object.values(inputData).map((e) => {
      const name = pathOr("", ["attributes", "name"], e);
      const id = pathOr("", ["id"], e);
      return {
        id,
        name,
      };
    });
    setFieldValues((v) => {
      v["idsArr"] = [...v["idsArr"], ...inputDataObj];
      return { ...v };
    });
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <FormInput
            variant="outlined"
            field={field?.relate_field_array}
            initialValues={{ relatedRecords: [] }}
            value=""
            multiSelect="true"
            isIconBtn="true"
            isSelectBtn="true"
            btnIcon={<SelectAllIcon />}
            color="primary"
            disabled={selectedIndex == 0}
            isIconBtnLabel={Object.entries(field.options)[selectedIndex][1]}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            onChange={handleOnRecipientChange}
          />
          <Button
            color="primary"
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {Object.entries(field.options).map((option, index) => (
                      <MenuItem
                        key={option[0]}
                        disabled={isEmpty(option[0])}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option[1]}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}
