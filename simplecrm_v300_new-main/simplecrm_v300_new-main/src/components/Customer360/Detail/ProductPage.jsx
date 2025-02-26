import React, {Fragment } from 'react'
import {
  useTheme,
  Typography,
  IconButton,
} from '@material-ui/core'
import { useMediaQuery } from '@material-ui/core'
import { Dialog } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';

export default function ProfitF({
  openViewDetail,
  setOpenViewDetail,
  size = 'md',
  data,
  id,
}) {
  const currentTheme = useTheme()
  const fullScreen = useMediaQuery(
    currentTheme.breakpoints.down(size ? 'md' : 'sm')
  )
  
  
  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  const handleClose = () => {
    setOpenViewDetail(false)
  }

  return (
    <Fragment>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={openViewDetail ? true : false}
        maxWidth={size ? 'md' : 'md'}
        open={openViewDetail}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {'product Purchased on 01/01/2022'}
        </DialogTitle>
        <DialogContent>
        {'Invoice Number:1234567'}
        </DialogContent>
       
      </Dialog>
    </Fragment>
  )
}