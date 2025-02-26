import React, { memo } from "react";
import { Breadcrumbs, Button, Grid } from "@material-ui/core";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import useStyles from "./styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  LBL_FIELD_MANAGER_LABEL,
  LBL_FIELD_MANAGER,
  LBL_LAYOUT_MANAGER_LABEL,
  LBL_LAYOUT_MANAGER,
  LBL_RELATIONSHIP_MANAGER_LABEL,
  LBL_RELATIONSHIP_MANAGER,
  LBL_SUBPANEL_MANAGER_LABEL,
  LBL_SUBPANEL_MANAGER,
  LBL_STUDIO,
  LBL_EXIT,
} from "@/constant";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  resetParameters,
  setSelectedParameter,
} from "@/store/actions/studio.actions";
import { pathOr } from "ramda";

const StudioBreadCrumb = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { module, manager, view } = useParams();
  const dispatch = useDispatch();
  const selectedParameter = useSelector(
    (state) => state.studio?.selectedParameter,
  );
  const moduleList = useSelector((state) => state.studio?.moduleList);
  let moduleLabel = pathOr(module, [module, "label"], moduleList);

  const renderManagerLabel = () => {
    switch (manager) {
      case LBL_FIELD_MANAGER:
        return LBL_FIELD_MANAGER_LABEL;
      case LBL_LAYOUT_MANAGER:
        return LBL_LAYOUT_MANAGER_LABEL;
      case LBL_RELATIONSHIP_MANAGER:
        return LBL_RELATIONSHIP_MANAGER_LABEL;
      case LBL_SUBPANEL_MANAGER:
        return LBL_SUBPANEL_MANAGER_LABEL;
    }
  };
  const breadcrumbData = [
    {
      label: LBL_STUDIO,
      link: "/app/studio/",
      onClick: dispatch(resetParameters()),
      visibility: true,
    },
    {
      label: moduleLabel,
      link: `/app/studio/${module}`,
      onClick: dispatch(setSelectedParameter(null)),
      visibility: module ? true : false,
    },
    {
      label: renderManagerLabel(),
      link: `/app/studio/${module}/${manager}`,
      onClick: dispatch(setSelectedParameter(null)),
      visibility: manager ? true : false,
    },
    {
      label: selectedParameter,
      link: `/app/studio/${module}/${manager}/${view}`,
      onClick: null,
      visibility: view && selectedParameter ? true : false,
    },
  ];
  return (
    <Grid container justifyContent="space-between" className={classes.grid}>
      <Grid item>
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" className={classes.link} />
          }
          className={classes.breadcrumb}
        >
          {breadcrumbData.map((data) => {
            return (
              data.visibility && (
                <Link
                  className={classes.link}
                  to={data.link}
                  onClick={() => {
                    data.onClick;
                  }}
                >
                  {data.label}
                </Link>
              )
            );
          })}
        </Breadcrumbs>
      </Grid>
      <Grid item className={classes.exit}>
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
      </Grid>
    </Grid>
  );
};

export default memo(StudioBreadCrumb);
