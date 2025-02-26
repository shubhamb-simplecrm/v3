import React, { useState } from "react";
import { CircularProgress, Checkbox, FormControlLabel } from "@material-ui/core";
import { Delete, Update, CloudDownload, Add } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  massUpdate,
  getListView,
} from "../../../../store/actions/module.actions";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Badge from '@material-ui/core/Badge';
import { MassUpdateModal, AddToTargetListModal } from "./components";
import { pathOr } from "ramda";
import { toast } from "react-toastify";
import useStyles from "./styles";
import { Alert } from "../../../";
import { LBL_ADD_TO_TARGET_LIST, LBL_ADD_TO_TARGET_LIST_SUCCESS, LBL_CONFIRM_DELETE_DESCRIPTION, LBL_CONFIRM_DELETE_TITLE, LBL_CONFIRM_EXPORT_DESCRIPTION, LBL_CONFIRM_EXPORT_TITLE, LBL_EXPORT_INPROGRESS, LBL_RECORD_DELETED, LBL_RECORD_UPDATED, LBL_REPORT_DOWNLOAD_SUCCESS_MESSAGE, SOMETHING_WENT_WRONG } from "../../../../constant";
import { getNotifications } from "../../../../store/actions/notification.actions";
import { isSocketAllow } from "../../../../utils/socket.utils";

