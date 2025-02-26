import React from "react";
import { useSelector } from "react-redux";
// styles
import useStyles from "./styles";
import { pathOr } from "ramda";
import { SOMETHING_WENT_WRONG } from "../../constant";
import EnvUtils from "../../common/env-utils";

function BrandLogo(props) {
  const classes = useStyles();
  const config = useSelector((state) => state.config);
  const { isFooter } = props;
  const currentThemeLogo =
    pathOr("simpleX", ["themeConfig", "currentTheme"], config) === "dark"
      ? "logo_image_dark"
      : "logo_image";

  const brandLogo = pathOr(
    pathOr("", ["config", "logo_image"], config),
    ["config", currentThemeLogo],
    config,
  );

  return (
    <>
      {brandLogo ? (
        // Added for footer logo
        isFooter ? (
          <div className={classes.footerLogo}>
            <img
              src={brandLogo}
              onError={() => console.log(SOMETHING_WENT_WRONG)}
              alt="brand-name"
              className={classes.cstmLogo}
            />
          </div>
        ) : (
          <div className={classes.logoBox}>
            <div>
              <img
                src={brandLogo}
                onError={() => console.log(SOMETHING_WENT_WRONG)}
                alt="brand-name"
                className={classes.imageLogo}
              />
            </div>
          </div>
        )
      ) : isFooter ? (
        <div className={classes.logoBox}>
          <div>
            <div className={classes.logotype}>
              {EnvUtils.getValue("REACT_APP_BRAND_NAME")}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <div className={classes.logoBoxDrawer}>
            <div className={classes.logotype}>
              {EnvUtils.getValue("REACT_APP_BRAND_NAME")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BrandLogo;
