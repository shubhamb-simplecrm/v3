import React from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ClearIcon from '@material-ui/icons/Clear';
import { pathOr } from "ramda";
import { FormInput } from "../../../../../../";
import useStyles from "../styles";
import { LBL_RESET_BUTTON_LABEL, LBL_SEARCH_BUTTON_LABEL, LBL_SEARCH_FORM_TITLE } from "../../../../../../../constant";

const SearchView = ({
  prospectListData,
  resetFields,
  search,
  searchFields,
  setSearchFields,
  searchFieldsMeta,
  setSearchFieldsMeta,
}) => {
  const classes = useStyles();

  let searchViewFields = pathOr(
    [],
    ["templateMeta", "searchview"],
    prospectListData,
  );

  if(!searchViewFields.length) return null;

  return (
    <div className={classes.perSectionWrapper}>
      <Typography color="primary" className={classes.sectionTitle}>
        {LBL_SEARCH_FORM_TITLE}
      </Typography>
      <Grid container spacing={2}>
        {searchViewFields.map((field) => {
          return (
            <Grid
              item
              xs={field.type === "currency" ? 12 : 6}
              md={field.type === "currency" ? 8 : 4}
              key={field.field_key}
            >
              <FormInput
                field={field}
                key={field.field_key}
                small={true}
                onChange={(val) =>{
                  setSearchFields({ ...searchFields, [field.field_key]: val });
                  setSearchFieldsMeta({ ...searchFieldsMeta, [field.field_key]: field });
                }
                }
                value={searchFields[field.field_key]}
              />
            </Grid>
          );
        })}
        <div className={classes.buttonsWrapper}>
          <Button
            variant="contained"
            onClick={() => resetFields(searchFields, "setSearchFields")}
            color="primary"
            size="medium"
            className={classes.cstmBtn}
            disableElevation
            style={{ margin: 5, width: "100px" }}
          >
            <ClearIcon /> {LBL_RESET_BUTTON_LABEL}
          </Button>

          <Button
            variant="contained"
            onClick={search}
            color="primary"
            size="medium"
            className={classes.cstmBtn}
            disableElevation
            style={{ margin: 5, width: "100px" }}
          >
            <Search />{LBL_SEARCH_BUTTON_LABEL}
          </Button>
        </div>
      </Grid>
    </div>
  );
};

export default SearchView;
