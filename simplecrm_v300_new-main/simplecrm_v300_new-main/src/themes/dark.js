import tinycolor from "tinycolor2";

const primary = "#BB86FC";
const secondary = "#03DAC5";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";
const menumobiledark = "#424242";
const listview = "#424242";

const lightenRate = 7.5;
const darkenRate = 15;

export default {
  palette: {
    type: "dark",
    primary: {
      main: primary,
      light: tinycolor(primary).lighten(lightenRate).toHexString(),
      dark: tinycolor(primary).darken(darkenRate).toHexString(),
      menumobile: menumobiledark,
      listview: listview,
    },
    secondary: {
      main: secondary,
      light: tinycolor(secondary).lighten(lightenRate).toHexString(),
      dark: tinycolor(secondary).darken(darkenRate).toHexString(),
      contrastText: "#FFFFFF",
    },
    activityStream: {
      link: "#BB86FC",
      comment: {
        username: "white",
        color: "white",
        background1: "#4a484b",
        background2: "#585659",
      },
    },
    studio: {
      defaultColumns: {
        color: "green",
        bgColor: "#0080000d",
      },
      availableColumns: {
        color: "#E88A00",
        bgColor: "#e88a000a",
      },
      hiddenColumns: {
        color: "#DE3D31",
        bgColor: "#de3d310a",
      },
    },
    warning: {
      main: warning,
      light: tinycolor(warning).lighten(lightenRate).toHexString(),
      dark: tinycolor(warning).darken(darkenRate).toHexString(),
    },
    success: {
      main: success,
      light: tinycolor(success).lighten(lightenRate).toHexString(),
      dark: tinycolor(success).darken(darkenRate).toHexString(),
    },
    info: {
      main: info,
      light: tinycolor(info).lighten(lightenRate).toHexString(),
      dark: tinycolor(info).darken(darkenRate).toHexString(),
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      hint: "rgba(255, 255, 255, 0.5)",
      highlight: "#BB86FC",
    },
    icon: {
      color: "white",
      defaultColor: "rgb(224, 222, 224)",
    },
    background: {
      paper: "rgba(66,66,66,1)",
      default: "#303030",
      dashletBg: "rgb(55,47,59)",
      linkActive: "#BB86FC",
      linkActiveBg: "rgba(255, 255, 255, 0.08)",
      sidebar: "rgba(66,66,66,1)",
      wrapbg: "rgb(55, 47, 59)",
      border: "rgb(36, 31, 38)",
      action: {
        active: "#fff",
        hover: "rgba(255, 255, 255, 0.08)",
        hoverOpacity: "0.08",
        selected: "rgba(255, 255, 255, 0.16)",
        selectedOpacity: "0.16",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        disabledOpacity: "0.38",
        focus: "rgba(255, 255, 255, 0.12)",
        focusOpacity: "0.12",
        activatedOpacity: "0.24",
      },
      listView: "#cccccc26",
    },
    compEmailBack: {
      default: "#303030",
    },
    label: {
      listView: {
        color: "#cbcaca",
      },
      detailView: {
        color: "#cbcaca",
      },
    },
  },

  appbar: {
    background: "#303030",
    text: "#fff",
  },
  rightBarButtons: {
    background: primary,
    text: "#ffffff",
  },
  rightBarButtonsActive: {
    background: secondary,
    text: "#ffffff",
  },
  dashletHeader: {
    background: "#303030",
    text: "#fff",
  },
  overlayBg: {
    background: "rgb(48 48 48 / 59%)",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "rgba(66,66,66,1)",
    900: "#212121",
    A100: "#d5d5d5",
    A200: "#aaaaaa",
    A400: "#303030",
    A700: "#616161",
  },
  brdrWidth: 0,
  padng: "3px 2px",
  rightBrdr: "-15px",
  tdTop: 0,
  overrides: {
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#616161 !important",
          "&:focus": {
            backgroundColor: "#616161",
          },
        },
      },
      button: {
        "&:hover, &:focus": {
          backgroundColor: "#616161",
        },
      },
    },
    MuiTouchRipple: {
      child: {
        backgroundColor: "white",
      },
    },
    MuiTableRow: {
      root: {
        height: 56,
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "1px solid rgba(224, 224, 224, .5)",
      },
      head: {
        fontSize: "0.95rem",
      },
      body: {
        fontSize: "0.95rem",
      },
    },

    /* Custom Tab css by Ritesh */
    MuiTabs: {
      flexContainer: {
        borderBottom: "1px solid #ccc",
      },
    },
    MuiTab: {
      root: {
        minHeight: "0px",
        padding: "10px 15px",
        // eslint-disable-next-line no-useless-computed-key
        ["@media (min-width: 600px)"]: {
          minWidth: "0px",
        },
      },
      wrapper: {
        display: `inline-block`,
        textTransform: "capitalize",
      },
      textColorInherit: {
        "&$selected": {
          color: primary,
          //backgroundColor: primary,
          borderBottom: "3px solid " + primary,
        },
      },
    },
    PrivateTabIndicator: {
      root: {
        height: 0,
      },
    },
    MuiAccordionSummary: {
      root: {
        "&$expanded": {
          margin: "0 !important",
          minHeight: "100% !important",
        },
        "&$selected": {
          color: "#536dfe",
        },
      },
      content: {
        "&$expanded": {
          margin: "0 !important",
          minHeight: "100% !important",
        },
      },
    },
    MuiAccordion: {
      rounded: {
        "&:first-child": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        "&$expanded": {
          border: "1px solid #cccccc43",
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 0,
      },
      elevation1: {
        boxShadow: "none",
      },
      elevation4: {
        boxShadow: "none",
      },
    },
  },
  bolBhaiGPT: {
    palette: {
      defaultColor: "rgb(224, 222, 224)",
      loadingSectionColor: "#fff",
      userMessageBackground: "#BB86FC",
    },
  },
};
