import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import useStyles, { getMuiTheme } from "./styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { getHirePurchaseDetailView } from "../../../../../../src/store/actions/detail.actions";
import ControlledAccordions from "../../../../../components/ControlledAccordions";
import SkeletonShell from "../../../../../components/Skeleton/index";
import { pathOr} from "ramda";
export default function DetailTile({
  showDialogOpen,
  setShowDialogOpen,
  size = "md",
}) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down(size));
  const [data, setData] = useState([]);
  const { detailViewLoading, detailViewError } = useSelector(
    (state) => state.detail,
  );
  const handleClose = () => {
    setShowDialogOpen({
      open: false,
      id: null,
      module: null,
      label: null,
    });
  };
  const getHirePurchaseDetailViewData = useCallback(() => {
    module &&
      dispatch(
        getHirePurchaseDetailView(showDialogOpen.data),
      ).then((response) => {
        setData(pathOr([], ["data", "templateMeta", "data"], response));
      });
  }, [dispatch,showDialogOpen.data]);


  const handleEmailPopup = (data) => {};
  useEffect(() => {
    getHirePurchaseDetailViewData();
  }, [getHirePurchaseDetailViewData]);

  if (detailViewError) {
    return <h3>{detailViewError}</h3>;
  }
  return (
    <MuiThemeProvider theme={getMuiTheme(theme)}>

    <div>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={size}
        open={showDialogOpen.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
       
      >
        <DialogTitle id="responsive-dialog-title">{showDialogOpen.label || showDialogOpen.module}  </DialogTitle>
        <DialogContent>
          <DialogContentText  style={{minHeight:'500px',minWidth:'500px'}}>
    {detailViewLoading?<SkeletonShell layout="DetailView" />:       <>  <ControlledAccordions
                  data={data}
                  module={showDialogOpen.module}
                  view="detailview"
                  headerBackground="true"
                  setEmailModal={(data)=>handleEmailPopup(data)}
                  recordId={showDialogOpen.id}
                  hiddenAll={{hidden:[],disabled:[]}}

                /></>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} className={classes.showButtons} color="primary" variant="contained" >
            Close
          </Button>
 <Button href={`/app/editview/${showDialogOpen.module}/${showDialogOpen.id}`} className={classes.showButtons} color="primary" variant="contained" >Edit</Button>
          
        </DialogActions>
      </Dialog>
    </div>
    </MuiThemeProvider>
  );
}
