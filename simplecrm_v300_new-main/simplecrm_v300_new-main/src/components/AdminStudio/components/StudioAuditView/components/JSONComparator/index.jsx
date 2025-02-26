import CustomDialog from "@/components/SharedComponents/CustomDialog";
import React, { useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { Tooltip } from "@material-ui/core";
import useStyles from "./styles";
import { LBL_VIEW_DIFFERENCE, LBL_VIEW_FULLSCREEN } from "@/constant";
import { isEmpty, isNil } from "ramda";

const JSONComparator = (props) => {
  const { showJsonComparator, handleCloseJsonCompare } = props;
  const classes = useStyles();
  const [displayFullScreen, setDisplayFullScreen] = useState(false);
  const toggleScreenWidth = () => {
    setDisplayFullScreen(!displayFullScreen);
  };
  return (
    <>
      <CustomDialog
        isDialogOpen={showJsonComparator.open}
        handleCloseDialog={handleCloseJsonCompare}
        bodyContent={
          isEmpty(showJsonComparator.oldValue) &&
          isEmpty(showJsonComparator.newValue) ? (
            <p className={classes.noDiffText}>No difference to show!</p>
          ) : (
            <ReactDiffViewer
              oldValue={showJsonComparator.oldValue}
              newValue={showJsonComparator.newValue}
              splitView={true}
              leftTitle="Old Value"
              rightTitle="New Value"
            />
          )
        }
        title={
          <div className={classes.header}>
            <p>{LBL_VIEW_DIFFERENCE}</p>
            {displayFullScreen ? (
              <FullscreenExitIcon
                onClick={() => toggleScreenWidth()}
                color="primary"
                className={classes.icon}
              />
            ) : (
              <Tooltip title={LBL_VIEW_FULLSCREEN}>
                <FullscreenIcon
                  onClick={() => toggleScreenWidth()}
                  color="primary"
                  className={classes.icon}
                />
              </Tooltip>
            )}
          </div>
        }
        fullScreen={displayFullScreen}
      />
    </>
  );
};
export default JSONComparator;
