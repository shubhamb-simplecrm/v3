import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    speedDial: {
      position: 'fixed',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
          bottom: theme.spacing(2),
          right: theme.spacing(8),
          [theme.breakpoints.down("xs")] : {
            right: theme.spacing(4),
          }
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
          top: theme.spacing(3),
          left: theme.spacing(3),
      },
    },

  fab: {
    backgroundColor: (theme.rightBarButtons.background + ' !important'),
    color: theme.rightBarButtons.text,
    border: '1px solid ' + theme.rightBarButtons.text
  }
}))