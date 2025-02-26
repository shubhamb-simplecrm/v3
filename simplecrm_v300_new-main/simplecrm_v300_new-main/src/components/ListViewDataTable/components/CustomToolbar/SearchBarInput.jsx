import React, { memo, useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { Grid, InputAdornment, TextField, Tooltip } from "@material-ui/core";
import { IconButton, InputBase } from "@material-ui/core";
import useStyles from "./styles";

import { LBL_SEARCH_MENU_LABEL } from "../../../../constant";
import { isEmpty, pathOr } from "ramda";
export const SearchBarInput = memo(
  ({
    listViewFilterPreference,
    currentModule,
    onListStateChange,
    basicSearchField,
  }) => {
    const classes = useStyles();
    const [searchText, setSearchText] = useState("");
    const minLength = 1;
    const fieldLabel = !!basicSearchField?.label
      ? `${LBL_SEARCH_MENU_LABEL} with ${basicSearchField?.label}`
      : LBL_SEARCH_MENU_LABEL;

    const handleOnTextChange = (e) => {
      setSearchText(e.target.value);
    };
    const handleOnTextClear = () => {
      setSearchText("");
      onListStateChange({
        pageNo: 1,
        resetFilter: true,
        withSelectedRecords: false,
      });
    };
    const handleOnSearch = (e) => {
      e.preventDefault();
      onListStateChange({
        pageNo: 1,
        filterOption: {
          [`filter[${basicSearchField?.name}][lke]`]: searchText.trim(),
        },
        withAppliedFilter: true,
      });
    };
    useEffect(() => {
      const tempValue = pathOr(
        "",
        [basicSearchField?.name, "lke"],
        listViewFilterPreference,
      );
      setSearchText(tempValue);
    }, [listViewFilterPreference]);
    if (!basicSearchField?.name) {
      return null;
    }
    return (
      <form onSubmit={handleOnSearch}>
        <Tooltip title={fieldLabel}>
          <TextField
            className={classes.search}
            inputProps={{ "aria-label": "search" }}
            value={searchText}
            onChange={handleOnTextChange}
            variant={"outlined"}
            fullWidth={true}
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              inputProps: {
                className: classes.inputPadding,
              },
              endAdornment: (
                <InputAdornment className={classes.adornment}>
                  <IconButton
                    type="submit"
                    aria-label="search"
                    color="primary"
                    style={{
                      padding: 0,
                    }}
                    disabled={isEmpty(searchText)}
                    onClick={handleOnSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                  {searchText.trim().length >= minLength && (
                    <IconButton
                      aria-label="search"
                      color="primary"
                      style={{
                        padding: 0,
                      }}
                      onClick={handleOnTextClear}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            placeholder={fieldLabel}
          />
        </Tooltip>
      </form>
    );
  },
);
