import React, { useEffect, useState } from "react";
import EditOptionView from "../AdminStudio/components/FieldManager/EditOptionView";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { Skeleton } from "..";
import CustomList from "../AdminStudio/components/CustomList";
import { Button, Grid, Tooltip } from "@material-ui/core";
import useStyles from "./styles";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { api } from "@/common/api-utils";
import DefaultAddView from "../AdminStudio/DefaultAddView";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { LBL_EXIT, LBL_VIEW_HISTORY } from "@/constant";
import HistoryIcon from "@material-ui/icons/History";
import StudioAuditView from "../AdminStudio/components/StudioAuditView";

const AdminDropdownEditor = () => {
  const { dropdown } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuditDialogVisible, setIsAuditDialogVisible] = useState(false);
  const toggleDialogVisibility = () => {
    setIsAuditDialogVisible(!isAuditDialogVisible);
  };

  const getDropDownList = async () => {
    setIsLoading(true);
    const res = await api.get(`V8/studio/getDropdownList`);
    if (res.ok) {
      setIsLoading(false);
      let tempData = {};
      res.data.data.map((item) => {
        tempData[item] = { label: item, name: item };
      });
      setData(tempData);
    }
  };
  useEffect(() => {
    getDropDownList();
  }, [dropdown]);

  return (
    <div className={classes.paper}>
      {isAuditDialogVisible ? (
        <StudioAuditView
          isDialogVisible={isAuditDialogVisible}
          toggleDialogVisibility={toggleDialogVisibility}
        />
      ) : null}{" "}
      <Grid container lg={12} md={12} sm={12}>
        <Grid item lg={12} md={12} sm={12} style={{borderBottom:"1px solid #dedede"}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"right", gap:"10px", padding:"8px"}}>
          <Tooltip title={LBL_VIEW_HISTORY}>
            <HistoryIcon
              color="primary"
              onClick={() => toggleDialogVisibility()}
            />
          </Tooltip>
          <Button
            onClick={() => {
              history.push(`/app/portalAdministrator`);
            }}
            size="small"
            variant="outlined"
            color="primary"
            endIcon={<ExitToAppIcon />}
          >
            {LBL_EXIT}
          </Button>
          </div>
        </Grid>
        <Grid item lg={3} md={3} sm={3}className={classes.border}>
          <CustomList
            placeHolder={"Search Dropdown"}
            data={data}
            fieldList={true}
            handleGetData={(dropdownName) =>
              history.push(
                `/app/dropdownEditor/${
                  dropdownName ? dropdownName : "addDropdown"
                }`,
              )
            }
            addTitle={"Add Dropdown"}
            displaySubText={false}
          />
        </Grid>
        <Grid item lg={9} md={9} sm={9} className={classes.editLayout}>
        {isLoading ? (
            <Skeleton layout={"Studio"} />
          ) : (
            <>
              {dropdown ? (
                <EditOptionView dropdownList={data}/>
              ) : (
                <DefaultAddView
                  title={"Add Dropdown"}
                  onAddClick={() =>
                    history.push(`/app/dropdownEditor/addDropdown`)
                  }
                />
              )}
            </>
          )}

        </Grid>
      </Grid>
      {/* ) : (
        <DropdownList
          data={data}
          listData={listData}
          handleSearchedData={handleSearchedData}
          isLoading={isLoading}
        />
      )} */}
    </div>
  );
};
export default AdminDropdownEditor;
