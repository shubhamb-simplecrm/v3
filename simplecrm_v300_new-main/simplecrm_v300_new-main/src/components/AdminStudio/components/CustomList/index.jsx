import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  Chip,
  withStyles,
} from "@material-ui/core";
import "./styles.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import useStyles from "./styles";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import Scrollbars from "react-custom-scrollbars";
import CustomSearchBar from "./../CustomSearchBar";
import { setSelectedParameter } from "@/store/actions/studio.actions";
import { useDispatch } from "react-redux";
import { FaIcon } from "@/components";
import clsx from "clsx";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {
  LBL_FIELD_MANAGER,
  LBL_LAYOUT_MANAGER,
  LBL_RELATIONSHIP_MANAGER,
  LBL_SUBPANEL_MANAGER,
} from "@/constant";
import { useIsMobileView } from "@/hooks/useIsMobileView";

const CustomList = (props) => {
  const {
    data,
    placeHolder,
    fieldList,
    moduleList,
    handleHideModuleList,
    collapseModuleList,
    addTitle,
    handleGetData,
    handleDelete,
    deleteLoading,
    displaySubText = true,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { manager, view } = useParams();
  const handleOnModuleClick = (moduleName, moduleLabel) => {
    history.push(
      `/app/studio/${moduleName}${manager ? `/${manager}` : ""}${
        manager === LBL_FIELD_MANAGER ? `/addField` : view ? `/${view}` : ""
      }`,
    );
    dispatch(setSelectedParameter(null));
  };
  const [listData, setListData] = useState(data);
  const handleSearchedData = (searchedData) => {
    setListData(searchedData);
  };
  useEffect(() => {
    setListData(data);
  }, [data]);
  return (
    <>
      <CustomHeader
        handleSearchedData={handleSearchedData}
        placeHolder={placeHolder}
        fieldList={fieldList}
        toggleList={handleHideModuleList}
        collapseModuleList={collapseModuleList}
        moduleList={moduleList}
        data={data}
        addTitle={addTitle}
        handleGetData={handleGetData}
      />
      <Scrollbars
        autoHide
        style={{
          height: fieldList ? "79vh" : "86vh",
          overflowX: "hidden",
        }}
      >
        <CustomListData
          listData={listData}
          collapseModuleList={collapseModuleList}
          handleGetData={handleGetData}
          handleOnModuleClick={handleOnModuleClick}
          addTitle={addTitle}
          handleDelete={handleDelete}
          deleteLoading={deleteLoading}
          displaySubText={displaySubText}
        />
      </Scrollbars>
    </>
  );
};

export default CustomList;

export const CustomHeader = (props) => {
  const {
    toggleList,
    fieldList,
    placeHolder,
    collapseModuleList,
    addTitle,
    handleSearchedData,
    data,
    handleGetData,
  } = props;

  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");
  return (
    <Grid
      container
      lg={12}
      md={12}
      direction="row"
      alignItems="center"
      alignContent="center"
      style={{
        padding: "0px 10px",
        height: "50px",
        borderBottom: "1px solid #dedede",
        backgroundColor: "#ffffff",
      }}
    >
      {!fieldList && (
        <Grid item lg={1} md={1} sm={1} xs={1}>
          <IconButton
            size="small"
            edge="start"
            color="primary"
            aria-label="menu"
            onClick={() => toggleList()}
            style={{ paddingLeft: "7px" }}
            disabled={isTabMd || isTabSm}
          >
            {collapseModuleList ? <MenuIcon /> : <ArrowBackIosIcon />}
          </IconButton>
        </Grid>
      )}
      {!collapseModuleList && (
        <>
          <Grid
            item
            lg={fieldList ? (addTitle ? 11 : 12) : 11}
            md={fieldList ? (addTitle ? 11 : 12) : 11}
            sm={fieldList ? (addTitle ? 11 : 12) : 11}
            xs={fieldList ? (addTitle ? 11 : 12) : 11}
          >
            <CustomSearchBar
              data={data}
              handleSearchedData={handleSearchedData}
              placeholder={placeHolder}
            />
          </Grid>
          {addTitle && (
            <Grid item lg={1} md={1} sm={1} xs={1}>
              <Tooltip title={addTitle}>
                <IconButton
                  style={{ padding: "5px" }}
                  onClick={() => handleGetData()}
                >
                  <AddIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export const CustomListData = (props) => {
  const {
    listData = {},
    collapseModuleList,
    handleOnModuleClick,
    handleGetData,
    addTitle,
    handleDelete,
    deleteLoading,
    displaySubText = true,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const isTabMd = useIsMobileView("md");
  const isTabSm = useIsMobileView("sm");
  const history = useHistory();

  const StyledChip = withStyles({
    root: () => ({
      maxWidth: isTabMd || isTabSm ? "100px" : "none",
      whiteSpace: isTabMd || isTabSm ? "nowrap" : "normal",
      overflow: isTabMd || isTabSm ? "hidden" : "visible",
      textOverflow: isTabMd || isTabSm ? "ellipsis" : "clip",
    }),
  })(Chip);

  const { module, manager, view, dropdown } = useParams();
  const handleOnParameterClick = (parameterName, parameterLabel) => {
    history.push(`/app/studio/${module}/${manager}/${parameterName}`);
    dispatch(setSelectedParameter(parameterLabel));
  };
  const isItemSelected = (itemName, parameterList) => {
    if (parameterList) {
      if (view === itemName) return true;
    } else {
      if (module === itemName) return true;
    }
    return false;
  };

  const redirectLink = (item) => {
    return item?.icon
      ? `/app/studio/${item.name}/${manager ? manager : ""}${
          manager === LBL_LAYOUT_MANAGER
            ? `/editView`
            : manager === LBL_RELATIONSHIP_MANAGER
              ? `/addRelationship`
              : manager === LBL_FIELD_MANAGER
                ? `/addField`
                : ""
        }`
      : manager === LBL_FIELD_MANAGER
        ? `/app/studio/${module}/${manager}/${item.name}`
        : manager === LBL_SUBPANEL_MANAGER
          ? `/app/studio/${module}/${manager}/${item.name}`
          : `/app/dropdownEditor/${item.name}`;
  };

  return (
    <List className={classes.list}>
      {Object.values(listData).map((item) => {
        return (
          <ListItem
            className={clsx(classes.listItem, "listItem")}
            onClick={() => {
              item?.icon
                ? handleOnModuleClick(item.name, item.label)
                : handleGetData(item.name, item.label);
            }}
            style={{
              padding: "3px 7px",
              borderBottom: !collapseModuleList ? "1px solid #DEDEDE" : "none",
              backgroundColor:
                module === item.name || view === item.name
                  ? "#f5f5f5"
                  : "#ffffff",
            }}
          >
            {item?.icon && (
              <ListItemAvatar className={classes.listAvatar}>
                <Tooltip title={item.label} placement="right">
                  <Avatar
                    style={{
                      backgroundColor: `${item.bgcolor}`,
                      opacity: 0.8,
                      height: "36px",
                      width: "36px",
                    }}
                  >
                    <FaIcon icon={`fas ${item?.icon}`} />
                  </Avatar>
                </Tooltip>
              </ListItemAvatar>
            )}
            {!collapseModuleList && (
              <>
                <ListItemText
                  onClick={() => {
                    item?.icon
                      ? handleOnModuleClick(item.name, item.label)
                      : handleOnParameterClick(item.name, item.label);
                  }}
                  style={{ cursor: "pointer" }}
                  primary={
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid
                        item
                        lg={item.type ? 8 : 12}
                        md={item.type ? 8 : 12}
                        sm={item.type ? 8 : 12}
                      >
                        <Link to={redirectLink(item)} className={classes.link}>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color:
                                module === item.name ||
                                view === item.name ||
                                dropdown === item.name
                                  ? "rgb(0,113,210)"
                                  : "#424242",
                              wordWrap: "break-word",
                            }}
                          >
                            {item.label}
                          </div>
                        </Link>
                        {displaySubText && (
                          <p
                            style={{
                              color: item?.custom
                                ? "rgb(20,124 ,214, 0.9)"
                                : "rgb(89,94,114, 0.8)",
                              fontSize: "0.75rem",
                              wordWrap: "break-word",
                              margin: "0px",
                            }}
                          >
                            {`(${item?.custom ? "*" : ""}${item.name})`}
                          </p>
                        )}
                      </Grid>
                      {item.type && (
                        <Grid
                          item
                          lg={3}
                          md={3}
                          sm={3}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <StyledChip
                            variant="outlined"
                            label={item.type}
                            size="small"
                            isTabMd={isTabMd}
                            isTabSm={isTabSm}
                            style={{
                              color: "rgb(89,94,114, 0.9)",
                              height: "19px",
                              fontSize:
                                isTabMd || isTabSm ? "0.55rem" : "0.7rem",
                              wordWrap: "break-word",
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  }
                />
                {!item?.icon &&
                  addTitle &&
                  (item?.custom ? (
                      <Tooltip title={"Delete Field"}>
                        <DeleteIcon
                          className={` ${isTabMd || isTabSm ? 'mobile-icon' : 'icon'}`}

                          style={{
                            padding: "2px",
                            color: !deleteLoading
                              ? "rgb(128,128,128,0.6)"
                              : "rgb(128,128,128,0.3)",
                            cursor: "pointer",
                          }}
                          onClick={(event) => {
                            if (!deleteLoading) {
                              event.stopPropagation();
                              handleDelete(item);
                            }
                          }}
                        />
                      </Tooltip>
                  ) : (
                    <DeleteIcon
                      className="icon"
                      style={{
                        padding: "2px",
                        visibility: "hidden",
                        cursor: "none",
                      }}
                    />
                  ))}
              </>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};