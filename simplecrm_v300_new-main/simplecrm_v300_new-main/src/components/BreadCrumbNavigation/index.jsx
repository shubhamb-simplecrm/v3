import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Breadcrumbs, Button } from "@material-ui/core";
import useStyles from "./styles";
import { Link } from "react-router-dom";
import { pathOr } from "ramda";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { LBL_EXIT } from "@/constant";

const BreadCrumbNavigation = () => {
  const classes = useStyles();
  const history = useHistory();
  const { section, module, id } = useParams();
  const portalAdminModuleList = useSelector(
    (state) => state?.portalAdmin?.portalAdminModuleList,
  );
  let portalAdminModule = pathOr(
    module,
    ["data", "datalabel"],
    portalAdminModuleList,
  );
  let portalAdminField = pathOr(
    {},
    ["data", "templateMeta", "data", id, "label"],
    portalAdminModuleList,
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "15px 20px",
      }}
    >
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" className={classes.link} />
        }
        aria-label="breadcrumb"
      >
        <Link
          className={classes.link}
          to="#"
          onClick={() => history.push(`/app/portalAdministrator/`)}
        >
          System Settings
        </Link>

        {section ? (
          <Link
            color="inherit"
            to="#"
            onClick={() => history.push(`/app/portalAdministrator/` + section)}
            className={classes.link}
          >
            {section === "FieldConfigurator"
              ? "Field Configurator"
              : section === "portalAdminLinks"
                ? "Add Admin Links"
                : section === "dropdownEditor"
                  ? "Dropdown Editor"
                  : section === "AdminListContent"
                    ? "Admin List Content"
                    : null}
          </Link>
        ) : null}

        {module ? (
          <Link
            onClick={() =>
              history.push(`/app/portalAdministrator/` + section + `/` + module)
            }
            to="#"
            className={classes.link}
          >
            {typeof portalAdminModule === "object" ? null : portalAdminModule}
          </Link>
        ) : null}

        {id ? (
          <Link
            onClick={() =>
              history.push(
                `/app/portalAdministrator/editview/` +
                  section +
                  `/` +
                  module +
                  `/` +
                  id,
              )
            }
            to="#"
            className={classes.link}
          >
            {typeof portalAdminField === "object" ? null : portalAdminField}
          </Link>
        ) : null}
      </Breadcrumbs>
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
  );
};

export default BreadCrumbNavigation;
