import React, { useState } from "react";
import {Modal,Grid,Button,Paper,Typography,} from "@material-ui/core";
import { Clear } from "@material-ui/icons";

import { FormInput } from "../../../../../";
import { pathOr, clone } from "ramda";
import useStyles from "./styles";
import { LBL_RESET_BUTTON_LABEL, LBL_SEARCH_BUTTON_LABEL, LBL_SEARCH_FORM_TITLE } from "../../../../../../constant";

const Filter = ({ handleClose, modalState, config, search }) => {
  const classes = useStyles();
  const [filterValues, setFilterValues] = useState({});

  let advanced_fields = pathOr(
    [],
    ["templateMeta", "data", "advanced_search"],
    config,
  );

  const resetFilter = () => {
    const filterValuesCopy = clone(filterValues);
    for (let val in filterValuesCopy) {
      filterValuesCopy[val] = "";
    }
    setFilterValues(filterValuesCopy);
    search();
  };

  const buildFilterQuery = () => {
    let filterQuery = "";
    let operator = 'eq';
    for (let key in filterValues) {
      if (filterValues[key]) {
      if(key==='first_name' || key==='last_name' || key==='name') 
      {
        operator= 'lke';
      }
        if (typeof filterValues[key] !== "object") {
          filterQuery =
            filterQuery + `filter[${key}][${operator}]=${filterValues[key]}&`;
        } else {
          filterQuery =
            filterQuery + `filter[${key}][${operator}]=${filterValues[key].id}&`;
        }
      }
    }
    return filterQuery;
  };

  const renderTabBody = () => {
    const currencyIndex = advanced_fields.findIndex(it => it.type === "currency");
    const currencyField = advanced_fields.splice(currencyIndex, 1);
    advanced_fields.push(...currencyField);
    return (
      <Grid container spacing={2} className={classes.fieldsGrid}>
        {advanced_fields.map((field) => (
          <Grid item xs={field.type === "currency" ? 12 : 6} md={field.type === "currency" ? 8 : 4} key={field.field_key}>
            <FormInput
              field={field}
              onChange={(val) => {
                setFilterValues({ ...filterValues, [field.field_key]: val })
              }
              }
              small={true}
              value={filterValues[field.field_key] || ""}
            />
          </Grid>
        ))}
        <div className={classes.buttonsWrapper}>
          <Button
            variant="contained" //text
            onClick={() => resetFilter()}
            color="primary"
            size="medium"
            fullWidth
            disableElevation
            style={{ margin: 5, width: "100px" }}
          >
            {LBL_RESET_BUTTON_LABEL}
          </Button>

          <Button
            variant="contained"
            onClick={() => search(buildFilterQuery())}
            color="primary"
            size="medium"
            fullWidth
            disableElevation
            style={{ margin: 5, width: "100px" }}
          >{LBL_SEARCH_BUTTON_LABEL}
          </Button>

        </div>
      </Grid>
    );
  };

  const renderBody = () => (
    <Paper square className={classes.paper}>
      <div className={classes.titleHeadWrapper}>
        <Typography
          variant="h6"
          style={{ fontWeight: "400" }}
        >
          {LBL_SEARCH_FORM_TITLE}
          </Typography>
        <Clear onClick={handleClose} />
      </div>
      {renderTabBody()}
    </Paper>
  );

  return (
    <Modal
      open={modalState}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {renderBody()}
    </Modal>
  );
};

export default Filter;
