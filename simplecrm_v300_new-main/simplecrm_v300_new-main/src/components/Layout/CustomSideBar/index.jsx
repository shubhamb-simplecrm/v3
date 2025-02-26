import clsx from "clsx";
import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import useStyles from "./styles";
import BrandLogo from "../../BrandLogo";
import { CustomSideBarItem } from "./components/CustomSideBarItem";
import { useSelector } from "react-redux";
import { memo } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useState } from "react";
import { CustomSidebarSearchBar } from "./components/CustomSidebarSearchBar";
import { useIsMobileView } from "../../../hooks/useIsMobileView";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return Object.fromEntries(
      Object.entries(data).filter(([key, data]) =>
        data?.label?.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }
};

const CustomSideBar = (props) => {
  const { handleDrawerClose, drawerState } = props;
  const sidebarLinks = useSelector(
    (state) => state?.layout?.sidebarLinks?.attributes,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, sidebarLinks);
  let isMobileViewCheck = useIsMobileView();
  return isMobileViewCheck ? (
    <MobileViewSidebar
      drawerState={drawerState}
      dataFiltered={dataFiltered}
      handleDrawerClose={handleDrawerClose}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  ) : (
    <DeskTopViewSidebar
      drawerState={drawerState}
      dataFiltered={dataFiltered}
      handleDrawerClose={handleDrawerClose}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isMobileViewCheck={isMobileViewCheck}
    />
  );
};
const DeskTopViewSidebar = memo(
  ({
    drawerState,
    dataFiltered,
    handleDrawerClose,
    searchQuery,
    setSearchQuery,
    isMobileViewCheck,
  }) => {
    const classes = useStyles();
    return (
      <Drawer
        variant={isMobileViewCheck ? "temporary" : "permanent"}
        open={drawerState}
        anchor="left"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerState,
          [classes.drawerClose]: !drawerState,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: drawerState,
            [classes.drawerClose]: !drawerState,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
          <Link to="/app/Home">
            <BrandLogo />
          </Link>
        </div>
        {drawerState && (
          <CustomSidebarSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <CustomSidebarList listData={dataFiltered} drawerState={drawerState} />
      </Drawer>
    );
  },
);
const MobileViewSidebar = memo(
  ({
    drawerState,
    dataFiltered,
    handleDrawerClose,
    searchQuery,
    setSearchQuery,
  }) => {
    const classes = useStyles();
    return (
      <Drawer
        className={classes.drawer}
        variant="temporary"
        // variant="persistent"
        anchor="left"
        open={drawerState}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar}>
          <Link to="/app/Home">
            <BrandLogo />
          </Link>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        {drawerState && (
          <CustomSidebarSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        <CustomSidebarList listData={dataFiltered} drawerState={drawerState} />
      </Drawer>
    );
  },
);

const CustomSidebarList = memo(({ listData, drawerState }) => {
  return (
    <Scrollbars autoHide>
      <List>
        {listData &&
          Object.entries(listData).map(([text, object], index) => (
            <CustomSideBarItem
              key={`${text}`}
              moduleKey={text}
              metaObject={object}
              drawerState={drawerState}
            />
          ))}
      </List>
    </Scrollbars>
  );
});
export default memo(CustomSideBar);
