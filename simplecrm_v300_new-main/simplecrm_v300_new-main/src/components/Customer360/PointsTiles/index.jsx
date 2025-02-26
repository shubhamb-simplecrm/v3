import React, { useState, useEffect } from "react";
// styles
import useStyles, { getMuiTheme } from "./styles";
import { useTheme, Grid, Typography, Avatar } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import FaIcon from "../../FaIcon";
import { toast } from "react-toastify";
import { c360TilesData } from "../../../store/actions/customer360.actions";
import { pathOr } from "ramda";
import { useCallback } from "react";

export default function PointsTiles({
  id,
  setCountDataOpportunites,
  setCountDataCases,
  setCountDataAccounts,
  setCountDataDocument,
  setCountJeevesSubscription,
  setCountDataNotes,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [tileData, setTileData] = useState("");
  const [tileCaseData, setTileCaseData] = useState("");

  const getTileData = useCallback(() => {
    c360TilesData(id).then((res) => {
      if (res.ok) {
        let data = pathOr("", ["data", "data"], res);
        setTileData(data?.total_oppo_amount);
        setTileCaseData(data?.total_inprocess_cases);
        setCountDataAccounts(data?.activities_count);
        setCountDataCases(data?.cases_count);
        setCountDataDocument(data?.documents_count);
        setCountDataOpportunites(data?.opportunities_count);
      }
    });
  }, [id]);

  useEffect(() => {
    getTileData();
  }, [getTileData]);

  let finalArray = [
    {
      label: "Value of Products",
      value: tileData,
      color: "rgb(144,190,109)",
      icon: "fas fa-comment-dollar",
      bgcolor: "rgb(144,190,109)",
      color1: "white",
    },
    {
      label: "Cases in Progress",
      value: tileCaseData,
      color: "rgb(249,65,68)",
      icon: "fas fa-exclamation-circle",
      color1: "white",
      bgcolor: "rgb(249,65,68)",
    },
    {
      label: "Average NPS",
      value: "9",
      color: "rgb(39,125,161)",
      icon: "fas fa-smile-beam",
      bgcolor: "rgb(39,125,161)",
      color1: "white",
    },
  ];
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>
      <Grid container className={classes.root}>
        {finalArray.map((item, index) => {
          return (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className={classes.topRow}
              style={{ backgroundColor: item.color, alignText: "center" }}
            >
              <Grid item>
                <Typography align="left" className={classes.noData}>
                  <Avatar
                    className={classes.icon}
                    style={{ backgroundColor: item.bgcolor }}
                  >
                    <FaIcon
                      icon={item.icon}
                      color={item.color1}
                      background="red"
                      size="0x"
                    />
                  </Avatar>
                </Typography>
                <Typography
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                    paddingLeft: "5px",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  style={{ fontSize: "0.875rem", textAlign: "center" }}
                >
                  {item.value}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </MuiThemeProvider>
  );
}
