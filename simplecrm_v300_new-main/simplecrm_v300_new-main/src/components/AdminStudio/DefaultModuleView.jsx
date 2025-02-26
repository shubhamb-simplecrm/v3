import { Grid, Typography } from "@material-ui/core";
import React from "react";
import ViewCarouselIcon from "@material-ui/icons/ViewCarousel";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import FeaturedPlayListTwoToneIcon from "@material-ui/icons/FeaturedPlayListTwoTone";
import DvrTwoToneIcon from "@material-ui/icons/DvrTwoTone";
import useStyles from "./styles";
import {
  LBL_FIELD_MANAGER_LABEL,
  LBL_FIELD_MANAGER,
  LBL_LAYOUT_MANAGER_LABEL,
  LBL_LAYOUT_MANAGER,
  LBL_RELATIONSHIP_MANAGER_LABEL,
  LBL_RELATIONSHIP_MANAGER,
  LBL_SUBPANEL_MANAGER_LABEL,
  LBL_SUBPANEL_MANAGER,
  LBL_FIELD_MANAGER_DETAIL,
  LBL_RELATIONSHIP_MANAGER_DETAIL,
  LBL_SUBPANEL_MANAGER_DETAIL,
  LBL_LAYOUT_MANAGER_DETAIL,
} from "@/constant";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom";

const DefaultModuleView = (props) => {
  const { handleOnManagerClick } = props;
  const classes = useStyles();
  const { module } = useParams();

  const listArr = [
    {
      name: LBL_FIELD_MANAGER,
      label: LBL_FIELD_MANAGER_LABEL,
      description: LBL_FIELD_MANAGER_DETAIL,
      icon: <FeaturedPlayListTwoToneIcon className={classes.icon} />,
    },
    {
      name: LBL_LAYOUT_MANAGER,
      label: LBL_LAYOUT_MANAGER_LABEL,
      description: LBL_LAYOUT_MANAGER_DETAIL,
      icon: <ViewCarouselIcon className={classes.icon} />,
    },
    {
      name: LBL_RELATIONSHIP_MANAGER,
      label: LBL_RELATIONSHIP_MANAGER_LABEL,
      description: LBL_RELATIONSHIP_MANAGER_DETAIL,
      icon: <AccountTreeIcon className={classes.icon} />,
    },
    {
      name: LBL_SUBPANEL_MANAGER,
      label: LBL_SUBPANEL_MANAGER_LABEL,
      description: LBL_SUBPANEL_MANAGER_DETAIL,
      icon: <DvrTwoToneIcon className={classes.icon} />,
    },
  ];

  const redirectLink = (manager) => {
    return `/app/studio/${module}/${manager}${
      manager === LBL_LAYOUT_MANAGER
        ? `/editView`
        : manager === LBL_RELATIONSHIP_MANAGER
          ? `/addRelationship`
          : manager === LBL_FIELD_MANAGER
            ? `/addField`
            : ""
    }`;
  };

  return (
    <div className={classes.space}>
      <Grid container lg={12} md={12} sm={12} spacing={3}>
        {listArr.map((item, index) => {
          return (
            <Grid item lg={3} md={6} sm={12} xs={12}> 
               <Link
                to={redirectLink(item.name)}
                className={classes.link}
              >
                <div
                  className={classes.managerBox}
                  onClick={() => {
                    handleOnManagerClick(index, item.name);
                  }}
                >
                  {item.icon}
                  <Typography color="primary" className={classes.boxHeading}>
                    {item.label}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    className={classes.boxSubtitle}
                  >
                    {item.description}
                  </Typography>
                </div>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
export default DefaultModuleView;
