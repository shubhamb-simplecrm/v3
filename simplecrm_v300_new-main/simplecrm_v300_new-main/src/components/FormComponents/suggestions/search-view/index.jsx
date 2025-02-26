import React, {useEffect} from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ClearIcon from '@material-ui/icons/Clear';
import { pathOr } from "ramda";

import { FormInput } from "../../../";
import useStyles from "../styles";
import { LBL_RESET_BUTTON_LABEL, LBL_SEARCH_BUTTON_LABEL, LBL_SEARCH_FORM_TITLE } from "../../../../constant";

const SearchView = ({
  relateFieldData,
  resetFields,
  search,
  searchFields,
  setSearchFields,
  moduleLabel,
  searchFieldsMeta,
  setSearchFieldsMeta,
  stopParentSubmit
}) => {
  const classes = useStyles();

  let searchViewFields = pathOr(
    [],
    ["templateMeta", "searchview"],
    relateFieldData,
  );

  useEffect(()=>{
    setSearchFields(searchFields)
  },[searchFields]);
  
  if (!searchViewFields.length) return null;
  const searchFormHandle = (event) => {
    event.preventDefault();
    stopParentSubmit(event)
    search()
  }

  

  return (

    <form  id='relate-search-form'  onSubmit={searchFormHandle}  noValidate autoComplete="off">
      <div className={classes.perSectionWrapper}>
        <Typography color="primary" className={classes.sectionTitle}>
          {LBL_SEARCH_FORM_TITLE}
        </Typography>
        <Grid container spacing={2}>
          {searchViewFields.map((field) => {
            if(field.type==='email')
            {
              field.type = 'varchar';
            }
            return (
              <Grid
                item
                xs={field.type === "currency" ? 12 : 12}
                md={field.type === "currency" ? 8 : 4}
                key={field.field_key}
              >
                <FormInput
                  field={field}
                  key={field.field_key}
                  small={true}
                  onChange={(val) => {
                    searchFields[field.field_key]=val;
                    setSearchFields(searchFields);
                    searchFieldsMeta[field.field_key]=field;
                    setSearchFieldsMeta(searchFieldsMeta);

                    if(field.type==='datetime' || field.type==='datetimecombo')
                    {
                      searchFields[field.field_key]= val[`${field.field_key}`];
                      searchFields[`${field.field_key}_range_choice`]= val[`${field.field_key}_range_choice`];
                      searchFields[`range_${field.field_key}`]= val[`range_${field.field_key}`];
                      searchFields[`start_range_${field.field_key}`]= val[`start_range_${field.field_key}`];
                      searchFields[`end_range_${field.field_key}`]= val[`end_range_${field.field_key}`];

                      setSearchFields(searchFields);
                    
                      searchFieldsMeta[field.field_key]= field;
                      searchFieldsMeta[`${field.field_key}_range_choice`]= field; 
                      searchFieldsMeta[`range_${field.field_key}`]= field;
                      searchFieldsMeta[`start_range_${field.field_key}`]= field;
                      searchFieldsMeta[`end_range_${field.field_key}`]= field;

                      setSearchFieldsMeta(searchFieldsMeta);
                    }
                  }
                  }
                  value={typeof(searchFields[field.field_key])==='object'? searchFields[field.field_key]['value']:searchFields[field.field_key] || ''}
                  range_date_entered={field['range_'+field.field_key]&&(searchFields[field['range_'+field.field_key]] || field['range_'+field.field_key] || "")}
                  start_range_date_entered={field['start_range_'+field.field_key]&&(searchFields[field['start_range_'+field.field_key]] || field['start_range_'+field.field_key] || "")}
                  end_range_date_entered={field['end_range_'+field.field_key]&&(searchFields[field['end_range_'+field.field_key]] || field['end_range_'+field.field_key] || "")}
                  view={'SearchLayout'}
                />
              </Grid>
            );
          })}
          <div className={classes.buttonsWrapper}>
            <Button
              variant="contained"
              onClick={() => resetFields(searchFields, "setSearchFields")}
              color="primary"
              size="small"
              className={classes.cstmBtn}
              disableElevation
              type="button"
            >
              <ClearIcon /> {LBL_RESET_BUTTON_LABEL}
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.cstmBtn}
              disableElevation
              type="submit"
              form='relate-search-form'
            >
              <Search /> {LBL_SEARCH_BUTTON_LABEL}
            </Button>
          </div>
        </Grid>
      </div>
    </form>
  );
};

export default SearchView;
