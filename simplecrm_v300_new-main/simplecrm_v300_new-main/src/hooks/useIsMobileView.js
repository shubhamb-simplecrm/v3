import { useMediaQuery, useTheme } from "@material-ui/core";

export const useIsMobileView = (breakpoint = "xs") => {
  const theme = useTheme();
  let isViewCheck = useMediaQuery(theme.breakpoints.down(breakpoint), {
    noSsr: true,
  });
  return isViewCheck;
};