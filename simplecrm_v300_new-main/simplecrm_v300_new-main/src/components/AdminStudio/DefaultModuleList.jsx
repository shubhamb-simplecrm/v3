import React, { useState } from "react";
import useStyles from "./styles";
import { Avatar, Grid, Paper } from "@material-ui/core";
import { FaIcon } from "..";
import { setSelectedParameter } from "@/store/actions/studio.actions";
import { useDispatch } from "react-redux";
import CustomSearchBar from "./components/CustomSearchBar";
import {
  LBL_SEARCH_MODULE_PLACEHOLDER,
  MODULE_NOT_FOUND_MESSAGE,
} from "@/constant";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { isEmpty } from "ramda";
import clsx from "clsx";
import  NoRecord  from "../NoRecord/index";

const DefaultModuleList = ({ data }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [listData, setListData] = useState(data);
  const handleSearchedData = (searchedData) => {
    setListData(searchedData);
  };
  const handleOnModuleClick = () => {
    dispatch(setSelectedParameter(null));
  };
  return (
    <Paper style={{ height: "90vh" }}>
      <div className={classes.moduleListContainer}>
        <div className={classes.searchArea}>
          <Grid container lg={12} justifyContent="flex-end">
            <Grid item lg={2}>
              <CustomSearchBar
                data={data}
                applyBorder={true}
                handleSearchedData={handleSearchedData}
                placeholder={LBL_SEARCH_MODULE_PLACEHOLDER}
              />
            </Grid>
          </Grid>
        </div>
        <div className={clsx(classes.root, classes.moduleList)}>
          <Grid container lg={12} md={12} sm={12} style={{padding:"25px"}}>
            {isEmpty(listData) ? (
              <NoRecord view="studio"/>
            ) : (
              Object.values(listData).map((module) => {
                return (
                  <Grid
                    container
                    lg={3}
                    md={4}
                    sm={6}
                    onClick={() => handleOnModuleClick()}
                  >
                    <Link
                      to={`/app/studio/${module.name}`}
                      className={classes.link}
                    >
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        className={classes.moduleLabelGrid}
                      >
                        <Grid item>
                          <Avatar
                            style={{ backgroundColor: `${module.bgcolor}20` }}
                          >
                            <FaIcon
                              icon={`fas ${module.icon}`}
                              color={`${module.bgcolor}`}
                            />
                          </Avatar>
                        </Grid>
                        <Grid item>
                          <div className={classes.title}>{module.label}</div>
                          <span className={classes.subtitle}>
                            ({module.name})
                          </span>
                        </Grid>
                      </Grid>
                    </Link>
                  </Grid>
                );
              })
            )}
          </Grid>
        </div>
      </div>
    </Paper>
  );
};

export default DefaultModuleList;