const CustomToolbarSelect = ({
  selectAll,
  handleSelectAllChange,
  selectedRecord,
  selectedRecordLength,
}) => {
  const [massUpdateModalVisible, setMassUpdateModalVisible] = useState(false);
  const [addToTargetModalVisible, setAddToTargetModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [alertInfo, setAlertInfo] = useState({
    title: "",
    msg: "",
    visible: false,
    action: "",
  });
  const [loading, setLoading] = useState(false);
  const styles = useStyles();
  const { selectedModule, listViewTabData } = useSelector(
    (state) => state.modules,
  );
  const where = pathOr({}, ['data', 'templateMeta', 'where'], listViewTabData[selectedModule]);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buildPayloadForMassUpdate = (action, type, id, attributes = [], prospect_list = "") => ({
    action,
    data: {
      type,
      id,
      attributes,
      prospect_list
    },
  });

  const deleteRecords = async () => {
    try {
      setLoading(true);
      let recordsToDelete = selectAll ? ['All', where] : selectedRecord;   //getSelectedRecordIds();
      const payload = buildPayloadForMassUpdate(
        "delete",
        selectedModule,
        recordsToDelete,
      );
      let res = await massUpdate(payload);
      if (res.ok) {
        setLoading(false);
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(LBL_RECORD_DELETED);
        dispatch(getListView(selectedModule));
      } else {
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(res.data.errors.detail);

      }
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const updateRecords = async (fieldsToUpdate) => {
    try {
      setLoading(true);
      let selectedRecordsIds = selectAll ? ['All', where] : selectedRecord;    //getSelectedRecordIds();
      const payload = buildPayloadForMassUpdate(
        "update",
        selectedModule,
        selectedRecordsIds,
        fieldsToUpdate,
      );
      let res = await massUpdate(payload);
      if (res.ok) {
        setLoading(false);
        toast(LBL_RECORD_UPDATED);
        dispatch(getListView(selectedModule));
      } else {
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(res.data.errors.detail);

      }
    } catch (e) {
      toast(SOMETHING_WENT_WRONG);
    }
  };

  const addIdToTargetList = async (propspectListId) => {
    try {
      setLoading(true);
      let recordsToBeAddedIds = selectAll ? ['All', where] : selectedRecord; //getSelectedRecordIds();
      const payload = buildPayloadForMassUpdate(
        "addToTargetList",
        selectedModule,
        recordsToBeAddedIds,
        [],
        propspectListId
      );
      let res = await massUpdate(payload);
      if (res.ok) {
        setLoading(false);
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(LBL_ADD_TO_TARGET_LIST_SUCCESS);
        dispatch(getListView(selectedModule));
      } else {
        setAlertInfo((prev) => ({ ...prev, visible: false }));
        toast(res.data.errors.detail);

      }
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(SOMETHING_WENT_WRONG);
    }
  }

  const recordsExport = async () => {
    try {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      let recordIdsToBeExported = selectAll ? ['All', where] : selectedRecord; //getSelectedRecordIds();
      const payload = buildPayloadForMassUpdate(
        "export",
        selectedModule,
        recordIdsToBeExported,
        [],
      );
      toast(LBL_EXPORT_INPROGRESS);
      let res = await massUpdate(payload);

      if (res.ok) {

        setLoading(false);
        if(!isSocketAllow) dispatch(getNotifications());
        toast(LBL_REPORT_DOWNLOAD_SUCCESS_MESSAGE);
      } else {
        toast(res.data.errors.detail);
      }
    } catch (e) {
      setAlertInfo((prev) => ({ ...prev, visible: false }));
      toast(SOMETHING_WENT_WRONG);
    }
  }
  return (
    <div className={styles.container}>
     
      {massUpdateModalVisible && (
        <MassUpdateModal
          updateRecords={updateRecords}
          updateLoader={loading}
          modalVisible={massUpdateModalVisible}
          toggleModalVisibility={() =>
            setMassUpdateModalVisible(!massUpdateModalVisible)
          }
        />
      )}
      {addToTargetModalVisible && (
        <AddToTargetListModal
          modalVisible={addToTargetModalVisible}
          toggleModalVisibility={() =>
            setAddToTargetModalVisible(!addToTargetModalVisible)
          }
          addIdToTargetList={addIdToTargetList}
          selectedModule={selectedModule}
        />
      )}
      {(selectedModule === "Contacts" || selectedModule === "Accounts") && <span
        className={styles.optionWrapper}
        onClick={() => setAddToTargetModalVisible(!addToTargetModalVisible)}
      >
        <Add fontSize="small" style={{ marginRight: "3px" }} /> {LBL_ADD_TO_TARGET_LIST}
      </span>}
      <span
        className={styles.optionWrapper}
        onClick={() =>
          setAlertInfo((prev) => ({
            ...prev,
            title: LBL_CONFIRM_EXPORT_TITLE,
            msg: LBL_CONFIRM_EXPORT_DESCRIPTION,
            visible: true,
            action: recordsExport,
          }))
        }
      >
        <CloudDownload fontSize="small" style={{ marginRight: "5px" }} /> Export
      </span>
      <span
        className={styles.optionWrapper}
        onClick={() => setMassUpdateModalVisible(!massUpdateModalVisible)}
      >
        <Update fontSize="small" style={{ marginRight: "3px" }} /> Mass update
      </span>
      <span
        className={styles.optionWrapper}
        onClick={() =>
          setAlertInfo((prev) => ({
            ...prev,
            title: LBL_CONFIRM_DELETE_TITLE,
            msg: LBL_CONFIRM_DELETE_DESCRIPTION,
            visible: true,
            action: deleteRecords,
          }))
        }
      >
        <Delete fontSize="small" style={{ marginRight: "3px" }} /> Delete
      </span>
      <span>
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
          <MenuItem >
            {selectAll ?
              <FormControlLabel
                control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} name="selectAllOption" />}
                label="Deselect All"
              /> : <FormControlLabel
                control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} name="selectAllOption" />}
                label={"Select All"}
              />}
          </MenuItem>

        </Menu>
      </span>
      <Alert
        title={alertInfo.title}
        msg={alertInfo.msg}
        open={alertInfo.visible}
        agreeText={loading ? <CircularProgress /> : "Yes"}
        disagreeText={!loading && "No"}
        handleClose={() => setAlertInfo({ visible: false })}
        onAgree={() => alertInfo.action()}
      />
    </div>
  );
};

export default CustomToolbarSelect;
