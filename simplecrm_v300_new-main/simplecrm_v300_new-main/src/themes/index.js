import defaultTheme from "./default";
import simpleX from "./simple-x";
import darkTheme from "./dark";
import "@fontsource/poppins";

import { createMuiTheme } from "@material-ui/core/styles";
const overrides = {
  typography: {
    fontFamily: "Poppins",
  },
  h1: {
    fontSize: "3rem",
  },
  h2: {
    fontSize: "2rem",
  },
  h3: {
    fontSize: "1.64rem",
  },
  h4: {
    fontSize: "1.5rem",
  },
  h5: {
    fontSize: "1.285rem",
  },
  h6: {
    fontSize: "1.142rem",
  },
};

export default {
  default: createMuiTheme({
    ...defaultTheme,
    ...overrides,
  }),
  dark: createMuiTheme({
    ...darkTheme,
    ...overrides,
  }),
  simpleX: createMuiTheme({
    ...simpleX,
    ...overrides,
  }),
};
