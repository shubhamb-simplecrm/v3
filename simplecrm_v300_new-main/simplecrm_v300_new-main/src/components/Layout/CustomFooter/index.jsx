import React from "react";
import { Paper, Link as MuiLink } from "@material-ui/core";
import QuickCreateGlobalButton from "../../QuickCreateGlobalButton";
import useStyles from "./styles";
import { memo } from "react";
import useCommonUtils from "@/hooks/useCommonUtils";
import { Link } from "react-router-dom";
import clsx from "clsx";
import EmailDraft from "@/components/ComposeEmail/EmailDraft";

const CustomFooter = () => {
  const classes = useStyles();
  const { currentProjectVersion, docsOpeningVisible } = useCommonUtils();
  return (
    <Paper
      component="footer"
      square
      variant="outlined"
      elevation={2}
      className={classes.footerRoot}
    >
      <EmailDraft />
      <div className={classes.footerItem}>
        <QuickCreateGlobalButton isMobile={false} />
      </div>
      <div className={clsx(classes.footerItem, classes.rightSection)}>
        <MuiLink
          component={Link}
          // onClick={()=>window.open(`https://simplecrmperformance.com:4568/docs/change-log/${currentProjectVersion.slice(1)}`)}
          // to = {"#"}
          to={!!docsOpeningVisible ? "/app/docs" : "#"}
          variant="caption"
        >
          {currentProjectVersion}
        </MuiLink>
      </div>
    </Paper>
  );
};

export default memo(CustomFooter);
