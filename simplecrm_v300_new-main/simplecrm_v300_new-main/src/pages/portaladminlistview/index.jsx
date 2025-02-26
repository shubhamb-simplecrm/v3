import React, { useCallback, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pathOr } from "ramda";
import { Link } from "react-router-dom";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import { ErrorBoundary, AdminListView, Skeleton } from "../../components";
import useStyles from "./styles";
import WorkIcon from "@material-ui/icons/Work";
import { portalAdminLinks } from "../../store/actions/portalAdmin.actions";
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation";
import { MenuConfigurator } from "@/components/RightSidebar/components";
import { useIsMobileView } from "@/hooks/useIsMobileView";
import { LBL_ACCESS_DENIED, LBL_ACCESS_DENIED_MSG } from "@/constant";

const PortalAdminListView = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { section } = useParams();
  const isMobileView = useIsMobileView();
  let isAdmin = pathOr(
    false,
    ["currentUserData", "data", "attributes", "is_admin"],
    useSelector((state) => state.config),
  );
  const [adminLinkList, setAdminLinkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenMenuConfiguration, setIsOpenMenuConfiguration] = useState(false);

  const getAdminViewData = useCallback(() => {
    setIsLoading(true);
    dispatch(portalAdminLinks()).then((res) => {
      setAdminLinkList(pathOr([], ["data"], res));
      setIsLoading(false);
    });
  }, []);

  const disableListItem = (item) => {
    return (
      (item.link == "portalAdminLinks" && (!isAdmin || isAdmin == 0)) ||
      (isMobileView && item.link != "menuConfigurator")
    );
  };

  const getRedirectLink = (linkName) => {
    let url = "";
    switch (linkName) {
      case "OpenAI":
        url = `/app/scrm_OpenAIPrompt`;
        break;
      case "dropdownEditor":
        url = `/app/dropdownEditor/`;
        break;
      case "menuConfigurator":
        url = `#`;
        break;
      case "Studio":
        url = `/app/studio`;
        break;
      case "V267Administrator":
        url = `/app/administrator`;
        break;
      default:
        url = `/app/portalAdministrator/` + linkName;
    }
    return url;
  };

  const handleOnClick = (linkName) => {
    switch (linkName) {
      case "menuConfigurator":
        setIsOpenMenuConfiguration(!isOpenMenuConfiguration);
        break;
      default:
        history.push(getRedirectLink(linkName));
    }
  };

  const showList = (item) => {
    let redirectLink = getRedirectLink(item.link);
    return (
      !disableListItem(item) && (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <WorkIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Link
                onClick={() => handleOnClick(item.link)}
                className={classes.link}
                to={redirectLink}
                variant="body2"
              >
                {item.name}
              </Link>
            }
            secondary={item.description}
          />
        </ListItem>
      )
    );
  };

  const showView = (adminLinkList, section) => {
    if (section) {
      return <AdminListView />;
    } else {
      return (
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {adminLinkList.map((item) => showList(item))}
        </List>
      );
    }
  };

  useEffect(() => {
    getAdminViewData();
  }, [getAdminViewData]);

  if (!isAdmin) {
    return (
      <div className={classes.noAccessPage}>
        <h3 className={classes.noAccessText}>{LBL_ACCESS_DENIED}</h3>
        <h6 className={classes.noAccessText}>{LBL_ACCESS_DENIED_MSG}</h6>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton />;
  }
  return (
    <ErrorBoundary>
      {isOpenMenuConfiguration && (
        <MenuConfigurator
          open={isOpenMenuConfiguration}
          close={() => setIsOpenMenuConfiguration(!isOpenMenuConfiguration)}
        />
      )}
      <Paper>
        {section && <BreadCrumbNavigation />}
        {showView(adminLinkList, section)}
      </Paper>
    </ErrorBoundary>
  );
};

export default PortalAdminListView;
