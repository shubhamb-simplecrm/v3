import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";

import {
  Card,
  IconButton,
  Avatar,
  CardHeader,
  Menu,
  MenuItem,
  CardContent,
  Typography,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import "./style.css";
import c3 from "c3";
import "c3/c3.min.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { MoreVert } from "@material-ui/icons";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
let gaugeChartJson = {
  bindto: "#chart2",
  data: {
    columns: [["data", 91.4]],
    type: "gauge",
  },
  gauge: {
    label: {
      format: function (value, ratio) {
        return value;
      },
      show: false, // to turn off the min/max labels.
    },
    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
    max: 100, // 100 is default
    units: " %",
    width: 59, // for adjusting arc thickness
  },
  color: {
    pattern: ["#FF0000", "#F97600", "#F6C600", "#60B044"], // the three color levels for the percentage values.
    threshold: {
      unit: "value", // percentage is default
      max: 200, // 100 is default
      values: [30, 60, 90, 100],
    },
  },
  size: {
    height: 180,
  },
};
let pieChartJson = {
  bindto: "#chart1",
  data: {
    // iris data from R
    columns: [
      ["data1", 30],
      ["data2", 120],
    ],
    type: "pie",
  },
};
let chartJson = {
  bindto: "#chart0",
  data: {
    columns: [
      ["data1", 30, 200, 100, 400, 150, 250],
      ["data2", 130, 100, 140, 200, 150, 50],
    ],
    type: "bar",
  },
  bar: {
    width: {
      ratio: 0.5, // this makes bar width 50% of length between ticks
    },
    // or
    //width: 100 // this makes bar width 100px
  },
};
localStorage.removeItem("currentLayout");
let localCurrentLayout = JSON.parse(localStorage.getItem("currentLayout"));
const layoutJson = localCurrentLayout
  ? localCurrentLayout
  : [
      {
        i: 0,
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        minW: 4,
        minH: 4,
        static: false,
        data: [1, 2, 3],
      },
      { i: 1, x: 2, y: 0, w: 2, h: 1, minW: 4, minH: 4, maxW: 4 },
      { i: 2, x: 4, y: 0, w: 2, h: 1, minW: 4, minH: 4 },
      { i: 3, x: 0, y: 0, w: 2, h: 1, minW: 4, minH: 4 },
      { i: 4, x: 2, y: 0, w: 2, h: 1, minW: 4, minH: 4 },
    ];
const Demo = () => {
  const classes = useStyles();
  const [layout, setLayout] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    c3.generate(chartJson);
    c3.generate(pieChartJson);
    c3.generate(gaugeChartJson);
    setLayout(layoutJson);
  }, [layout]);
  const onLayoutChange = (currentLayout, All) => {
    localStorage.setItem("currentLayout", JSON.stringify(currentLayout));
    c3.generate(chartJson);
    c3.generate(pieChartJson);
    c3.generate(gaugeChartJson);
    setLayout(layout);
  };
  const removeGrid = (data) => {
    let newLayout = layout.filter((item) => {
      return item.i !== data.i;
    });
    setLayout(newLayout);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <h1>Demo Page</h1>
      <ResponsiveReactGridLayout
        className="layout"
        layouts={layout}
        onLayoutChange={onLayoutChange}
        onResizeStop={onLayoutChange}
        useCSSTransforms={true}
        rowWidth={400}
        rowHeight={400}
        width={1200}
      >
        {layout.map((data) => (
          <Card className={classes.root} key={data.i}>
            <CardHeader
              avatar={<i className={"fas fas fa-cube fa-1x"}></i>}
              action={
                <>
                  <IconButton
                    aria-label="settings"
                    style={{ color: "#fff" }}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVert />
                  </IconButton>

                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>Refresh</MenuItem>
                    <MenuItem onClick={() => removeGrid(data)}>Remove</MenuItem>
                  </Menu>
                </>
              }
              title="Dashlet"
              style={{
                backgroundColor: "#040c2c",
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "5px 10px",
              }}
            />

            <CardContent>
              {data.i == 0 ? (
                <div id={"chart" + data.i}></div>
              ) : (
                <>
                  <div id={"chart" + data.i}></div>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Dessert (100g serving)</TableCell>
                          <TableCell align="right">Calories</TableCell>
                          <TableCell align="right">Fat&nbsp;(g)</TableCell>
                          <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                          <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </ResponsiveReactGridLayout>
    </>
  );
};

export default Demo;
