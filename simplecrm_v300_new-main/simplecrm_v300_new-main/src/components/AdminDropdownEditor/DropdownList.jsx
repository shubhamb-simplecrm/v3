import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import { Grid } from "@material-ui/core";
import { Skeleton } from "..";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Button } from "../SharedComponents/Button";
import CustomSearchBar from "../AdminStudio/components/CustomSearchBar";

const DropdownList = ({data, listData, handleSearchedData, isLoading}) => {
  const classes = useStyles();
  const history = useHistory();
  const handleOnDropdownClick = (dropdownName) => {
    history.push(`/app/dropdownEditor/${dropdownName}`);
  };
  if (isLoading) {
    return <Skeleton />;
  }
  return (
    <>
      <DropdownListHeader handleSearchedData={handleSearchedData} data={data} />
      <Grid
        container
        lg={12}
        spacing={1}
        className={classes.grid}
        alignContent="flex-start"
        alignItems="flex-start"
      >
        {Object.keys(listData).map((item) => {
          return (
            <Grid
              item
              lg={4}
              className={classes.moduleTile}
              onClick={() => handleOnDropdownClick(item)}
            >
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <div className={classes.title}>{item}</div>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default DropdownList;

export const DropdownListHeader = ({ handleSearchedData, data }) => {
  const classes = useStyles();
  const history = useHistory();
  const handleAddDropdown = () => {
    history.push(`/app/dropdownEditor/addDropdown`);
  };
  return (
    <>
      <Grid
        container
        lg={12}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <span
            style={{
              fontWeight: "bold",
              color: "rgb(0,113,210)",
              paddingLeft: "20px",
              fontSize: "1.2rem",
            }}
          >
            Dropdown List
          </span>
        </Grid>
        <Grid item>
          <Grid container lg={12} justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Button
                label={"Add"}
                onClick={handleAddDropdown}
                startIcon={<AddIcon />}
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item className={classes.searchBar}>
              <CustomSearchBar
                data={data}
                applyBorder={true}
                handleSearchedData={handleSearchedData}
                placeholder={"Search Dropdown"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
