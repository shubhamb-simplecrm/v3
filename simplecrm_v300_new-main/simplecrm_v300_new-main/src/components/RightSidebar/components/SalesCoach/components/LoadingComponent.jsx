import { Box, CircularProgress, Typography } from "@material-ui/core";
import useStyles from "./../styles";

export const LoadingComponent = () => {
  const classes = useStyles();
  const timeLeft = 10;
  return (
    <div className={classes.horizontalCenter}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={timeLeft} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {timeLeft}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};
