import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
// styles
import useStyles, { getMuiTheme } from "./styles";
import {
  useTheme,
  FormControl,
  Box,
  Input,
  InputAdornment,
  Divider,
  Typography,
  Grid,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { Scrollbars } from "react-custom-scrollbars";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { pathOr } from "ramda";
import {
  LBL_GLOBAL_SEARCH_TEXT_PLACEHOLDER,
  LBL_GLOBAL_SMART_SEARCH_TITLE,
  LBL_SEARCH_BUTTON_LABEL,
} from "../../../../constant";
import RecordItem from "./components/RecordItem";
import FaIcon from "../../../FaIcon";
import { NoRecord } from "../GlobalSearch/components";
import FileViewerComp from "../../../FileViewer/FileViewer";
import { api } from "../../../../common/api-utils";
import DrawerHeader from "../DrawerHeader";
import useDebounce from "@/hooks/useDebounce";
import useSmartSearchDataFetch from "./hooks/useSmartSearchDataFetch";
import { Skeleton } from "@/components";
import useComposeViewData from "@/components/ComposeEmail/hooks/useComposeViewData";
function TabPanel(props) {
  const { children, value, index, module, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      name={module}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
export default function SmartSearch({ module, onCloseRightSideBar }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [queryString, setQueryString] = useState("");
  const [currentModule, setCurrentModule] = useState(
    module || "AOK_KnowledgeBase",
  );
  const debouncedInputValue = useDebounce(queryString, 500);
  const { loading, responseData, setResponseData, isInitState } =
    useSmartSearchDataFetch(debouncedInputValue, currentModule);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailModal, setEmailModal] = useState({
    visible: false,
    to: "",
    parent_id: "",
    parent_name: "",
    parent_type: "",
  });
  const { emailLoading, actions } = useComposeViewData((state) => ({
    emailLoading: state.emailLoading,
    actions: state.actions,
  }));
  const { sidebarLinks } = useSelector((state) => state.layout);
  const handleSearch = async (e) => {
    if (queryString && queryString.length > 2) {
      let queryParams = {
        "page[number]": 1,
        "page[size]": 10,
        "filter[tags_c][eq]": `%${queryString.toString()}%`,
        "filter[disableSaveSearch][eq]": true,
      };
      api
        .get(`/V8/layout/ListView/${currentModule}/1`, queryParams)
        .then((res) => {
          let data = pathOr(null, ["data", "data", "templateMeta"], res);
          if (data) {
            setResponseData(data);
          }
        })
        .catch((err) => {
          console.error("Error", err);
          setResponseData([]);
        });
    } else {
      setResponseData([]);
    }
  };
  const clearSearch = () => {
    setResponseData([]);
    setQueryString("");
  };
  const handleEmailPopup = (data) => {
    setEmailModal(data);
    setEmailModalVisible(true);
    actions.handleOpenEmailCompose(
      {
        moduleName: emailModal.parent_type || "",
        recordId: emailModal.parent_id || "",
      },
      {
        to_addrs_names: emailModal && emailModal.to ? [emailModal.to] : [],
        parent_name: {
          parent_name: emailModal.parent_name || "",
          parent_id: emailModal.parent_id || "",
          parent_type: emailModal.parent_type || "",
        },
      },
      data?.type,
    );
  };

  const renderBody = () => {
    if (!!loading) {
      return <Skeleton />;
    }
    if (isInitState) {
      return <NoRecord type="warning" title={LBL_SEARCH_BUTTON_LABEL} />;
    }
    if (!responseData?.data?.length) {
      return <NoRecord type="error" title="No Records Found!" />;
    }
    return (
      <Scrollbars autoHide={true} className={classes.contentHeight}>
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          spacing={3}
          className={classes.recordList}
        >
          <Grid item xs={12} sm={12}>
            {responseData &&
              responseData.data &&
              responseData.data.length > 0 &&
              responseData.data.map((record, recordkey) => (
                <RecordItem
                  key={"record-" + recordkey}
                  datalabels={responseData?.datalabels}
                  id={record.id}
                  data={record.attributes}
                  module={currentModule}
                  color={pathOr(
                    "#ccc",
                    ["attributes", currentModule, "icon", "bgcolor"],
                    sidebarLinks,
                  )}
                  icon={
                    <FaIcon
                      icon={`fas ${pathOr(
                        "fas fa-cube",
                        ["attributes", currentModule, "icon", "icon"],
                        sidebarLinks,
                      )}`}
                      size="1x"
                    />
                  }
                  setEmailModal={(data) => handleEmailPopup(data)}
                  onCloseRightSideBar={onCloseRightSideBar}
                />
              ))}
          </Grid>
        </Grid>
      </Scrollbars>
    );
  };

  return (
    <>
      <DrawerHeader title={LBL_GLOBAL_SMART_SEARCH_TITLE} />
      <MuiThemeProvider theme={getMuiTheme(theme)}>
        <div className={classes.searchFieldDiv}>
          <FormControl fullWidth>
            <Input
              placeholder={LBL_GLOBAL_SEARCH_TEXT_PLACEHOLDER}
              className={classes.searchField}
              id="queryString"
              name="queryString"
              value={queryString || ""}
              onChange={(e) => setQueryString(e.target.value)}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton
                    disabled={!queryString || queryString.length <= 2}
                    className={classes.iconButton}
                    size="small"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                  {queryString ? (
                    <IconButton
                      className={classes.drawerHeaderClose}
                      size="small"
                      onClick={clearSearch}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              }
              autoComplete="off"
            />
          </FormControl>
        </div>
        <Divider />
        {renderBody()}
        {emailModalVisible ? (
          <ComposeEmail
            open={emailModalVisible}
            handleClose={() => setEmailModalVisible(false)}
          />
        ) : null}
      </MuiThemeProvider>
    </>
  );
}
