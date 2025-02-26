import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilterList, Add, ViewColumn } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Badge from "@material-ui/core/Badge";
import {
  getFilterConfig,
  getListView,
} from "../../../../store/actions/module.actions";
import { Filter, ImportFile, ColumnChooser } from "./components";
import useStyles from "./styles";
import {
  LBL_COLUMN_CHOOSER,
  LBL_NEW_BUTTON_LABEL,
  LBL_REPORT_FILTER,
} from "../../../../constant";

const CustomToolbar = ({
  selectAll,
  handleSelectAllChange,
  selectedRecordLength,
}) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [columnChooserVisible, setColumnChooserVisibility] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const classes = useStyles();
  const {
    selectedModule,
    filterConfigLoading,
    filterConfigError,
    filterConfig,
  } = useSelector((state) => state.modules);

  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchFilterConfig = useCallback(() => {
    if (selectedModule) {
      dispatch(getFilterConfig(selectedModule));
    }
  }, [dispatch, selectedModule]);

  useEffect(() => fetchFilterConfig(), [fetchFilterConfig, selectedModule]);

  return (
    <React.Fragment>
      {importModalVisible && (
        <ImportFile
          visible={importModalVisible}
          toggleVisibility={() => setImportModalVisible(!importModalVisible)}
        />
      )}
      {columnChooserVisible && (
        <ColumnChooser
          modalVisible={columnChooserVisible}
          toggleModalVisibility={() =>
            setColumnChooserVisibility(!columnChooserVisible)
          }
        />
      )}
      <div className={classes.container}>
        <span
          className={classes.optionWrapper}
          onClick={() => history.push(`/app/createview/${selectedModule}`)}
        >
          <Add /> {LBL_NEW_BUTTON_LABEL}
        </span>
        <span
          className={classes.optionWrapper}
          onClick={() => setModalVisibility(!modalVisible)}
        >
          <FilterList /> {LBL_REPORT_FILTER}
        </span>

        <span
          className={classes.optionWrapper}
          onClick={(e) => {
            setColumnChooserVisibility(!columnChooserVisible);
          }}
        >
          <ViewColumn /> {LBL_COLUMN_CHOOSER}
        </span>
        <span className={classes.optionWrapper}>
          <Badge badgeContent={selectedRecordLength} max={999} color="primary">
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          </Badge>

          <Menu
            id="openSelectAll"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              {selectAll ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      name="selectAllOption"
                    />
                  }
                  label="Deselect All"
                />
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      name="selectAllOption"
                    />
                  }
                  label={"Select All"}
                />
              )}
            </MenuItem>
          </Menu>
        </span>
      </div>
      <Filter
        modalState={modalVisible}
        handleClose={() => setModalVisibility(!modalVisible)}
        loading={filterConfigLoading}
        error={filterConfigError}
        config={filterConfig[selectedModule]}
        search={(query = undefined) => {
          dispatch(getListView(selectedModule, ...Array(3), query)).then(
            function (res) {},
          );
          setModalVisibility(!modalVisible);
        }}
      />
    </React.Fragment>
  );
};

export default CustomToolbar;
