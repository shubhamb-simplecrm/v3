import React, { useCallback, useEffect, useState } from "react";
import { isEmpty, pathOr } from "ramda";
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import {
  LBL_CLEAR_BUTTON_LABEL,
  LBL_SEARCH_BUTTON_LABEL,
  LBL_SEARCH_EMAIL,
} from "@/constant";
import { FormInput } from "@/components";
import useStyles from "./styles";
import { buildFilterQueryObj } from "@/common/utils";
import { searchDefs } from "@/components/Email/metaData";
import { useEmailState } from "@/components/Email/useEmailState";
import CloseIcon from "@material-ui/icons/Close";

const FilterDialog = ({ dialogStatus, onClose, onListStateChange }) => {
  const classes = useStyles();
  const fieldsArr = searchDefs;
  const { actions, selectedFolderId, filterObj } = useEmailState((state) => ({
    actions: state.actions,
    selectedFolderId: state.selectedFolderId,
    filterObj: state.filterObj,
  }));
  const [filterValues, setFilterValues] = useState({});
  const [filterValuesMeta, setFilterValuesMeta] = useState({});

  const handleFieldChange = useCallback(
    (val, field) => {
      if (field.type === "multienum" && Array.isArray(val)) {
        val = val.toString();
      }

      if (field.type === "parent") {
        filterValues[field.field_key] = val;
        filterValuesMeta[field.field_key] = field;
      } else {
        if (field) {
          if (typeof val === "string") {
            filterValues[field.field_key] = val.trim();
          } else {
            filterValues[field.field_key] = val;
          }
          filterValuesMeta[field.field_key] = field;
        }
      }
      setFilterValues({ ...filterValues });
      setFilterValuesMeta({ ...filterValuesMeta });
    },
    [filterValues],
  );

  const searchFormHandle = (e) => {
    e.preventDefault();
    const saveFilterName = pathOr("", ["text"], filterValues);
    const sortColumn = pathOr("", ["sort_column"], filterValues);
    const sortOrder = pathOr("", ["sort_order"], filterValues).toLowerCase();
    const filterObj = buildFilterQueryObj(filterValues, filterValuesMeta);
    // Object.entries(filterObj).map(([key, value]) => {
    //   if (key == "filter[date][eq]") {
    //     let date = new Date(value);
    //     const months = [
    //       "Jan",
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct",
    //       "Nov",
    //       "Dec",
    //     ];
    //     date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    //     const formattedDate = new Date(value).toLocaleString('en-US', {
    //       weekday: 'short',
    //       day: '2-digit',
    //       month: 'short',
    //       year: 'numeric',
    //     });
    //     filterObj["filter[date][eq]"] = date;
    //   }
    // });

    if (!isEmpty(sortColumn)) {
      const sort = `${sortOrder == "desc" ? "-" : ""}${sortColumn}`;
      filterObj["sort"] = sort;
    }
    if (!isEmpty(saveFilterName)) {
      filterObj["saved_search_name"] = saveFilterName;
    }
    onListStateChange({
      pageNo: 1,
      filterOption: filterObj,
      withSelectedRecords: false,
    });
    onClose();
  };

  function areAllObjectValuesEmpty(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] !== "") {
          return false;
        }
      }
    }
    return true;
  }

  useEffect(() => {
    if (isEmpty(filterObj)) {
      setFilterValues({});
    }
  }, [filterObj]);

  return (
    <Dialog
      open={dialogStatus}
      onClose={onClose}
      maxWidth="sm"
      // className="popover_class"
      PaperProps={{
        style: {
          boxShadow: "none",
          borderRadius: "5px",
          margin: "0px",
          padding: "0px",
        },
      }}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={onClose}
        className={classes.title}
      >
        {LBL_SEARCH_EMAIL}
        <IconButton onClick={onClose} className={classes.closeBtn}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        id="filter-email"
        onSubmit={searchFormHandle}
        noValidate
        autoComplete="off"
      >
        <DialogContent className={classes.content}>
          {fieldsArr && (
            <FilterDialogBody
              fieldsArr={fieldsArr}
              filterValues={filterValues}
              handleFieldChange={handleFieldChange}
            />
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => {
              actions.getListViewData(selectedFolderId, 1, {});
              onClose();
            }}
          >
            {LBL_CLEAR_BUTTON_LABEL}
          </Button>
          <Button
            size="small"
            color="primary"
            variant="outlined"
            type="submit"
            disabled={areAllObjectValuesEmpty(filterValues)}
            onClick={searchFormHandle}
          >
            {LBL_SEARCH_BUTTON_LABEL}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const FilterDialogBody = ({ fieldsArr, filterValues, handleFieldChange }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.filterBody}>
      {fieldsArr.map((field) => (
        <Grid item xs={12} key={field.field_key} className={classes.flexRows}>
          <FormInput
            field={field}
            // dynamicEnumValue={filterValues[field.parentenum] || ""}
            onChange={(val) => handleFieldChange(val, field)}
            small={true}
            value={filterValues[field.field_key] || ""}
            view={"SearchLayout"}
          />
        </Grid>
      ))}
    </Grid>
  );
};
export default FilterDialog;
